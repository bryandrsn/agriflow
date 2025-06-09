import React from "react";
import { FaUser } from "react-icons/fa";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import logo from "../assets/logoagriflow.png";

const DashboardNavBar = ({ role }) => {
  return (
    <Navbar
      variant="dark"
      className="sticky-top shadow-lg py-0"
      style={{ backgroundColor: "#103713", height: "60px" }}
    >
      <Container className="align-items-center">
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <div style={{ height: "160px" }}>
            <Image src={logo} className="img-fluid h-100" alt="Logo" />
          </div>
        </Navbar.Brand>
        <Navbar.Collapse />
        <Nav>
          {role === "user" && <Nav.Link href="/dashboard">Beranda</Nav.Link>}
          {role === "admin" && (
            <Nav.Link href="/dashboard-admin">Beranda</Nav.Link>
          )}
          {role === "user" && <Nav.Link href="/katalog">Katalog</Nav.Link>}
          {role === "admin" && (
            <Nav.Link href="/katalog-admin">Katalog</Nav.Link>
          )}
          {role === "user" && <Nav.Link href="/wishlists">Wishlists</Nav.Link>}
          {role === "admin" && (
            <Nav.Link href="/optimasi">Optimasi Irigasi</Nav.Link>
          )}
          <Nav.Link href="/akun">
            <FaUser
              className="rounded-circle ms-3"
              style={{ width: "30px", height: "30px", color: "white" }}
            />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default DashboardNavBar;
