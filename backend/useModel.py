import requests
import xgboost as xgb
import pandas as pd
import numpy as np
import joblib
import logging

# Logging disiapkan untuk mencatat proses dan error
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 1. Ambil Data Cuaca dari API ---
def get_weather_data(lat, lon, days=7):
    api_key = "d30f925cc0244522a7e185421251206"
    url = f"https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={lat},{lon}&days={days}&aqi=no&alerts=no"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Gagal ambil data cuaca: {e}")
        return None

# --- 2. Preprocessing Data Cuaca & Input ---
def extract_numerical_features(raw_data):
    features_list = []
    condition_list = []
    
    try:
        for day in raw_data["forecast"]["forecastday"]:
            for hour in day["hour"]:
                row = {
                    "precip_mm": hour.get('precip_mm', 0.0),
                    "humidity": hour.get('humidity', 0),
                    "temp_c": hour.get('temp_c', 0.0),
                    "heatindex_c": hour.get('heatindex_c', hour.get('temp_c', 0.0)),
                    "wind_kph": hour.get('wind_kph', 0.0),
                    "cloud": hour.get('cloud', 0),
                    "uv": hour.get('uv', 0.0),
                    "dewpoint_c": hour.get('dewpoint_c', 0.0),
                    "is_day": hour.get('is_day', 1)
                }
                features_list.append(row)
                condition_list.append(hour.get('condition', {}).get('text', 'unknown'))
        return features_list, condition_list
    except Exception as e:
        logger.error(f"Ekstraksi fitur gagal: {e}")
        return None, None

def combine_features(weather_features, frontend_data):
    try:
        df = pd.DataFrame(weather_features)

        df['jenis_benih'] = frontend_data.get('jenis_benih')
        df['umur'] = frontend_data.get('umur')
        df['umur_max'] = frontend_data.get('umur_max')
    
        # Kolom disamakan dengan training
        # Categorical features: jenis_benih
        # Numerical features: precip_mm, humidity, temp_c, heatindex_c, wind_kph, cloud, uv, dewpoint_c, is_day, umur, umur_max
        column_order = [
            "jenis_benih",
            "precip_mm", "humidity", "temp_c", "heatindex_c", 
            "wind_kph", "cloud", "uv", "dewpoint_c", "is_day",
            "umur", "umur_max"
        ]
        
        return df[column_order]
    except Exception as e:
        logger.error(f"Gagal gabungkan fitur: {e}")
        return None

# --- 3. Prediksi dengan Model XGBoost yang Sudah Dilatih ---
class WeatherPredictor:
    def __init__(self, model_path='models/xgb_model.pkl', 
                 scaler_path='models/scaler.pkl', 
                 encoder_path='models/encoder.pkl'):

        self.model = None
        self.scaler = None
        self.encoder = None
        self.is_loaded = False
        
        # Definisi fitur sesuai dengan training
        self.numerical_features = ["precip_mm", "humidity", "temp_c", "heatindex_c",
                                  "wind_kph", "cloud", "uv", "dewpoint_c", "is_day",
                                  "umur", "umur_max"]
        self.categorical_features = ["jenis_benih"]
        
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.encoder_path = encoder_path
        
        self._load_components()
    
    def _load_components(self):
        try:
            logger.info("Memuat model, scaler, dan encoder...")
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            self.encoder = joblib.load(self.encoder_path)
            self.is_loaded = True
            logger.info("Model, scaler, dan encoder berhasil dimuat")
        except Exception as e:
            logger.error(f"Load model gagal: {e}")
            self.is_loaded = False
            raise e
    
    def _prepare_features(self, df):
        if not self.is_loaded:
            raise Exception("Model belum dimuat")
        
        try:
            # Pisahkan fitur numerical dan categorical
            X_num = df[self.numerical_features].copy()
            X_cat = df[self.categorical_features].copy()
            
            logger.info(f"Fitur numerical: {X_num.columns.tolist()}")
            logger.info(f"Fitur categorical: {X_cat.columns.tolist()}")
            
            # Transform numerical features dengan scaler
            X_num_scaled = self.scaler.transform(X_num)
            X_num_df = pd.DataFrame(X_num_scaled, columns=self.numerical_features, index=df.index)
            
            # Transform categorical features dengan encoder
            X_cat_encoded = self.encoder.transform(X_cat)
            cat_columns = self.encoder.get_feature_names_out(self.categorical_features)
            X_cat_df = pd.DataFrame(X_cat_encoded, columns=cat_columns, index=df.index)
            
            logger.info(f"Kolom setelah encoding: {cat_columns}")
            
            # Gabungkan dengan urutan yang SAMA seperti training
            X_processed = pd.concat([X_cat_df, X_num_df], axis=1)
            
            logger.info(f"Kolom final: {X_processed.columns.tolist()}")
            logger.info(f"Shape final: {X_processed.shape}")
            
            return X_processed.values
            
        except Exception as e:
            logger.error(f"Prepare features gagal: {e}")
            raise e
    
    def predict(self, df):
        try:
            X_prepared = self._prepare_features(df)
            predictions = self.model.predict(X_prepared)
            return predictions.tolist()
        except Exception as e:
            logger.error(f"Prediksi gagal: {e}")
            raise e

