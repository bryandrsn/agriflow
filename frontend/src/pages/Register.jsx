import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (formData.username.length > 20) {
      newErrors.username = "Username maksimal 20 karakter";
    } else if (formData.username.length < 6) {
      newErrors.username = "Username minimal 6 karakter";
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Username tidak boleh mengandung spasi";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          if (responseData.error.includes("Username terdaftar")) {
            setMessage("Username sudah digunakan");
          } else if (responseData.error.includes("Email terdaftar")) {
            setMessage("Email sudah terdaftar");
          } else {
            setMessage(responseData.error);
          }
        } else {
          setMessage(responseData.error || "Terjadi kesalahan saat registrasi");
        }
        return;
      }

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      setMessage(
        "success|Akun berhasil dibuat. Anda akan segera diarahkan ke halaman login!"
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Terjadi kesalahan saat registrasi");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <LandingNavbar />
      <Container className="py-5">
        <Row className="justify-content-center align-items-center">
          <Col lg={6} className="d-none d-lg-block pe-5">
            <div className="text-center">
              <Image
                src="https://picsum.photos/350/350"
                alt="Dekorasi Register"
                fluid
                rounded
                className="shadow"
                style={{
                  width: "auto",
                  maxHeight: "350px",
                  objectFit: "cover",
                }}
              />
            </div>
          </Col>

          <Col xs={12} md={8} lg={5} className="mx-auto">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
              <h2 className="fw-bold text-center mb-4 text-success">
                Register
              </h2>

              {message && (
                <Alert
                  variant={message.startsWith("success") ? "success" : "danger"}
                  onClose={() => setMessage("")}
                  dismissible
                >
                  {message.startsWith("success")
                    ? message.split("|")[1]
                    : message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`rounded-3 px-3 py-2 ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Masukkan username (6-20 karakter)"
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`rounded-3 px-3 py-2 ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Masukkan email valid"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`rounded-3 px-3 py-2 ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Minimal 8 karakter"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  className="w-100 py-2 rounded-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Memproses...
                    </>
                  ) : (
                    "Daftar"
                  )}
                </Button>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Sudah punya akun?{" "}
                    <a
                      href="/login"
                      className="text-success fw-semibold text-decoration-none"
                    >
                      Masuk disini
                    </a>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
