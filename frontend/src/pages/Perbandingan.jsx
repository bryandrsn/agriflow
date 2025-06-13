import React, { useState, useEffect } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Dropdown, 
  Alert,
  Badge,
  ListGroup,
  ProgressBar,
  Stack
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { BsArrowLeftRight, BsInfoCircle } from "react-icons/bs";
import DashboardNavBar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const Perbandingan = () => {
  const { id } = useParams();
  const [dataBenih, setDataBenih] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedBenih, setSelectedBenih] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataBenih = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-katalog", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setDataBenih(data);
      } else {
        setMessage(data.error || "Gagal memuat data perbandingan");
      }
    } catch (err) {
      console.log(err);
      setMessage("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataBenih();
  }, []);

  const mainBenih = dataBenih.find((benih) => benih.id === Number(id));
  const comparedBenih = dataBenih.find(
    (benih) => benih.id === Number(selectedBenih)
  );

  const getStockBadgeVariant = (stok) => {
    if (stok > 50) return "success";
    if (stok > 20) return "warning";
    return "danger";
  };

  const getStockText = (stok) => {
    if (stok > 50) return "Tersedia";
    if (stok > 20) return "Terbatas";
    if (stok > 0) return "Hampir Habis";
    return "Habis";
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <DashboardNavBar role="user" />
        <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Memuat data benih...</p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <DashboardNavBar role="user" />
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="text-success fw-bold mb-3">Perbandingan Benih</h2>
          <p className="text-muted">Bandingkan benih untuk memilih yang terbaik</p>
        </div>

        {message && (
          <Alert variant="danger" className="shadow-sm mb-4" dismissible onClose={() => setMessage("")}>
            <Alert.Heading>Terjadi Kesalahan!</Alert.Heading>
            <p>{message}</p>
          </Alert>
        )}

        <Row className="g-4 justify-content-center">
          {/* Main Benih Card */}
          {mainBenih && (
            <Col lg={5} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-success text-white py-3">
                  <Stack direction="horizontal" gap={2}>
                    <BsInfoCircle size={20} />
                    <h5 className="mb-0">Benih Utama</h5>
                  </Stack>
                </Card.Header>
                <div className="text-center p-4 bg-light bg-opacity-10">
                  <Card.Img
                    variant="top"
                    src={mainBenih.url_gambar || "https://via.placeholder.com/300x200?text=Benih+Pertanian"}
                    className="rounded img-fluid"
                    style={{
                      maxHeight: "200px",
                      width: "auto",
                      objectFit: "contain"
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-center text-success mb-3 fw-bold">
                    {mainBenih.varietas}
                  </Card.Title>
                  
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Jenis:</span>
                      <span>{mainBenih.jenis_benih}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Umur:</span>
                      <span>{mainBenih.umur} hari</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Harga:</span>
                      <span className="fw-bold">Rp {mainBenih.harga?.toLocaleString()}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                      <span className="fw-medium">Stok:</span>
                      <div className="d-flex align-items-center">
                        <Badge bg={getStockBadgeVariant(mainBenih.stok)} className="me-2">
                          {getStockText(mainBenih.stok)}
                        </Badge>
                        <small className="text-muted">{mainBenih.stok} bungkus</small>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>

                  <div className="mt-3">
                    <h6 className="fw-medium mb-2">Deskripsi:</h6>
                    <p className="text-muted small">{mainBenih.deskripsi}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Comparison Controls */}
          <Col lg={2} md={12} className="d-flex flex-column justify-content-center">
            <Card className="border-0 bg-transparent">
              <Card.Body className="text-center p-4">
                <div className="mb-4">
                  <BsArrowLeftRight size={40} className="text-success mb-3" />
                  <h6 className="text-muted mb-3">Pilih Benih Pembanding</h6>
                  <Dropdown onSelect={(eventKey) => setSelectedBenih(eventKey)}>
                    <Dropdown.Toggle 
                      variant="outline-success" 
                      id="dropdown-basic"
                      className="w-100 mb-3"
                    >
                      {selectedBenih ? comparedBenih?.varietas : "Pilih Benih"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {dataBenih
                        .filter(benih => benih.id !== Number(id))
                        .map((benih) => (
                          <Dropdown.Item 
                            key={benih.id} 
                            eventKey={benih.id}
                            active={selectedBenih === benih.id.toString()}
                          >
                            {benih.varietas}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Button
                  variant="outline-secondary"
                  onClick={() => window.history.back()}
                  className="w-100"
                >
                  Kembali
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Compared Benih Card */}
          {!selectedBenih ? (
            <Col lg={5} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-light text-muted py-3">
                  <Stack direction="horizontal" gap={2}>
                    <BsInfoCircle size={20} />
                    <h5 className="mb-0">Benih Pembanding</h5>
                  </Stack>
                </Card.Header>
                <div className="text-center p-4 bg-light">
                  <Card.Img
                    variant="top"
                    src="https://via.placeholder.com/300x200?text=Pilih+Benih"
                    className="rounded img-fluid"
                    style={{
                      maxHeight: "200px",
                      width: "auto",
                      objectFit: "contain",
                      opacity: 0.3
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-center text-muted mb-3">
                    Belum Dipilih
                  </Card.Title>
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Jenis:</span>
                      <span>-</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Umur:</span>
                      <span>-</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Harga:</span>
                      <span>-</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Stok:</span>
                      <span>-</span>
                    </ListGroup.Item>
                  </ListGroup>
                  <div className="mt-3">
                    <h6 className="fw-medium mb-2">Deskripsi:</h6>
                    <p className="text-muted small">Silakan pilih benih untuk membandingkan</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ) : comparedBenih && (
            <Col lg={5} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-success text-white py-3">
                  <Stack direction="horizontal" gap={2}>
                    <BsInfoCircle size={20} />
                    <h5 className="mb-0">Benih Pembanding</h5>
                  </Stack>
                </Card.Header>
                <div className="text-center p-4 bg-light bg-opacity-10">
                  <Card.Img
                    variant="top"
                    src={comparedBenih.url_gambar || "https://via.placeholder.com/300x200?text=Benih+Pertanian"}
                    className="rounded img-fluid"
                    style={{
                      maxHeight: "200px",
                      width: "auto",
                      objectFit: "contain"
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-center text-success mb-3 fw-bold">
                    {comparedBenih.varietas}
                  </Card.Title>
                  
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Jenis:</span>
                      <span>{comparedBenih.jenis_benih}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Umur:</span>
                      <span>{comparedBenih.umur} hari</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-2">
                      <span className="fw-medium">Harga:</span>
                      <span className="fw-bold">Rp {comparedBenih.harga?.toLocaleString()}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                      <span className="fw-medium">Stok:</span>
                      <div className="d-flex align-items-center">
                        <Badge bg={getStockBadgeVariant(comparedBenih.stok)} className="me-2">
                          {getStockText(comparedBenih.stok)}
                        </Badge>
                        <small className="text-muted">{comparedBenih.stok} bungkus</small>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>

                  <div className="mt-3">
                    <h6 className="fw-medium mb-2">Deskripsi:</h6>
                    <p className="text-muted small">{comparedBenih.deskripsi}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
      <Footer role="user"/>
    </div>
  );
};

export default Perbandingan;