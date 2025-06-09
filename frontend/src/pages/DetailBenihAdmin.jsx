import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const DetailBenihAdmin = () => {
  const { id } = useParams();
  const [dataDetail, setDataDetail] = useState({
    id: "",
    varietas: "",
    jenis: "",
    umur: "",
    harga: "",
    stok: "",
    url_gambar: "",
    deskripsi: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get-katalog/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        if (response.ok) {
          setDataDetail(data);
        } else {
          setMessage(data.error || "Gagal memuat data katalog");
        }
      } catch (err) {
        setMessage("Terjadi kesalahan saat memuat data:", err);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <div className="bg-light min-vh-100">
      <DashboardNavbar role="admin" />
      <Container className="py-5">
        {message && <Alert variant="danger">{message}</Alert>}
        {!message && dataDetail.id && (
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="shadow">
                <div className="d-flex justify-content-center mt-3">
                  <Card.Img
                    className="w-50 p-3 card-img-top"
                    src="https://picsum.photos/350/350"
                    alt="blablabla"
                    style={{ borderRadius: "40px", objectFit: "contain" }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="mb-3 text-center">
                    {dataDetail.varietas}
                  </Card.Title>
                  <Card.Text>
                    <strong>Jenis:</strong> {dataDetail.jenis}
                  </Card.Text>
                  <Card.Text>
                    <strong>Umur:</strong> {dataDetail.umur} hari
                  </Card.Text>
                  <Card.Text>
                    <strong>Harga:</strong> Rp.{" "}
                    {dataDetail.harga?.toLocaleString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Stok:</strong> {dataDetail.stok} bungkus
                  </Card.Text>
                  <Card.Text>
                    <strong>Deskripsi:</strong> {dataDetail.deskripsi}
                  </Card.Text>
                  <div className="d-grid gap-2 mt-4">
                    <Button
                      style={{ backgroundColor: "#628B35", border: "none" }}
                      onClick={() => navigate(`/edit-katalog/${id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => window.history.back()}
                    >
                      Kembali
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default DetailBenihAdmin;
