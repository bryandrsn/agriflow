import React, { useState, useEffect } from "react";
import { ListGroup, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import DashboardNavBar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const RemoveKatalog = () => {
  const [dataKatalog, setDataKatalog] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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

  useEffect(() => {
    fetchKatalog();
  }, []);

  const handleConfirmDelete = (id) => {
    setShowConfirm(true);
    setSelectedId(id);
  };

  const handleDelete = async (id) => {
    setMessage("");
    setShowConfirm(false);

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
        fetchKatalog();
      } else {
        setMessage(data.error || "Gagal menghapus katalog");
      }
    } catch (err) {
      console.log(err);
      setMessage(`Terjadi kesalahan saat menghapus: ${err}`);
    }
  };

  return (
    <div>
      <DashboardNavBar role={"admin"} />
      <h2 className="text-center my-4">Hapus Katalog</h2>
      <ListGroup className="mx-auto my-4 w-75 min-vh-100">
        {message && <Alert variant="info">{message}</Alert>}
        <ListGroup.Item
          className="text-white rounded-top fw-bold text-center"
          style={{ backgroundColor: "#628B35" }}
        >
          <Row>
            <Col xs={1}>No.</Col>
            <Col>Nama Benih</Col>
            <Col>Jenis</Col>
            <Col>Stok</Col>
            <Col></Col>
          </Row>
        </ListGroup.Item>
        {dataKatalog.map((katalog, index) => (
          <ListGroup.Item
            key={index}
            className="bg-opacity-25 text-center border-bottom border-light"
            style={{ backgroundColor: "#E2DBD0" }}
          >
            <Row className="align-items-center">
              <Col xs={1}>{index + 1}.</Col>
              <Col>{katalog.varietas}</Col>
              <Col>{katalog.jenis_benih}</Col>
              <Col>{katalog.stok}</Col>
              <Col>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleConfirmDelete(katalog.id)}
                >
                  Hapus
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
        <Button
          variant="outline-secondary"
          className="mt-4 w-25 rounded-4 me-auto"
          onClick={() => window.history.back()}
        >
          Kembali
        </Button>
      </ListGroup>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah anda yakin ingin menghapus?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirm(false);
              setSelectedId(null);
            }}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedId)}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer role="admin"/>
    </div>
  );
};

export default RemoveKatalog;
