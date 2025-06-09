import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { BsBookmarkHeart, BsBookmarkHeartFill } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import Komentar from "../components/Komentar";

const DetailBenih = () => {
  const { id } = useParams();
  const [dataDetail, setDataDetail] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/get-katalog/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setDataDetail(data);
      } else {
        setMessage(data.error || "Gagal memuat data katalog");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat memuat data:", err);
    }
  }, [id]);

  const checkIsWishlisted = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/check-wishlist/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIsWishlisted(data.isWishlisted);
      } else {
        setMessage(data.error || "Gagal mengecek wishlist");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat memuat data:", err);
    }
  }, [id]);

  const toggleWishlist = async () => {
    try {
      const endpoint = isWishlisted
        ? "http://localhost:5000/remove-wishlist"
        : "http://localhost:5000/add-wishlist";

      const response = await fetch(endpoint, {
        method: isWishlisted ? "DELETE" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ benih_id: id }),
      });

      const data = await response.json();
      if (response.ok) {
        await checkIsWishlisted();
        setMessage(
          data.message ||
            (isWishlisted
              ? "Berhasil menghapus dari wishlist"
              : "Berhasil menambahkan ke wishlist")
        );
      } else {
        setMessage(
          data.error ||
            (isWishlisted
              ? "Gagal menghapus dari wishlist"
              : "Gagal menambahkan ke wishlist")
        );
      }
    } catch (err) {
      setMessage("Terjadi kesalahan: " + err.message);
    }
  };

  useEffect(() => {
    fetchDetail();
    checkIsWishlisted();
  }, [id, fetchDetail, checkIsWishlisted]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-light">
      <DashboardNavbar role="user" />
      <Container className=" min-vh-100 py-5">
        {message && (
          <Alert
            variant={message.includes("Gagal") ? "danger" : "success"}
            onClose={() => setMessage("")}
            dismissible
          >
            {message}
          </Alert>
        )}
        {dataDetail.id && (
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="shadow">
                <div className="d-flex justify-content-center mx-3 mt-3">
                  <Button
                    title={
                      isWishlisted
                        ? "Hapus dari wishlist"
                        : "Tambahkan ke wishlist"
                    }
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      position: "absolute",
                      right: "10px",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={toggleWishlist}
                  >
                    {isWishlisted ? (
                      <BsBookmarkHeartFill size={30} color="#628B35" />
                    ) : (
                      <BsBookmarkHeart size={30} color="#628B35" />
                    )}
                  </Button>
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
                    >
                      Order
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => navigate(`/perbandingan/${id}`)}
                    >
                      Bandingkan
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
      <Komentar benih_id={id} />
      <Footer />
    </div>
  );
};

export default DetailBenih;
