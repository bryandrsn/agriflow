import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
  Alert,
  Table,
  Badge,
  Accordion
} from "react-bootstrap";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import { 
  FaSeedling, 
  FaChartLine, 
  FaLeaf, 
  FaHistory, 
  FaSun, 
  FaCalendarAlt,
  FaTint,
  FaCloud,
  FaCloudSun
} from "react-icons/fa";
import { IoWaterSharp } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";

const Optimasi = () => {
  const [formData, setFormData] = useState({
    jenisTanaman: "",
    umurTanaman: "",
    umurTanamanMax: "",
    days: 7,
  });
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState("0");

  const jenis = [
    { value: "Padi" },
    { value: "Jagung" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPredictions(null);

    if (!formData.jenisTanaman || !formData.umurTanaman || !formData.umurTanamanMax) {
      setError("Harap isi semua field yang wajib!");
      return;
    }

    const umur = parseInt(formData.umurTanaman);
    const umurMax = parseInt(formData.umurTanamanMax);

    if (umur > umurMax) {
      setError("Usia tanaman tidak boleh lebih besar dari usia panen!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          jenis_benih: formData.jenisTanaman.toLowerCase(),
          umur: umur,
          umur_max: umurMax,
          days: formData.days,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan prediksi");
      }

      setPredictions({
        jenisTanaman: formData.jenisTanaman,
        umurTanaman: formData.umurTanaman,
        umurTanamanMax: formData.umurTanamanMax,
        prediksi: data.data.predictions,
        kondisiCuaca: data.data.weather_conditions,
        days: formData.days
      });
      setActiveDay("0"); // Set first day as active by default
    } catch (error) {
      setError("Terjadi kesalahan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categorizeWeather = (condition) => {
    const lowerCondition = condition.toLowerCase();
    
    // Rain conditions
    const rainKeywords = [
      'rain', 'shower', 'drizzle', 'torrential', 'patchy rain possible',
      'thundery outbreaks possible', 'freezing drizzle', 'light rain', 
      'moderate rain', 'heavy rain', 'showers'
    ];
    
    // Cloudy conditions
    const cloudyKeywords = [
      'cloudy', 'overcast', 'partly cloudy', 'mist', 'fog', 'freezing fog'
    ];
    
    if (rainKeywords.some(keyword => lowerCondition.includes(keyword))) {
      return { 
        category: "Hujan",
        icon: <IoWaterSharp className="text-primary" />,
        color: "primary"
      };
    } else if (cloudyKeywords.some(keyword => lowerCondition.includes(keyword))) {
      return { 
        category: "Mendung/Berawan",
        icon: <FaCloud className="text-secondary" />,
        color: "secondary"
      };
    } else if (lowerCondition.includes('sunny') || 
               lowerCondition.includes('clear') || 
               lowerCondition.includes('mainly clear')) {
      return { 
        category: "Cerah",
        icon: <FaSun className="text-warning" />,
        color: "warning"
      };
    } else {
      return { 
        category: condition,
        icon: <GoAlertFill className="text-muted" />,
        color: "muted"
      };
    }
  };

  // Group predictions by day (24 hours per day)
  const groupByDay = () => {
    if (!predictions) return [];
    
    const days = [];
    const hoursPerDay = 24;
    const totalHours = predictions.days * hoursPerDay;
    
    for (let day = 0; day < predictions.days; day++) {
      const startIdx = day * hoursPerDay;
      const endIdx = Math.min(startIdx + hoursPerDay, totalHours);
      
      days.push({
        dayNumber: day + 1,
        hours: Array.from({ length: endIdx - startIdx }, (_, i) => ({
          hour: i,
          prediction: predictions.prediksi[startIdx + i],
          weather: predictions.kondisiCuaca[startIdx + i]
        }))
      });
    }
    
    return days;
  };

  const dailyPredictions = groupByDay();

  return (
    <>
      <DashboardNavbar role="admin" />
      <Container fluid className="px-0">
        <div className="bg-success bg-opacity-10 py-5">
          <Container className="text-center py-4">
            <FaChartLine size={50} className="mb-3 text-success" />
            <h1 className="display-5 fw-bold text-success mb-3">
              Optimasi Irigasi
            </h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Dapatkan analisis cerdas dan rekomendasi irigasi berbasis data cuaca untuk
              meningkatkan hasil panen Anda
            </p>
          </Container>
        </div>

        <Container className="my-5">
          <Row className="justify-content-center">
            <Col xl={10}>
              <Row className="g-4">
                <Col lg={5}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Header className="bg-white border-0 py-3">
                      <h5 className="mb-0 fw-semibold text-success">
                        <FaSeedling className="me-2" />
                        Data Tanaman
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleSubmit}>
                        {error && (
                          <Alert variant="danger" className="fw-semibold">
                            {error}
                          </Alert>
                        )}

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Jenis Tanaman
                          </Form.Label>
                          <Form.Select
                            name="jenisTanaman"
                            value={formData.jenisTanaman}
                            onChange={handleChange}
                            size="lg"
                            className="rounded-3"
                            required
                          >
                            <option value="">Pilih Jenis Tanaman</option>
                            {jenis.map((jenis_pilihan, index) => (
                              <option key={index} value={jenis_pilihan.value}>
                                {jenis_pilihan.value}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Umur Tanaman (hari)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="umurTanaman"
                            value={formData.umurTanaman}
                            onChange={handleChange}
                            min="1"
                            max="365"
                            size="lg"
                            placeholder="Masukkan umur tanaman"
                            className="rounded-3"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Perkiraan Umur Panen (hari)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="umurTanamanMax"
                            value={formData.umurTanamanMax}
                            onChange={handleChange}
                            min="1"
                            max="365"
                            size="lg"
                            placeholder="Masukkan umur panen"
                            className="rounded-3"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Jumlah Hari Prediksi
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="days"
                            value={formData.days}
                            onChange={handleChange}
                            min="1"
                            max="14"
                            size="lg"
                            className="rounded-3"
                          />
                        </Form.Group>

                        <Button
                          variant="success"
                          type="submit"
                          disabled={isLoading}
                          size="lg"
                          className="w-100 rounded-pill fw-semibold mb-3"
                        >
                          {isLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              <span className="ms-2">Menganalisis...</span>
                            </>
                          ) : (
                            <>
                              <FaChartLine className="me-3" />
                              Mulai Analisis
                            </>
                          )}
                        </Button>

                        {/* <Button
                          variant="outline-success"
                          size="lg"
                          className="w-100 rounded-pill fw-semibold"
                        >
                          <FaHistory className="me-3" />
                          Riwayat Optimasi
                        </Button> */}
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={7}>
                  {isLoading ? (
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
                        <Spinner animation="border" variant="success" />
                        <h5 className="mt-3 text-muted">
                          Menganalisis data tanaman...
                        </h5>
                        <p className="text-center text-muted">
                          Sistem sedang memproses data tanaman Anda untuk memberikan
                          prediksi terbaik
                        </p>
                      </Card.Body>
                    </Card>
                  ) : predictions ? (
                    <>
                      <Card className="shadow mb-4 text-success">
                        <Card.Header className="bg-success bg-opacity-10 text-success py-3">
                          <h5 className="mb-0 fw-semibold">
                            <FaSeedling className="me-2" />
                            Informasi Tanaman
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={6} className="mb-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                  <FaSeedling className="text-success fs-4" />
                                </div>
                                <div>
                                  <p className="mb-0 text-muted small">Jenis Tanaman</p>
                                  <p className="mb-0 fw-semibold">{predictions.jenisTanaman}</p>
                                </div>
                              </div>
                            </Col>
                            <Col md={6} className="mb-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                  <FaLeaf className="text-success fs-4" />
                                </div>
                                <div>
                                  <p className="mb-0 text-muted small">Umur Tanaman</p>
                                  <p className="mb-0 fw-semibold">{predictions.umurTanaman} hari</p>
                                </div>
                              </div>
                            </Col>
                            <Col md={6} className="mb-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                  <FaCalendarAlt className="text-success fs-4" />
                                </div>
                                <div>
                                  <p className="mb-0 text-muted small">Umur Panen</p>
                                  <p className="mb-0 fw-semibold">{predictions.umurTanamanMax} hari</p>
                                </div>
                              </div>
                            </Col>
                            <Col md={6} className="mb-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                  <FaSun className="text-success fs-4" />
                                </div>
                                <div>
                                  <p className="mb-0 text-muted small">Periode Prediksi</p>
                                  <p className="mb-0 fw-semibold">{predictions.days} hari ({predictions.days * 24} jam)</p>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      <Card className="shadow text-success">
                        <Card.Header className="bg-success bg-opacity-10 text-success py-3">
                          <h5 className="mb-0 fw-semibold">
                            <FaChartLine className="me-2" />
                            Hasil Prediksi Irigasi (Per Jam)
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <Accordion activeKey={activeDay} onSelect={(e) => setActiveDay(e)}>
                            {dailyPredictions.map((dayData) => (
                              <Accordion.Item 
                                key={dayData.dayNumber} 
                                eventKey={String(dayData.dayNumber - 1)}
                                className="mb-2 border-0"
                              >
                                <Accordion.Header className="bg-light rounded">
                                  <div className="d-flex align-items-center">
                                    <FaCalendarAlt className="me-2 text-success" />
                                    <span className="fw-semibold">Hari ke-{dayData.dayNumber}</span>
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body className="p-0">
                                  <div className="table-responsive" style={{ maxHeight: "300px" }}>
                                    <Table striped bordered hover className="mb-0">
                                      <thead>
                                        <tr>
                                          <th>Jam</th>
                                          <th>Status Irigasi</th>
                                          <th>Kondisi Cuaca</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {dayData.hours.map((hourData, hourIdx) => {
                                          const weatherInfo = categorizeWeather(hourData.weather);
                                          return (
                                            <tr key={hourIdx}>
                                              <td>{hourData.hour}:00</td>
                                              <td>
                                                {hourData.prediction === 1 ? (
                                                  <Badge bg="success">Perlu Irigasi</Badge>
                                                ) : (
                                                  <Badge bg="secondary">Tidak Perlu</Badge>
                                                )}
                                              </td>
                                              <td>
                                                <div className="d-flex align-items-center">
                                                  {weatherInfo.icon}
                                                  <span className="ms-2">{weatherInfo.category}</span>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                          </Accordion>
                        </Card.Body>
                      </Card>
                    </>
                  ) : (
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                        <div className="bg-success bg-opacity-10 p-4 rounded-circle mb-4">
                          <FaChartLine className="text-success fs-1" />
                        </div>
                        <h4 className="fw-semibold">
                          Mulai Analisis Tanaman Anda
                        </h4>
                        <p className="text-muted mb-4">
                          Masukkan data tanaman untuk mendapatkan rekomendasi
                          optimasi terbaik
                        </p>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>

      <Footer role="admin"/>
    </>
  );
};

export default Optimasi;