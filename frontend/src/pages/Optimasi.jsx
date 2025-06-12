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
  Badge,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import { FaSeedling, FaChartLine, FaLeaf, FaTint, FaSun } from "react-icons/fa";

const Optimasi = () => {
  const [formData, setFormData] = useState({
    seedType: "",
    plantAge: "",
    soilMoisture: "",
    sunlightExposure: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const seedTypes = [
    { value: "Padi IR64", icon: <FaSeedling className="me-2" /> },
    { value: "Jagung Hibrida", icon: <FaLeaf className="me-2" /> },
    { value: "Kedelai Grobogan", icon: <FaSeedling className="me-2" /> },
    { value: "Cabai Keriting", icon: <FaLeaf className="me-2" /> },
    { value: "Tomat Permata", icon: <FaLeaf className="me-2" /> },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.seedType || !formData.plantAge) {
      setError("Harap isi semua field yang wajib");
      return;
    }

    setIsLoading(true);

    // Simulasi API call
    setTimeout(() => {
      try {
        const dummyPredictions = [
          {
            status: "Optimal",
            message: "Tanaman dalam kondisi sangat baik",
            score: 95,
            color: "success",
          },
          {
            status: "Perlu Perawatan",
            message: "Tanaman membutuhkan nutrisi tambahan",
            score: 65,
            color: "warning",
          },
          {
            status: "Kritis",
            message: "Segera lakukan tindakan perbaikan",
            score: 30,
            color: "danger",
          },
        ];

        const randomPrediction =
          dummyPredictions[Math.floor(Math.random() * dummyPredictions.length)];

        setPrediction({
          ...formData,
          ...randomPrediction,
          recommendation: generateRecommendation(
            formData.seedType,
            randomPrediction.status
          ),
          optimalConditions: generateOptimalConditions(formData.seedType),
        });
        setIsLoading(false);
      } catch (err) {
        setError("Gagal melakukan prediksi. Silakan coba lagi." + err);
        setIsLoading(false);
      }
    }, 2000);
  };

  const generateRecommendation = (seedType, status) => {
    const recommendations = {
      "Padi IR64": {
        Optimal: [
          "Lanjutkan perawatan rutin",
          "Pantau kadar air sawah secara berkala",
          "Pupuk tambahan 50kg/ha minggu depan",
        ],
        "Perlu Perawatan": [
          "Berikan pupuk NPK dengan dosis 250kg/ha",
          "Tingkatkan pengairan 20%",
          "Periksa kemungkinan hama",
        ],
        Kritis: [
          "Aplikasikan pestisida organik segera",
          "Tingkatkan frekuensi pemantauan",
          "Konsultasikan dengan ahli pertanian",
        ],
      },
      "Jagung Hibrida": {
        Optimal: [
          "Lanjutkan program pemupukan rutin",
          "Siram sesuai jadwal",
          "Pantau pertumbuhan mingguan",
        ],
        "Perlu Perawatan": [
          "Tambahkan pupuk urea 100kg/ha",
          "Tingkatkan penyiraman",
          "Berikan pupuk daun",
        ],
        Kritis: [
          "Lakukan penyemprotan fungisida",
          "Evaluasi sistem drainase",
          "Potong daun yang terinfeksi",
        ],
      },
      // ... tambahkan untuk jenis tanaman lainnya
    };

    return (
      recommendations[seedType]?.[status] || [
        "Tidak ada rekomendasi spesifik tersedia.",
        "Periksa kondisi tanaman secara berkala.",
      ]
    );
  };

  const generateOptimalConditions = (seedType) => {
    const conditions = {
      "Padi IR64": [
        { name: "Suhu Optimal", value: "28-32°C", icon: <FaSun /> },
        { name: "Kelembaban Tanah", value: "80-90%", icon: <FaTint /> },
        { name: "pH Tanah", value: "5.0-7.0", icon: <FaLeaf /> },
      ],
      "Jagung Hibrida": [
        { name: "Suhu Optimal", value: "24-30°C", icon: <FaSun /> },
        { name: "Kelembaban Tanah", value: "70-80%", icon: <FaTint /> },
        { name: "pH Tanah", value: "6.0-7.5", icon: <FaLeaf /> },
      ],
      // ... tambahkan untuk jenis tanaman lainnya
    };

    return conditions[seedType] || [];
  };

  return (
    <>
      <DashboardNavbar role="admin" />

      <Container fluid className="px-0">
        {/* Hero Section */}
        <div className="bg-success bg-opacity-10 py-5">
          <Container className="text-center py-4">
            <h1 className="display-5 fw-bold text-success mb-3">
              <FaChartLine className="me-2" />
              Optimasi Proses Pertanian
            </h1>
            <p
              className="lead text-muted mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Dapatkan analisis cerdas dan rekomendasi berbasis data untuk
              meningkatkan hasil panen Anda
            </p>
          </Container>
        </div>

        {/* Main Content */}
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col xl={10}>
              <Row className="g-4">
                {/* Form Column */}
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
                            name="seedType"
                            value={formData.seedType}
                            onChange={handleChange}
                            required
                            size="lg"
                            className="rounded-3"
                          >
                            <option value="">Pilih Jenis Tanaman</option>
                            {seedTypes.map((type, index) => (
                              <option key={index} value={type.value}>
                                {type.icon} {type.value}
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
                            name="plantAge"
                            value={formData.plantAge}
                            onChange={handleChange}
                            min="1"
                            max="365"
                            required
                            size="lg"
                            placeholder="Masukkan umur tanaman"
                            className="rounded-3"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Kelembaban Tanah (%)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="soilMoisture"
                            value={formData.soilMoisture}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            size="lg"
                            placeholder="Opsional"
                            className="rounded-3"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Paparan Sinar Matahari (jam/hari)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="sunlightExposure"
                            value={formData.sunlightExposure}
                            onChange={handleChange}
                            min="0"
                            max="24"
                            size="lg"
                            placeholder="Opsional"
                            className="rounded-3"
                          />
                        </Form.Group>

                        <Button
                          variant="success"
                          type="submit"
                          disabled={isLoading}
                          size="lg"
                          className="w-100 rounded-pill py-3 fw-semibold"
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
                              <FaChartLine className="me-2" />
                              Mulai Analisis
                            </>
                          )}
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Results Column */}
                <Col lg={7}>
                  {isLoading ? (
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
                        <Spinner animation="border" variant="success" />
                        <h5 className="mt-3 text-muted">
                          Menganalisis data tanaman...
                        </h5>
                        <p className="text-center text-muted">
                          Sistem sedang memproses data Anda untuk memberikan
                          rekomendasi terbaik
                        </p>
                      </Card.Body>
                    </Card>
                  ) : prediction ? (
                    <>
                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Header
                          className={`bg-${prediction.color} bg-opacity-10 text-${prediction.color} py-3`}
                        >
                          <h5 className="mb-0 fw-semibold">
                            <FaChartLine className="me-2" />
                            Hasil Analisis
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <Row className="mb-4">
                            <Col md={6}>
                              <div className="d-flex align-items-center mb-3">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                  <FaSeedling className="text-success fs-4" />
                                </div>
                                <div>
                                  <p className="mb-0 text-muted small">
                                    Jenis Tanaman
                                  </p>
                                  <p className="mb-0 fw-semibold">
                                    {prediction.seedType}
                                  </p>
                                </div>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="d-flex align-items-center mb-3">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                  <FaLeaf className="text-success fs-4" />
                                </div>
                                <div>
                                  <p className="mb-0 text-muted small">
                                    Umur Tanaman
                                  </p>
                                  <p className="mb-0 fw-semibold">
                                    {prediction.plantAge} hari
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <div className="mb-4">
                            <h6 className="fw-semibold mb-3">Status Tanaman</h6>
                            <Alert
                              variant={prediction.color}
                              className="d-flex align-items-center"
                            >
                              <div className="me-3">
                                {prediction.color === "success" && (
                                  <FaSeedling className="fs-3" />
                                )}
                                {prediction.color === "warning" && (
                                  <FaLeaf className="fs-3" />
                                )}
                                {prediction.color === "danger" && (
                                  <FaLeaf className="fs-3" />
                                )}
                              </div>
                              <div>
                                <h5 className="alert-heading mb-1">
                                  {prediction.status}
                                </h5>
                                <p className="mb-0">{prediction.message}</p>
                              </div>
                            </Alert>
                          </div>

                          <div className="mb-4">
                            <h6 className="fw-semibold mb-3">Skor Kesehatan</h6>
                            <div className="d-flex align-items-center">
                              <ProgressBar
                                now={prediction.score}
                                variant={prediction.color}
                                className="flex-grow-1 me-3"
                                style={{ height: "10px" }}
                                label={`${prediction.score}%`}
                              />
                              <Badge bg={prediction.color} className="fs-6">
                                {prediction.score}/100
                              </Badge>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>

                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-0 py-3">
                          <h5 className="mb-0 fw-semibold text-success">
                            <FaLeaf className="me-2" />
                            Rekomendasi
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <ListGroup variant="flush">
                            {prediction.recommendation.map((item, index) => (
                              <ListGroup.Item
                                key={index}
                                className="d-flex align-items-start py-3"
                              >
                                <Badge bg="success" className="me-3 mt-1">
                                  {index + 1}
                                </Badge>
                                <span>{item}</span>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Card.Body>
                      </Card>

                      {prediction.optimalConditions.length > 0 && (
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-semibold text-success">
                              <FaSun className="me-2" />
                              Kondisi Optimal untuk {prediction.seedType}
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              {prediction.optimalConditions.map(
                                (condition, index) => (
                                  <Col md={4} key={index} className="mb-3">
                                    <div className="bg-light p-3 rounded text-center h-100">
                                      <div className="text-success mb-2">
                                        {condition.icon}
                                      </div>
                                      <h6 className="fw-semibold mb-1">
                                        {condition.name}
                                      </h6>
                                      <p className="mb-0">{condition.value}</p>
                                    </div>
                                  </Col>
                                )
                              )}
                            </Row>
                          </Card.Body>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                        <div className="bg-success bg-opacity-10 p-4 rounded-circle mb-4">
                          <FaChartLine className="text-success fs-1" />
                        </div>
                        <h5 className="fw-semibold">
                          Mulai Analisis Tanaman Anda
                        </h5>
                        <p className="text-muted mb-4">
                          Masukkan data tanaman untuk mendapatkan rekomendasi
                          optimasi terbaik
                        </p>
                        <Button
                          variant="outline-success"
                          size="lg"
                          className="rounded-pill"
                        >
                          <FaSeedling className="me-2" />
                          Petunjuk Penggunaan
                        </Button>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>

      <Footer />
    </>
  );
};

export default Optimasi;
