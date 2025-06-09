import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Dropdown } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DashboardNavBar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const Perbandingan = () => {
  const { id } = useParams();
  const [dataBenih, setDataBenih] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedBenih, setSelectedBenih] = useState(null);

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
    }
  };

  useEffect(() => {
    fetchDataBenih();
  }, []);

  const mainBenih = dataBenih.find((benih) => benih.id === Number(id));
  const comparedBenih = dataBenih.find(
    (benih) => benih.id === Number(selectedBenih)
  );

  return (
    <div>
      <DashboardNavBar role="user" />
      <Container className="py-5 min-vh-100">
        <h2 className="text-center mb-4">Perbandingan Benih</h2>
        {message && <Alert variant="danger">{message}</Alert>}
        <Row>
          {mainBenih && (
            <Col md={5} xs={12} className="my-4">
              <Card className="shadow rounded-4">
                <Card.Img
                  variant="top"
                  src="https://picsum.photos/300/200"
                  className="rounded-top-4"
                />
                <Card.Body>
                  <Card.Title>{mainBenih.varietas}</Card.Title>
                  <Card.Text>
                    <strong>Varietas: </strong>
                    {mainBenih.varietas}
                    <br />
                    <strong>Jenis: </strong>
                    {mainBenih.jenis_benih}
                    <br />
                    <strong>Umur: </strong>
                    {mainBenih.umur}
                    <br />
                    <strong>Harga: </strong>Rp. {mainBenih.harga}
                    <br />
                    <strong>Stok: </strong>
                    {mainBenih.stok}
                    <br />
                    <strong>Deskripsi: </strong>
                    {mainBenih.deskripsi}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )}
          <Col
            md={2}
            xs={12}
            className="d-flex flex-column justify-content-center align-items-center my-4 text-center"
          >
            <p>Pilih benih yang ingin dibandingkan</p>
            <Dropdown onSelect={(eventKey) => setSelectedBenih(eventKey)}>
              <Dropdown.Toggle size="sm" variant="success" id="dropdown-basic">
                {selectedBenih ? comparedBenih.varietas : "Pilih benih"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                {dataBenih.map((benih) => (
                  <Dropdown.Item key={benih.id} eventKey={benih.id}>
                    {benih.varietas}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className="mt-3"
              size="sm"
              variant="outline-secondary"
              onClick={() => window.history.back()}
            >
              Kembali
            </Button>
          </Col>
          {!selectedBenih && (
            <Col md={5} xs={12} className="my-4">
              <Card className="shadow rounded-4 mb-4">
                <Card.Img
                  variant="top"
                  src="https://picsum.photos/300/200"
                  className="rounded-top-4"
                />
                <Card.Body>
                  <Card.Title>Benih B</Card.Title>
                  <Card.Text>
                    <strong>Varietas: </strong>-<br />
                    <strong>Jenis: </strong>-<br />
                    <strong>Umur: </strong>-<br />
                    <strong>Harga: </strong>-<br />
                    <strong>Stok: </strong>-<br />
                    <strong>Deskripsi: </strong>-
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )}
          {selectedBenih && comparedBenih && (
            <Col md={5} xs={12} className="my-4">
              <Card className="shadow rounded-4 mb-4">
                <Card.Img
                  variant="top"
                  src="https://picsum.photos/300/200"
                  className="rounded-top-4"
                />
                <Card.Body>
                  <Card.Title>{comparedBenih.varietas}</Card.Title>
                  <Card.Text>
                    <strong>Varietas: </strong>
                    {comparedBenih.varietas}
                    <br />
                    <strong>Jenis: </strong>
                    {comparedBenih.jenis_benih}
                    <br />
                    <strong>Umur: </strong>
                    {comparedBenih.umur}
                    <br />
                    <strong>Harga: </strong>Rp. {comparedBenih.harga}
                    <br />
                    <strong>Stok: </strong>
                    {comparedBenih.stok}
                    <br />
                    <strong>Deskripsi: </strong>
                    {comparedBenih.deskripsi}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
export default Perbandingan;
