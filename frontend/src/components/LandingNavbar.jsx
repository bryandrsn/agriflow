import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const LandingNavbar = () => {
    return (
            <Navbar variant="dark" className='sticky-top shadow-lg p-3' style={{backgroundColor: "#103713"}} >
                <Container>
                    <Navbar.Brand href="/">AgriFlow</Navbar.Brand>
                    <Navbar.Collapse></Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/register">Register</Nav.Link>
                        </Nav>
                </Container>
            </Navbar>
    );
};

export default LandingNavbar;