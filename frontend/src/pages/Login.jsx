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

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
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

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length > 20) {
      newErrors.username = "Username maksimal 20 karakter";
    } else if (formData.username.length < 6) {
      newErrors.username = "Username minimal 6 karakter";
    }

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
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          if (responseData.error.includes("Username belum terdaftar")) {
            setMessage(
              "Akun belum terdaftar, silakan register terlebih dahulu!"
            );
            return;
          }
          if (responseData.error.includes("Password salah")) {
            setMessage("Password yang anda masukkan salah!");
            return;
          }
        }
        setMessage(responseData.error || "Terjadi kesalahan saat login");
        return;
      }

      setFormData({
        username: "",
        password: "",
      });

      if (responseData.message.includes("Login berhasil")) {
        responseData.role
          ? navigate("/dashboard-admin")
          : navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat login, cek koneksi internet anda!");
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
                alt="Dekorasi Login"
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
              <h2 className="fw-bold text-center mb-4 text-success">Login</h2>

              {message && (
                <Alert
                  variant="danger"
                  onClose={() => setMessage("")}
                  dismissible
                >
                  {message}
                </Alert>
              )}

              <Form method="POST" onSubmit={handleSubmit}>
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
                    placeholder="Masukkan username"
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
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
                    placeholder="Masukkan password"
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
                      Loading...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Belum punya akun?{" "}
                    <a
                      href="/register"
                      className="text-success fw-semibold text-decoration-none"
                    >
                      Daftar sekarang
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

export default Login;
