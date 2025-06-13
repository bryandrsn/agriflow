import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Image, Alert } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import DashboardNavBar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

const Wishlists = () => {
  const [wishlists, setWishlists] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchWishlists = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-wishlists", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setWishlists(data);
      } else {
        setMessage(data.error || "Gagal memuat data katalog");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat memuat data:", err);
    } finally {
      setDataFetched(true);
    }
  };

  const removeWishlist = async (id) => {
    try {
      const response = await fetch("http://localhost:5000/remove-wishlist", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ benih_id: id }),
      });

      const data = await response.json();
      if (response.ok) {
        await fetchWishlists();
        setMessage(`success|${data.message}`);
      } else {
        setMessage(data.error || "Gagal menghapus dari wishlist");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan: " + err.message);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div>
      <DashboardNavBar role="user" />
      <Container className="my-5 min-vh-100">
        {message && (
          <Alert
            variant={message.startsWith("success") ? "success" : "danger"}
            onClose={() => setMessage("")}
            dismissible
            className="mb-4"
          >
            {message.startsWith("success") ? message.split("|")[1] : message}
          </Alert>
        )}
        <h2 className="mb-4 d-flex align-items-center">Wishlists</h2>
        {dataFetched && wishlists.length === 0 ? (
          <Alert variant="info">Wishlist kamu masih kosong</Alert>
        ) : (
          <Table borderless className="align-middle">
            <thead>
              <tr className="text-secondary">
                <th className="ps-5">Produk</th>
                <th>Harga</th>
                <th>Status stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody style={{ color: "#4a4a4a" }}>
              {wishlists.map((wishlist) => (
                <tr key={wishlist.id} className="border-top border-tertiary">
                  <td className="ps-3">
                    <Button
                      title="Hapus dari Wishlist"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      className="me-3"
                      onClick={() => removeWishlist(wishlist.id)}
                    >
                      <BsTrash size={20} color="grey" />
                    </Button>
                    <Image
                      src={wishlist.url_gambar || "https://picsum.photos/60/60"}
                      alt={wishlist.varietas}
                      width={60}
                      height={60}
                      className="object-fit-cover rounded"
                    />
                    <span className="fw-normal ms-3">{wishlist.varietas}</span>
                  </td>
                  <td>
                    {wishlist.hargaLama ? (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">
                          Rp. {wishlist.hargaLama}
                        </span>
                        <span className="text-danger fw-semibold">
                          Rp. {wishlist.harga}
                        </span>
                      </>
                    ) : (
                      <span className="fw-semibold">Rp. {wishlist.harga}</span>
                    )}
                  </td>
                  <td
                    className={
                      wishlist.stok > 0 ? "text-success" : "text-danger"
                    }
                  >
                    {wishlist.stok > 0 ? "Tersedia" : "Tidak tersedia"}
                  </td>
                  <td className="d-flex flex-column gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      className="text-uppercase fw-semibold"
                      onClick={() => navigate(`/detail-benih/${wishlist.id}`)}
                    >
                      Detail Produk
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="text-uppercase fw-semibold"
                    >
                      Order Produk
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <Footer role="user"/>
    </div>
  );
};

export default Wishlists;
