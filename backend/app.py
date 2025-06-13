from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_mysqldb import MySQL
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import MySQLdb.cursors
import re

app = Flask(__name__)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'agriflow'
app.config['SECRET_KEY'] = 'adplc4pple4'

mysql = MySQL(app)

login_manager = LoginManager()
login_manager.init_app(app)

# Class User untuk flask_login
class User(UserMixin):
    def __init__(self, id, username, email, is_admin):
        self.id = id
        self.username = username
        self.email = email
        self.is_admin = is_admin

    def get_id(self):
        return str(self.id)

# Loader user untuk flask_login
@login_manager.user_loader
def load_user(user_id):
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT * FROM accounts WHERE id = %s", (user_id,))
    account = cur.fetchone()
    cur.close()
    if account:
        return User(account["id"], account["username"], account["email"], account["is_admin"])
    return None

# Register endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if None in [username, email, password]:
        return jsonify({"error": "Semua field harus diisi"}), 400

    if ' ' in username:
        return jsonify({"error": "Username tidak boleh mengandung spasi"}), 400

    if len(username) > 20:
        return jsonify({"error": "Username maksimal 20 karakter"}), 400

    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify({"error": "Format email tidak valid"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password minimal 8 karakter"}), 400

    cur = None
    try:
        cur = mysql.connection.cursor()

        cur.execute("SELECT id FROM accounts WHERE username = %s", (username,))
        if cur.fetchone():
            return jsonify({"error": "Username sudah terdaftar"}), 409

        cur.execute("SELECT id FROM accounts WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email sudah terdaftar"}), 409

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        cur.execute("INSERT INTO accounts (username, email, password) VALUES (%s, %s, %s)",
                    (username, email, hashed_password))
        mysql.connection.commit()

        return jsonify({"message": "Pendaftaran berhasil"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()


# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    username = data.get("username")
    password = data.get("password")

    if None in [username, password]:
        return jsonify({"error": "Semua field harus diisi"}), 400

    if ' ' in username:
        return jsonify({"error": "Username tidak boleh mengandung spasi"}), 400

    if len(username) > 20:
        return jsonify({"error": "Username maksimal 20 karakter"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password minimal 8 karakter"}), 400

    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM accounts WHERE username = %s", (username,))
        account = cur.fetchone()

        if not account:
            return jsonify({"error": "Username belum terdaftar"}), 401

        if not bcrypt.check_password_hash(account["password"], password):
            return jsonify({"error": "Password salah"}), 401

        user = User(account["id"], account["username"], account["email"], account["is_admin"])
        login_user(user)

        return jsonify({
            "message": "Login berhasil",
            "role": bool(account["is_admin"])
        }), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()


@app.route('/check-login', methods=['GET'])
def check_login():
    if current_user.is_authenticated:
        return jsonify({
            "logged_in": True,
            "role": current_user.is_admin
        }), 200
    return jsonify({"logged_in": False}), 200

# Ambil data profil
@app.route('/profile', methods=['GET'])
@login_required
def get_profile():
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.is_admin,
        "message": "Data profil berhasil diambil"
    }), 200

# Update data profil
@app.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400
        
    username = data.get("username")
    email = data.get("email")
    
    # Validasi input
    if not username or not email:
        return jsonify({"error": "Username dan email harus diisi"}), 400
    
    if len(username) > 20:
        return jsonify({"error": "Username maksimal 20 karakter"}), 400
        
    if ' ' in username:
        return jsonify({"error": "Username tidak boleh mengandung spasi"}), 400

    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify({"error": "Format email tidak valid"}), 400

    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Cek duplikat username/email
        cur.execute("SELECT id FROM accounts WHERE username = %s AND id != %s", 
                   (username, current_user.id))
        if cur.fetchone():
            return jsonify({"error": "Username sudah digunakan"}), 409
            
        cur.execute("SELECT id FROM accounts WHERE email = %s AND id != %s", 
                   (email, current_user.id))
        if cur.fetchone():
            return jsonify({"error": "Email sudah digunakan"}), 409

        # Update data
        cur.execute("""
            UPDATE accounts 
            SET username = %s, email = %s 
            WHERE id = %s
        """, (username, email, current_user.id))
        
        mysql.connection.commit()
        return jsonify({
            "message": "Profil berhasil diperbarui",
            "username": username,
            "email": email
        }), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500
    finally:
        if cur:
            cur.close()

# Ganti password
@app.route('/change-password', methods=['POST'])
@login_required
def change_password():
    data = request.get_json()
    
    # Validasi
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400
        
    current_pw = data.get("currentPassword")
    new_pw = data.get("newPassword")
    
    if not current_pw or not new_pw:
        return jsonify({"error": "Password saat ini dan baru harus diisi"}), 400
        
    if len(new_pw) < 8:
        return jsonify({"error": "Password baru minimal 8 karakter"}), 400

    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Verifikasi password lama
        cur.execute("SELECT password FROM accounts WHERE id = %s", (current_user.id,))
        account = cur.fetchone()
        
        if not bcrypt.check_password_hash(account['password'], current_pw):
            return jsonify({"error": "Password saat ini salah"}), 401
        
        # Update password baru
        hashed_pw = bcrypt.generate_password_hash(new_pw).decode('utf-8')
        cur.execute("UPDATE accounts SET password = %s WHERE id = %s", 
                   (hashed_pw, current_user.id))
        mysql.connection.commit()
        
        return jsonify({"message": "Password berhasil diubah"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500
    finally:
        if cur:
            cur.close()

# Logout endpoint
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout berhasil"}), 200

# Ambil data katalog
@app.route('/get-katalog', methods=['GET'])
@login_required
def get_katalog():
    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT id, jenis_benih, varietas, umur, harga, stok, deskripsi, url_gambar FROM data_benih")
        data_benih = cur.fetchall()
        
        return jsonify(data_benih), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

# Ambil detail katalog berdasarkan ID
@app.route('/get-katalog/<int:id>', methods=['GET'])
@login_required
def get_katalog_by_id(id):
    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM data_benih WHERE id = %s", (id,))
        data = cur.fetchone()

        if not data:
            return jsonify({"error": "Data tidak ditemukan"}), 404

        return jsonify({
            "id": data["id"],
            "jenis": data["jenis_benih"],
            "varietas": data["varietas"],
            "umur": data["umur"],
            "harga": data["harga"],
            "stok": data["stok"],
            "deskripsi": data["deskripsi"],
            "url_gambar": data["url_gambar"]
            }), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

# Tambah data katalog
@app.route('/add-katalog', methods=['POST'])
@login_required
def add_katalog():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    if None in [data.get("jenis"), data.get("varietas"), data.get("umur"), data.get("harga"), data.get("stok"), data.get("deskripsi"), data.get("url_gambar")]:
        return jsonify({"error": "Semua field harus diisi"}), 400

    jenis = data.get("jenis")
    varietas = data.get("varietas")
    umur = data.get("umur")
    harga = data.get("harga")
    stok = data.get("stok")
    deskripsi = data.get("deskripsi")
    url_gambar = data.get("url_gambar")

    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO data_benih (jenis_benih, varietas, umur, harga, stok, deskripsi, url_gambar) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (jenis, varietas, umur, harga, stok, deskripsi, url_gambar)
        )
        mysql.connection.commit()
        return jsonify({"message": "Katalog berhasil ditambahkan"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

# Edit data katalog
@app.route('/edit-katalog', methods=['POST'])
@login_required
def edit_katalog():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    if None in [data.get("id"), data.get("jenis"), data.get("varietas"), data.get("umur"), data.get("harga"), data.get("stok"), data.get("deskripsi"), data.get("url_gambar")]:
        return jsonify({"error": "Semua field harus diisi"}), 400

    id = data.get("id")
    jenis = data.get("jenis")
    varietas = data.get("varietas")
    umur = data.get("umur")
    harga = data.get("harga")
    stok = data.get("stok")
    deskripsi = data.get("deskripsi")
    url_gambar = data.get("url_gambar")

    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "UPDATE data_benih SET jenis_benih = %s, varietas = %s, umur = %s, harga = %s, stok = %s, deskripsi = %s, url_gambar = %s WHERE id = %s",
            (jenis, varietas, umur, harga, stok, deskripsi, url_gambar, id)
        )
        mysql.connection.commit()
        return jsonify({"message": "Katalog berhasil diubah"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()
            
# Hapus data katalog
@app.route('/remove-katalog', methods=['DELETE'])
@login_required
def remove_katalog():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    if not data.get("id"):
        return jsonify({"error": "ID harus diisi"}), 400

    id = data.get("id")

    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM data_benih WHERE id = %s", (id,))
        mysql.connection.commit()
        return jsonify({"message": "Katalog berhasil dihapus"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

# Ambil data wishlist
@app.route('/get-wishlists', methods=['GET'])
@login_required
def get_wishlists():
    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
        SELECT b.* 
        FROM wishlists w 
        JOIN data_benih b ON w.benih_id = b.id
        WHERE w.user_id = %s
        """, (current_user.id,))

        wishlists = cur.fetchall()
        return jsonify(wishlists), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

# Cek benih ada di wishlist user berdasarkan ID
@app.route('/check-wishlist/<int:benih_id>', methods=['GET'])
@login_required
def check_wishlist(benih_id):
    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM wishlists WHERE user_id = %s AND benih_id = %s", (current_user.id, benih_id))
        wishlist_item = cur.fetchone()

        if wishlist_item:
            return jsonify({"isWishlisted": True}), 200
        else:
            return jsonify({"isWishlisted": False}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

@app.route('/add-wishlist', methods=['POST'])
@login_required
def add_wishlist():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    benih_id = data.get("benih_id")
    if not benih_id:
        return jsonify({"error": "ID benih harus diisi"}), 400

    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO wishlists (user_id, benih_id) VALUES (%s, %s)", (current_user.id, benih_id))
        mysql.connection.commit()
        return jsonify({"message": "Benih berhasil ditambahkan ke wishlist"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

@app.route('/remove-wishlist', methods=['DELETE'])
@login_required
def remove_wishlist():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    benih_id = data.get("benih_id")
    if not benih_id:
        return jsonify({"error": "ID benih harus diisi"}), 400

    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM wishlists WHERE user_id = %s AND benih_id = %s", (current_user.id, benih_id))
        mysql.connection.commit()
        return jsonify({"message": "Benih berhasil dihapus dari wishlist"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

@app.route('/get-comments/<int:benih_id>', methods=['GET'])
@login_required
def get_comments(benih_id):
    if not benih_id:
        return jsonify({"error": "ID benih harus diisi"}), 400
    
    benih_id = benih_id
    cur = None
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
            SELECT c.*, a.username
            FROM comments c 
            JOIN accounts a ON c.account_id = a.id
            WHERE c.benih_id = %s
            """, (benih_id,))

        comments = cur.fetchall()

        return jsonify({"comments": comments, 
                        "user_id": current_user.id}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

@app.route('/add-comment', methods=['POST'])
@login_required
def add_comment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    benih_id = data.get("benih_id")
    if not benih_id:
        return jsonify({"error": "ID benih harus diisi"}), 400

    content = data.get("content")
    parent_id = data.get("parent_id")

    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO comments (account_id, benih_id, content, parent_id) 
            VALUES (%s, %s, %s, %s)""", (current_user.id, benih_id, content, parent_id))
        mysql.connection.commit()
        return jsonify({"message": "Komentar berhasil ditambahkan"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

@app.route('/edit-comment', methods=['POST'])
@login_required
def edit_comment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    comment_id = data.get("comment_id")
    if not comment_id:
        return jsonify({"error": "ID komentar harus diisi"}), 400

    content = data.get("content")
    account_id = data.get("account_id")
    if account_id != current_user.id:
        return jsonify({"error": "Anda tidak memiliki izin untuk mengubah komentar ini"}), 403
    
    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE comments SET content = %s WHERE id = %s AND account_id = %s", (content, comment_id, account_id))
        mysql.connection.commit()
        return jsonify({"message": "Komentar berhasil diubah"}), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()

# SOLUSI ALTERNATIF YANG LEBIH SEDERHANA
@app.route('/delete-comment', methods=['DELETE'])
@login_required
def remove_comment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Data harus berupa JSON"}), 400

    comment_id = data.get("comment_id")
    if not comment_id:
        return jsonify({"error": "ID komentar harus diisi"}), 400

    cur = None
    try:
        cur = mysql.connection.cursor()
        
        # Jika user adalah admin, bisa menghapus komentar siapa saja
        if current_user.is_admin:
            cur.execute("DELETE FROM comments WHERE id = %s", (comment_id,))
        else:
            # Jika bukan admin, hanya bisa menghapus komentar sendiri
            cur.execute("DELETE FROM comments WHERE id = %s AND account_id = %s", (comment_id, current_user.id))
        
        if cur.rowcount == 0:
            return jsonify({"error": "Komentar tidak ditemukan atau Anda tidak memiliki izin"}), 404
            
        mysql.connection.commit()
        return jsonify({"message": "Komentar berhasil dihapus"}), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": f"Terjadi kesalahan server: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()


# Penerapan AI
# import joblib
# import numpy as np
# import pandas as pd

# model = joblib.load('models/xgb_model.pkl')
# scaler = joblib.load('models/scaler.pkl')
# encoder = joblib.load('models/encoder.pkl')

# numerical_features = ["precip_mm", "humidity", "temp_c", "heatindex_c", 
#                      "wind_kph", "cloud", "uv", "dewpoint_c", "is_day", 
#                      "umur", "umur_max"]
# categorical_features = ["jenis_benih"]

from useModel import flask_predict

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ambil data dari request
        data = request.json
        
        # Panggil Model AI
        result = flask_predict(data)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}',
            'data': None
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
