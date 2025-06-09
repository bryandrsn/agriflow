import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';

const Optimasi = () => {
    return (
        <div className="bg-light">
            <DashboardNavbar role="admin" />
            <Container className="my-5 min-vh-100">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <h1 className="text-center mb-4">Optimasi Proses Pertanian</h1>
                        <p className="text-center mb-4">
                            Halaman ini akan menyediakan berbagai tools dan informasi untuk membantu petani dalam mengoptimalkan proses pertanian mereka.
                        </p>
                        <div className="text-center">
                            <Button variant="primary" size="lg">Mulai Optimasi</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default Optimasi;