import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Form,
  Alert,
  Modal,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });
  const [showConfirm, setShowConfirm] = useState({
    profile: false,
    password: false,
  });
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setProfileData({
            username: data.username,
            email: data.email,
          });
          setRole(data.role ? "admin" : "user");
        } else {
          setMessage(data.error || "Gagal memuat data akun");
        }
      } catch (err) {
        setMessage(`Terjadi kesalahan saat memuat data akun: ${err}`);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (profileData.username.length > 20) {
      newErrors.username = "Username maksimal 20 karakter";
    } else if (profileData.username.length < 6) {
      newErrors.username = "Username minimal 6 karakter";
    } else if (/\s/.test(profileData.username)) {
      newErrors.username = "Username tidak boleh mengandung spasi";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      newErrors.email = "Email tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Password saat ini harus diisi";
    }

    if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password baru minimal 8 karakter";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateProfile()) {
      return;
    }

    setShowConfirm({ ...showConfirm, profile: true });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validatePassword()) {
      return;
    }

    setShowConfirm({ ...showConfirm, password: true });
  };

  const confirmProfileUpdate = async () => {
    setLoading({ ...loading, profile: true });
    setShowConfirm({ ...showConfirm, profile: false });

    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("success|Data profil berhasil diperbarui");
      } else {
        setMessage(data.error || "Gagal memperbarui profil");
      }
    } catch (err) {
      setMessage(`Terjadi kesalahan saat menyimpan: ${err}`);
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const confirmPasswordUpdate = async () => {
    setLoading({ ...loading, password: true });
    setShowConfirm({ ...showConfirm, password: false });

    try {
      const response = await fetch("http://localhost:5000/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("success|Password berhasil diubah");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.error || "Gagal mengubah password");
      }
    } catch (err) {
      setMessage(`Terjadi kesalahan saat mengubah password: ${err}`);
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      setMessage(`Logout gagal: ${err}`);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <DashboardNavbar role={role} />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <h2 className="fw-bold text-center mb-4">Kelola Akun</h2>
            <Card className="mb-4 shadow-sm p-3">
              <Card.Body>
                <Card.Title className="fw-bold mb-4 text-success">
                  Informasi Profil
                </Card.Title>
                <Form onSubmit={handleProfileSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className={`rounded-3 px-3 py-2 ${
                        errors.username ? "is-invalid" : ""
                      }`}
                    />
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`rounded-3 px-3 py-2 ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="success"
                      type="submit"
                      className="px-4 rounded-3 fw-bold"
                      disabled={loading.profile}
                    >
                      {loading.profile ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {message && (
              <Alert
                variant={message.startsWith("success") ? "success" : "danger"}
                onClose={() => setMessage("")}
                dismissible
                className="mb-4"
              >
                {message.startsWith("success")
                  ? message.split("|")[1]
                  : message}
              </Alert>
            )}

            <Card className="mb-4 shadow-sm p-3">
              <Card.Body>
                <Card.Title className="fw-bold mb-4 text-success">
                  Ganti Password
                </Card.Title>
                <Form onSubmit={handlePasswordSubmit}>
                  <Form.Group className="mb-3" controlId="formCurrentPassword">
                    <Form.Label>Password Saat Ini</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`rounded-3 px-3 py-2 ${
                        errors.currentPassword ? "is-invalid" : ""
                      }`}
                    />
                    {errors.currentPassword && (
                      <div className="invalid-feedback">
                        {errors.currentPassword}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formNewPassword">
                    <Form.Label>Password Baru</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`rounded-3 px-3 py-2 ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                    />
                    {errors.newPassword && (
                      <div className="invalid-feedback">
                        {errors.newPassword}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formConfirmPassword">
                    <Form.Label>Konfirmasi Password Baru</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`rounded-3 px-3 py-2 ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="success"
                      type="submit"
                      className="px-4 rounded-3 fw-bold"
                      disabled={loading.password}
                    >
                      {loading.password ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Menyimpan...
                        </>
                      ) : (
                        "Ganti Password"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Button
                variant="outline-danger"
                className="px-4 rounded-3 fw-bold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showConfirm.profile}
        onHide={() => setShowConfirm({ ...showConfirm, profile: false })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Perubahan Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menyimpan perubahan pada profil Anda?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm({ ...showConfirm, profile: false })}
          >
            Batal
          </Button>
          <Button variant="success" onClick={confirmProfileUpdate}>
            {loading.profile ? "Menyimpan..." : "Simpan"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirm.password}
        onHide={() => setShowConfirm({ ...showConfirm, password: false })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Ganti Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin mengubah password Anda?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm({ ...showConfirm, password: false })}
          >
            Batal
          </Button>
          <Button variant="success" onClick={confirmPasswordUpdate}>
            {loading.password ? "Menyimpan..." : "Ganti Password"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer role={role}/>
    </div>
  );
};

export default Profile;