# --- 4. Proses Lengkap Prediksi dari Input User ---
def predict_from_frontend_data(frontend_data, lat, lon, days=7):
    try:
        logger.info(f"Mulai prediksi di lokasi: ({lat}, {lon})")
        logger.info(f"Data input: {frontend_data}")
        
        required_fields = ['jenis_benih', 'umur', 'umur_max']
        for field in required_fields:
            if field not in frontend_data:
                raise ValueError(f"Field wajib kosong: {field}")

        raw_weather_data = get_weather_data(lat, lon, days)
        if raw_weather_data is None:
            raise Exception("Gagal ambil data cuaca")

        weather_features, weather_conditions = extract_numerical_features(raw_weather_data)
        if weather_features is None:
            raise Exception("Gagal ekstrak fitur cuaca")

        combined_df = combine_features(weather_features, frontend_data)
        if combined_df is None:
            raise Exception("Gagal gabungkan fitur")

        logger.info(f"Jumlah fitur: {combined_df.shape[1]}")

        predictor = WeatherPredictor()
        predictions = predictor.predict(combined_df)

        response = {
            'success': True,
            'data': {
                'predictions': predictions,
                'weather_conditions': weather_conditions,
                'total_predictions': len(predictions),
            },
            'metadata': {
                'location': {'lat': lat, 'lon': lon},
                'input_data': frontend_data,
                'feature_count': len(combined_df.columns),
                'data_points': len(combined_df)
            }
        }
        
        logger.info("Prediksi selesai")
        return response
        
    except Exception as e:
        logger.error(f"Proses prediksi gagal: {e}")
        return {
            'success': False,
            'error': str(e),
            'data': None,
            'metadata': None
        }

# --- 5. Validasi Input User ---
def validate_frontend_data(data):
    errors = []
    
    required_fields = ['jenis_benih', 'umur', 'umur_max']
    for field in required_fields:
        if field not in data:
            errors.append(f"Field '{field}' tidak boleh kosong")
    
    if 'jenis_benih' in data:
        valid_types = ['padi', 'jagung']
        if data['jenis_benih'] not in valid_types:
            errors.append(f"jenis_benih harus salah satu dari: {valid_types}")
    
    if 'umur' in data:
        try:
            umur = int(data['umur'])
            if umur < 0:
                errors.append("umur harus ≥ 0")
        except (ValueError, TypeError):
            errors.append("umur harus berupa angka")
    
    if 'umur_max' in data:
        try:
            umur_max = int(data['umur_max'])
            if umur_max < 0:
                errors.append("umur_max harus ≥ 0")
        except (ValueError, TypeError):
            errors.append("umur_max harus berupa angka")
    
    if 'umur' in data and 'umur_max' in data:
        try:
            if int(data['umur']) > int(data['umur_max']):
                errors.append("umur tidak boleh lebih besar dari umur_max")
        except (ValueError, TypeError):
            pass
    
    return errors

# --- 6. Fungsi Utama untuk Integrasi Flask ---
def flask_predict(request_data):
    try:
        lat = -8.148345694018797
        lon = 113.69021949911586
        days = request_data.get('days', 7)
        
        frontend_data = {
            'jenis_benih': request_data.get('jenis_benih'),
            'umur': request_data.get('umur'),
            'umur_max': request_data.get('umur_max')
        }

        data_errors = validate_frontend_data(frontend_data)
        if data_errors:
            return {
                'success': False,
                'error': 'Validasi input gagal',
                'validation_errors': data_errors,
                'data': None
            }

        result = predict_from_frontend_data(frontend_data, lat, lon, int(days))
        return result
        
    except Exception as e:
        logger.error(f"Error server: {e}")
        return {
            'success': False,
            'error': f'Error server: {str(e)}',
            'data': None
        }

# --- 7. Fungsi Test untuk Debugging ---
def test_feature_order():
    try:
        predictor = WeatherPredictor()
        
        # Buat data dummy
        sample_data = {
            'jenis_benih': 'padi',
            'precip_mm': 0.5,
            'humidity': 80,
            'temp_c': 30.0,
            'heatindex_c': 32.0,
            'wind_kph': 5.0,
            'cloud': 50,
            'uv': 8.0,
            'dewpoint_c': 25.0,
            'is_day': 1,
            'umur': 45,
            'umur_max': 120
        }
        
        df_test = pd.DataFrame([sample_data])
        X_prepared = predictor._prepare_features(df_test)
        
        print("Test preprocessing berhasil")
        print(f"Shape data: {X_prepared.shape}")
        return True
        
    except Exception as e:
        print(f"Test preprocessing gagal: {e}")
        return False