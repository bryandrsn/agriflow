import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CloseButton,
  Alert,
} from "react-bootstrap";
import { FaEdit, FaPlus, FaMinus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const KatalogAdmin = () => {
  const [showTools, setShowTools] = useState(false);
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

  return (
    <div className="bg-light">
      <DashboardNavbar role="admin" />
      <Container className="my-5">
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
                  <div className="d-flex mt-3">
                    <Button
                      variant="outline-success"
                      className="w-100 me-2"
                      onClick={() =>
                        navigate(`/detail-benih-admin/${katalog.id}`)
                      }
                    >
                      Lihat detail
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate(`/edit-katalog/${katalog.id}`)}
                      style={{
                        padding: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MdEdit size={25} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 999,
        }}
      >
        {!showTools && (
          <Button
            variant="success"
            className="rounded-4"
            style={{
              padding: "15px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowTools(!showTools)}
          >
            <FaEdit size={30} />
          </Button>
        )}
        {showTools && (
          <div
            className="p-3 bg-white rounded-4 shadow"
            style={{ width: "240px", transition: "all 0.3s ease" }}
          >
            <CloseButton
              className="mb-3 float-end"
              onClick={() => setShowTools(false)}
            />
            <Button
              variant="outline-success"
              className="mb-2 w-100 d-flex align-items-center justify-content-start"
              onClick={() => navigate("/add-katalog")}
            >
              <FaPlus className="me-4" />
              Tambah Produk
            </Button>
            <Button
              variant="outline-danger"
              className="mb-2 w-100 d-flex align-items-center justify-content-start"
              onClick={() => navigate("/remove-katalog")}
            >
              <FaMinus className="me-4" />
              Hapus Produk
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default KatalogAdmin;
