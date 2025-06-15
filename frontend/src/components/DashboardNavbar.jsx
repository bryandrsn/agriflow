import React from "react";
import { FaUser } from "react-icons/fa";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import logo from "../assets/logoagriflow.png";

const DashboardNavBar = ({ role }) => {
  return (
    <Navbar
      variant="dark"
      className="sticky-top shadow-lg"
      style={{ backgroundColor: "#388E3C" }}
    >
      <Container className="align-items-center">
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <Image
            src={logo}
            alt="Logo"
            style={{ height: "auto", maxWidth: "175px", width: "100%" }}
          />
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
          {role === "admin" && <Nav.Link href="/optimasi">Optimasi</Nav.Link>}
          <Nav.Link href="/profile">
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
