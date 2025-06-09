import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Katalog = () => {
  const [dataKatalog, setDataKatalog] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKatalog = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-katalog", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setDataKatalog(data);
        } else {
          setMessage(data.error || "Gagal memuat data katalog");
        }
      } catch (err) {
        console.log(err);
        setMessage("Terjadi kesalahan saat memuat data");
      }
    };
    fetchKatalog();
  }, []);

  const handleDetailBenih = (id) => {
    navigate(`/detail-benih/${id}`);
  };

  return (
    <div>
      <DashboardNavbar role="user" />
      <Container className="my-5 min-vh-100">
        {message && <Alert variant="danger">{message}</Alert>}
        <Row className="g-4">
          {dataKatalog.map((katalog, index) => (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={4}
              className="d-flex justify-content-center"
            >
              <Card
                style={{ width: "100%", maxWidth: "20rem" }}
                className="h-100 d-flex flex-column justify-content-between"
              >
                <Card.Img variant="top" src={katalog.url_gambar} />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{katalog.varietas}</Card.Title>
                    <Card.Text>{katalog.jenis_benih}</Card.Text>
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="primary"
                      className="me-2 w-100 mb-2"
                      style={{ backgroundColor: "#628B35" }}
                    >
                      Order
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      onClick={() => handleDetailBenih(katalog.id)}
                    >
                      Lihat informasi benih
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Katalog;
