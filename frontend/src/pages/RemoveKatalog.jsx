import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Alert,
  Image,
  Card,
  Badge,
} from "react-bootstrap";
import { FaTrash, FaBox, FaSpinner } from "react-icons/fa";
import DashboardNavBar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const RemoveKatalog = () => {
  const [dataKatalog, setDataKatalog] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchKatalog = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/get-katalog", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setDataKatalog(data);
        console.log(data);
      } else {
        setMessage(data.error || "Gagal memuat data katalog");
        setMessageType("danger");
      }
    } catch (err) {
      setMessage(`Terjadi kesalahan saat memuat data: ${err}`);
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKatalog();
  }, []);

  const handleConfirmDelete = (item) => {
    setShowConfirm(true);
    setSelectedId(item.id);
    setSelectedItem(item);
  };

  const handleDelete = async (id) => {
    setMessage("");
    setDeleting(true);

    try {
      const response = await fetch("http://localhost:5000/remove-katalog", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Katalog berhasil dihapus");
        setMessageType("success");
        fetchKatalog();
      } else {
        setMessage(data.error || "Gagal menghapus katalog");
        setMessageType("danger");
      }
    } catch (err) {
      setMessage(`Terjadi kesalahan saat menghapus: ${err}`);
      setMessageType("danger");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedItem(null);
    }
  };

  const getStockBadgeVariant = (stok) => {
    if (stok === 0) return "danger";
    if (stok <= 10) return "warning";
    return "success";
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <DashboardNavBar role={"admin"} />

      <Container fluid className="flex-grow-1 py-4">
        <h2 className="display-6 text-center mb-4">Hapus Katalog</h2>

        {message && (
          <Row className="justify-content-center mb-4">
            <Col lg={10}>
              <Alert
                variant={messageType}
                className="shadow-sm border-0 rounded-3"
                dismissible
                onClose={() => setMessage("")}
              >
                {message}
              </Alert>
            </Col>
          </Row>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Memuat data katalog...</p>
          </div>
        ) : (
          <>
            <Row className="justify-content-center">
              <Col lg={10}>
                {dataKatalog.length === 0 ? (
                  <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                      <FaBox size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">Tidak ada katalog tersedia</h5>
                      <p className="text-muted">
                        Silakan tambahkan katalog terlebih dahulu
                      </p>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row className="g-4">
                    {dataKatalog.map((katalog) => (
                      <Col key={katalog.id} xs={12} sm={6} lg={4} xl={3}>
                        <Card className="h-100 border-0 shadow-sm">
                          <div className="position-relative">
                            <Image
                              src={katalog.url_gambar}
                              alt={katalog.varietas}
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/300x200?text=No+Image";
                              }}
                            />
                            <Badge
                              bg={getStockBadgeVariant(katalog.stok)}
                              className="position-absolute top-0 end-0 m-2 px-2 py-1"
                            >
                              Stok: {katalog.stok}
                            </Badge>
                          </div>

                          <Card.Body className="d-flex flex-column">
                            <div className="mb-3">
                              <h6
                                className="fw-bold text-truncate"
                                title={katalog.varietas}
                              >
                                {katalog.varietas}
                              </h6>
                              <Badge bg="secondary" className="me-1">
                                {katalog.jenis_benih}
                              </Badge>
                            </div>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="w-100 d-flex align-items-center justify-content-center gap-2"
                              onClick={() => handleConfirmDelete(katalog)}
                              style={{ borderRadius: "8px" }}
                            >
                              <FaTrash size={16} />
                              Hapus
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}

                <div className="text-center mt-4">
                  <Button
                    variant="outline-secondary"
                    className="px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                    style={{ borderRadius: "25px" }}
                    onClick={() => window.history.back()}
                  >
                    Kembali
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>

      <Modal
        show={showConfirm}
        onHide={() => !deleting && setShowConfirm(false)}
        centered
        backdrop={deleting ? "static" : true}
        keyboard={!deleting}
      >
        <Modal.Header closeButton={!deleting} className="border-0 pb-0">
          <Modal.Title className="text-danger d-flex align-items-center gap-2">
            <FaTrash size={20} />
            Konfirmasi Hapus
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          {selectedItem && (
            <div className="text-center">
              <Image
                src={selectedItem.url_gambar}
                alt={selectedItem.varietas}
                className="rounded mb-3"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/100x100?text=No+Image";
                }}
              />
              <h6 className="fw-bold">{selectedItem.varietas}</h6>
              <p className="text-muted mb-3">{selectedItem.jenis_benih}</p>
            </div>
          )}
          <p className="text-center mb-0">
            Apakah Anda yakin ingin menghapus item ini?
            <br />
            <small className="text-danger">
              Tindakan ini tidak dapat dibatalkan.
            </small>
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="light"
            onClick={() => {
              setShowConfirm(false);
              setSelectedId(null);
              setSelectedItem(null);
            }}
            disabled={deleting}
            className="px-4"
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedId)}
            disabled={deleting}
            className="px-4 d-flex align-items-center gap-2"
          >
            {deleting ? (
              <>
                <FaSpinner className="spinner-border spinner-border-sm me-2" />
                Menghapus...
              </>
            ) : (
              <>
                <FaTrash size={16} />
                Hapus
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer role="admin" />
    </div>
  );
};

export default RemoveKatalog;
