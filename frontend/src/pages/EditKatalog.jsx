import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import DashboardNavBar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const EditKatalog = () => {
    const { id } = useParams();
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const [dataEdit, setDataEdit] = useState({
        id: "",
        varietas: "",
        jenis: "",
        umur: "",
        harga: "",
        stok: "",
        url_gambar: "",
        deskripsi: "",
    });

    useEffect(() => {
        const fetchKatalog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-katalog/${id}`, {
                    method: "GET",
                    credentials: "include"
                });
                
                const data = await response.json();
                if (response.ok) {
                    setDataEdit(data);
                }
                else {
                    setMessage(data.error || "Gagal memuat data katalog");
                }
            } catch (err) {
                setMessage("Terjadi kesalahan saat memuat data: ", err);
            }
        };
        fetchKatalog();
    }, [id]);

    const handleChange = (e) => {
        setDataEdit({
            ...dataEdit,
            [e.target.name]: e.target.value,
        });
    };

    const handleConfirmSave = (e) => {
        e.preventDefault();

        // Validasi field tidak kosong
        const isEmpty = Object.values(dataEdit).some(value => value.trim() === "");
        if (isEmpty) {
            alert("Semua field wajib diisi!");
            return;
        }

        setShowConfirm(true);
    };

    const handleSubmit = async () => {
        setSaving(true);
        setMessage("");
        setShowConfirm(false);

        try {
            const response = await fetch("http://localhost:5000/update-katalog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(dataEdit)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Katalog berhasil diedit");
            } else {
                setMessage(data.error || "Gagal mengedit katalog");
            }
        } catch (err) {
            setMessage(`Terjadi kesalahan saat mengedit: ${err}`);
        } finally {
            setSaving(false);
        };
    };

    return (
        <div>
            <DashboardNavBar role="admin"/>
            <Container md={6} className="d-flex flex-column py-5 my-4 min-vh-100 shadow rounded-4" style={{maxWidth: '1000px'}} >
                <h1 className="ms-3">Edit Katalog</h1>
                <hr className="border border-1 border-dark w-100" />
                <Form method="POST" className="px-2 fw-semibold" onSubmit={handleConfirmSave}>
                    <Form.Group controlId="varietas" className="mb-3">
                        <Form.Label className="ms-2">Varietas</Form.Label>
                        <Form.Control
                            className="rounded-4 px-4 py-2"
                            type="text" name="varietas"
                            placeholder="Masukkan Varietas" 
                            value={dataEdit.varietas}
                            onChange={handleChange}
                            style={{ backgroundColor: "#D9D9D9", border: "none" }}/>
                    </Form.Group>
                    <Form.Group controlId="jenis" className="mb-3">
                        <Form.Label className="ms-2">Jenis Benih</Form.Label>
                        <Form.Control
                            className="rounded-4 px-4 py-2" 
                            type="text" name="jenis" 
                            placeholder="Masukkan Jenis Benih" 
                            value={dataEdit.jenis}
                            onChange={handleChange}
                            style={{ backgroundColor: "#D9D9D9", border: "none" }}/>
                    </Form.Group>
                    <Form.Group controlId="umur" className="mb-3">
                        <Form.Label className="ms-2">Umur (hari)</Form.Label>
                        <Form.Control 
                            className="rounded-4 px-4 py-2" 
                            type="text" name="umur" 
                            placeholder="Masukkan Umur" 
                            value={dataEdit.umur}
                            onChange={handleChange}
                            style={{ backgroundColor: "#D9D9D9", border: "none" }}/>
                    </Form.Group>
                    <Form.Group controlId="harga" className="mb-3">
                        <Form.Label className="ms-2">Harga</Form.Label>
                        <Form.Control 
                            className="rounded-4 px-4 py-2" 
                            type="number" name="harga" 
                            placeholder="Masukkan Harga" 
                            value={dataEdit.harga}
                            onChange={handleChange}
                            style={{ backgroundColor: "#D9D9D9", border: "none" }}/>
                    </Form.Group>
                    <Form.Group controlId="stok" className="mb-3">
                        <Form.Label className="ms-2">Stok</Form.Label>
                        <Form.Control 
                            className="rounded-4 px-4 py-2" 
                            type="number" name="stok" 
                            placeholder="Masukkan Jumlah Stok" 
                            value={dataEdit.stok}
                            onChange={handleChange}
                            style={{ backgroundColor: "#D9D9D9", border: "none" }}/>
                    </Form.Group>
                    <Form.Group controlId="url_gambar" className="mb-3">
                        <Form.Label className="ms-2">URL Gambar</Form.Label>
                        <Form.Control 
                            className="rounded-4 px-4 py-2" 
                            type="text" name="url_gambar" 
                            placeholder="Masukkan URL Gambar" 
                            value={dataEdit.url_gambar}
                            onChange={handleChange}
                            style={{ backgroundColor: "#D9D9D9", border: "none" }}/>
                    </Form.Group>
                    <Form.Group controlId="deskripsi" className="mb-3">
                        <Form.Label className="ms-2">Deskripsi</Form.Label>
                        <Form.Control 
                            className="rounded-4 px-4 py-2 text-start"
                            rows={5}
                            as="textarea" 
                            name="deskripsi" 
                            placeholder="Masukkan Deskripsi" 
                            value={dataEdit.deskripsi}
                            onChange={handleChange}
                            style={{ backgroundColor: "#D9D9D9", border: "none" }}/>
                    </Form.Group>
                    {message && <Alert variant="info">{message}</Alert>}
                    <div className="d-flex">
                    <Button variant="outline-secondary" className="mt-4 w-25 rounded-4 me-auto" onClick={() => window.history.back()}>Kembali</Button>
                    <Button
                        className="mt-4 rounded-4 w-25"
                        type="submit"
                        style={{ backgroundColor: "#628B35", border: "none" }}
                        disabled={ saving }>
                        {saving ? "Menyimpan..." : "Simpan"}
                    </Button>
                    </div>
                </Form>
            </Container>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Apakah anda yakin ingin menyimpan perubahan?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Batal
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        Simpan
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </div>
    );
};

export default EditKatalog;