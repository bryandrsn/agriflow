import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Spinner,
  Image,
} from "react-bootstrap";
import { BsBookmarkHeart, BsBookmarkHeartFill } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import Komentar from "../components/Komentar";

const DetailBenih = () => {
  const { id } = useParams();
  const [dataDetail, setDataDetail] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  const getStockBadgeVariant = (stok) => {
    if (stok > 50) return "success";
    if (stok > 20) return "warning";
    return "danger";
  };

  const getStockText = (stok) => {
    if (stok > 50) return "Stok Tersedia";
    if (stok > 20) return "Stok Terbatas";
    if (stok > 0) return "Stok Hampir Habis";
    return "Stok Habis";
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <DashboardNavbar role="user" />
        <Container
          className="py-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="text-center">
            <Spinner
              animation="border"
              variant="success"
              size="lg"
              className="mb-3"
            />
            <p className="text-muted">Memuat detail benih...</p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <DashboardNavbar role="user" />

      <Container className="py-4">
        {message && (
          <Alert
            variant={message.includes("Gagal") ? "danger" : "success"}
            className="shadow-sm"
            onClose={() => setMessage("")}
            dismissible
          >
            {message}
          </Alert>
        )}

        {!message && dataDetail.id && (
          <>
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="text-success mb-1 ms-4">
                      {dataDetail.varietas}
                    </h2>
                    <p className="text-muted mb-0 ms-4">
                      Detail Informasi Benih
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <Badge
                      bg={getStockBadgeVariant(dataDetail.stok)}
                      className="fs-6 px-3 py-2 me-3"
                    >
                      {getStockText(dataDetail.stok)}
                    </Badge>
                    <Button
                      variant="link"
                      title={
                        isWishlisted
                          ? "Hapus dari wishlist"
                          : "Tambahkan ke wishlist"
                      }
                      onClick={toggleWishlist}
                      className="p-0"
                    >
                      {isWishlisted ? (
                        <BsBookmarkHeartFill size={30} color="#388E3C" />
                      ) : (
                        <BsBookmarkHeart size={30} color="#388E3C" />
                      )}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="g-4">
              <Col lg={5}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body className="p-4">
                    <div className="text-center">
                      <Image
                        src={dataDetail.url_gambar}
                        alt={dataDetail.varietas}
                        fluid
                        rounded
                        className="mb-3"
                        style={{
                          maxHeight: "400px",
                          objectFit: "cover",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={7}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">Informasi Detail</h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="border-start border-success border-3 ps-3">
                          <h6 className="text-success mb-1">Jenis Benih</h6>
                          <p className="mb-0 fw-medium">{dataDetail.jenis}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="border-start border-info border-3 ps-3">
                          <h6 className="text-info mb-1">Masa Tanam</h6>
                          <p className="mb-0 fw-medium">
                            {dataDetail.umur} hari
                          </p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="border-start border-warning border-3 ps-3">
                          <h6 className="text-warning mb-1">Harga</h6>
                          <p className="mb-0 fw-bold fs-5">
                            Rp. {dataDetail.harga?.toLocaleString()}
                          </p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="border-start border-danger border-3 ps-3">
                          <h6 className="text-danger mb-1">Stok Tersedia</h6>
                          <p className="mb-0 fw-medium">
                            {dataDetail.stok} bungkus
                          </p>
                        </div>
                      </Col>
                    </Row>

                    <hr className="my-4" />

                    <div>
                      <h6 className="text-dark mb-3">Deskripsi Produk</h6>
                      <div className="bg-light rounded p-3">
                        <p className="mb-0 text-muted lh-lg">
                          {dataDetail.deskripsi}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <Row className="g-3">
                      <Col md={4}>
                        <Button
                          size="lg"
                          variant="success"
                          className="w-100 fw-medium"
                        >
                          Order
                        </Button>
                      </Col>
                      <Col md={4}>
                        <Button
                          variant="outline-success"
                          size="lg"
                          className="w-100 fw-medium"
                          onClick={() => navigate(`/perbandingan/${id}`)}
                        >
                          Bandingkan
                        </Button>
                      </Col>
                      <Col md={4}>
                        <Button
                          variant="outline-secondary"
                          size="lg"
                          className="w-100 fw-medium"
                          onClick={() => window.history.back()}
                        >
                          Kembali
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>

      {dataDetail.id && (
        <div className="bg-white py-5 mt-4 border-top">
          <Container>
            <h4 className="text-center text-success mb-4">Komentar & Ulasan</h4>
            <Komentar benih_id={id} />
          </Container>
        </div>
      )}

      <Footer role="user" />
    </div>
  );
};

export default DetailBenih;
