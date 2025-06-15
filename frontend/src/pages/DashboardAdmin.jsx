import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FiShoppingCart, FiTrendingUp } from "react-icons/fi";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const DashboardAdmin = () => {
  return (
    <div className="bg" style={{ minHeight: "100vh" }}>
      <DashboardNavbar role="admin" />

      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 my-5">
        <Row className="justify-content-center mb-5 text-center">
          <Col xs={12}>
            <h1
              className="display-3 text-white fw-bold mb-3"
              style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.7)" }}
            >
              Dashboard Admin
            </h1>
            <p
              className="lead text-white mb-4"
              style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}
            >
              Kontrol penuh website AgriFlow di tangan Anda.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center g-4">
          <Col md={5}>
            <Card
              className="border-0 shadow-lg h-100"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(8px)",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
                <div className="bg-primary bg-opacity-10 p-4 rounded-circle mb-4">
                  <FiShoppingCart size={48} color="#0d6efd" />
                </div>
                <Card.Title className="fs-2 fw-bold mb-3 text-dark">
                  Katalog
                </Card.Title>
                <Card.Text className="mb-4 text-muted">
                  Kelola seluruh produk yang ada di katalog AgriFlow
                </Card.Text>
                <Button
                  variant="primary"
                  size="lg"
                  href="/katalog-admin"
                  className="px-4 py-2 rounded-pill fw-bold"
                >
                  Buka Katalog
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={5}>
            <Card
              className="border-0 shadow-lg h-100"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(8px)",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
                <div className="bg-success bg-opacity-10 p-4 rounded-circle mb-4">
                  <FiTrendingUp size={48} color="#198754" />
                </div>
                <Card.Title className="fs-2 fw-bold mb-3 text-dark">
                  Optimasi
                </Card.Title>
                <Card.Text className="mb-4 text-muted">
                  Optimasi irigasi tanaman Anda dengan Model AI
                </Card.Text>
                <Button
                  variant="success"
                  size="lg"
                  href="/optimasi"
                  className="px-4 py-2 rounded-pill fw-bold"
                >
                  Mulai Optimasi
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer role="admin" />
    </div>
  );
};

export default DashboardAdmin;
