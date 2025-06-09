import React from 'react';
import '../styles/landing.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';

const Dashboard = () => {
    return (
        <div className='bg'>
            <DashboardNavbar role="user" />
            <Container fluid className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
                        <h1 className="display-4 mb-5 text-white" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>Belanja Cerdas, Diskusi Bebas!</h1>
                        <Button className="mb-5 px-5" variant="success" size="lg" href="#about">Lihat Katalog</Button>
            </Container>
            <Container className="vh-100 mb-4">
                <Row id='about' className='h-100 align-items-center' style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        padding: '2rem',
                        borderRadius: '20px'
                    }}>
                    <Col md={6} className='text-end text-white' >
                        <h3 className='display-5'>Selamat Datang!</h3>
                        <br/>
                        <p className='lead'>AgriFlow adalah sebuah website yang dikembangkan untuk
                            menemani para petani. AgriFlow menghadirkan solusi digital bagi
                            petani untuk mencari produk pertanian, berbagi pengalaman melalui forum, 
                            dan membandingkan berbagai jenis benih secara praktis. Semua informasi
                            penting tersedia dalam satu platform yang mudah digunakan.
                        </p>
                    </Col>
                    <Col md={6} className='border'>
                        <img src="/path/to/logo.png" alt="logo" style={{ maxWidth: '100%', height: 'auto' }}/>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default Dashboard;