import React from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import logo from "../assets/logoagriflow.png";


const LandingNavbar = () => {
    return (
            <Navbar variant="dark" className='sticky-top shadow-lg' style={{backgroundColor: "#388E3C"}} >
                <Container className='align-items-center'>
                    <Navbar.Brand href="/" className='d-flex align-items-center'>
                        <Image
                            src={logo}
                            alt="Logo"
                            style={{ height: "auto", maxWidth: "175px", width: "100%" }}
                        />
                    </Navbar.Brand>
                    <Navbar.Collapse/>
                        <Nav>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/register">Register</Nav.Link>
                        </Nav>
                </Container>
            </Navbar>
    );
};

export default LandingNavbar;