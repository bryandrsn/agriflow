import React from "react";
import "../styles/landing.css";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="bg">
      <LandingNavbar />
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100 px-3"
      >
        <h1
          className="display-4 mb-4 text-white fw-bold"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
        >
          Belanja Cerdas, Diskusi Bebas!
        </h1>
        <Button className="mb-4 px-4" variant="success" size="lg" href="#about">
          Selengkapnya
        </Button>
      </Container>
      <Container className="py-5">
        <Row
          id="about"
          className="align-items-center py-4 px-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "20px",
          }}
        >
          <Col
            md={6}
            className="d-flex flex-column justify-content-center text-white px-4 mb-4 mb-md-0"
          >
            <h3 className="display-5 fw-semibold mb-4 text-center">
              Selamat Datang!
            </h3>
            <p className="lead text-center">
              AgriFlow adalah sebuah website yang dikembangkan untuk menemani
              para petani. AgriFlow menghadirkan solusi digital bagi petani
              untuk mencari produk pertanian, berbagi pengalaman melalui forum,
              dan membandingkan berbagai jenis benih secara praktis. Semua
              informasi penting tersedia dalam satu platform yang mudah
              digunakan.
            </p>
          </Col>
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Image
              src="/assets/deco-1.png"
              alt="Dekorasi landing"
              fluid
              rounded
              className="shadow"
              style={{
                maxHeight: "350px",
                objectFit: "cover",
              }}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Landing;
