import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import {
  FaHome,
  FaSeedling,
  FaHeart,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import logo from "../assets/logoagriflow.png";

const Footer = () => {
  return (
    <footer
      className="text-white pt-5 pb-2"
      style={{ backgroundColor: "#103713" }}
    >
      <Container>
        <Row className="g-5">
          <Col
            xs={12}
            md={6}
            lg={4}
            className="text-center text-md-start mb-4 mb-md-0"
          >
            <div className="d-flex justify-content-center justify-content-md-start mb-3">
              <Image
                src={logo}
                alt="Agriflow Logo"
                style={{
                  height: "auto",
                  maxWidth: "200px",
                  width: "100%",
                }}
                className="img-fluid"
              />
            </div>
            <p className="small px-3 px-md-0 text-center text-md-start">
              Solusi terbaik untuk kebutuhan benih tanaman berkualitas tinggi
              dengan harga kompetitif.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start mt-3">
              <a href="#" className="text-white me-3">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white me-3">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white">
                <FaTwitter size={20} />
              </a>
            </div>
          </Col>

          <Col xs={6} md={3} lg={2} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-3 text-center text-md-start">Menu</h6>
            <ul className="list-unstyled">
              <li className="mb-2 text-center text-md-start">
                <a
                  href="/dashboard"
                  className="text-white text-decoration-none"
                >
                  <FaHome className="me-2" /> Dashboard
                </a>
              </li>
              <li className="mb-2 text-center text-md-start">
                <a href="/katalog" className="text-white text-decoration-none">
                  <FaSeedling className="me-2" /> Katalog
                </a>
              </li>
              <li className="text-center text-md-start">
                <a
                  href="/wishlists"
                  className="text-white text-decoration-none"
                >
                  <FaHeart className="me-2" /> Wishlists
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={6} md={6} lg={3} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-3 text-center text-md-start">
              Kontak Kami
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                <FaEnvelope className="me-2" />
                <span>agriflow@example.com</span>
              </li>
              <li className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                <FaPhone className="me-2" />
                <span>+62 123 4567 8901</span>
              </li>
              <li className="d-flex justify-content-center justify-content-md-start">
                <FaMapMarkerAlt className="me-2 mt-1 flex-shrink-0" />
                <span className="text-start">
                  Jl. Manyar Gg. Kelapa RT.002 RW.005 Lingk. Krajan Kel Slawu
                  Kec. Patrang Kab. Jember, Jawa Timur.
                </span>
              </li>
            </ul>
          </Col>

          <Col xs={12} md={6} lg={3} className="text-center text-md-start">
            <h6 className="fw-bold mb-3">Jam Operasional</h6>
            <ul className="list-unstyled">
              <li className="mb-2">Senin-Jumat: 08.00 - 17.00</li>
              <li className="mb-2">Sabtu: 08.00 - 15.00</li>
              <li>Minggu & Hari Besar: Tutup</li>
            </ul>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <hr
              className="my-2"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            />
            <p className="mb-0 small">
              &copy; {new Date().getFullYear()} Agriflow. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
