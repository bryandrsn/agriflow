import "./styles/landing.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Katalog from "./pages/Katalog";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import KatalogAdmin from "./pages/KatalogAdmin";
import AddKatalog from "./pages/AddKatalog";
import RemoveKatalog from "./pages/RemoveKatalog";
import EditKatalog from "./pages/EditKatalog";
import DetailBenih from "./pages/DetailBenih";
import DetailBenihAdmin from "./pages/DetailBenihAdmin";
import Perbandingan from "./pages/Perbandingan";
import Wishlists from "./pages/Wishlists";
import Optimasi from "./pages/Optimasi";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[0]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/katalog"
            element={
              <ProtectedRoute allowedRoles={[0]}>
                <Katalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail-benih/:id"
            element={
              <ProtectedRoute allowedRoles={[0]}>
                <DetailBenih />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/katalog-admin"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <KatalogAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[0, 1]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-katalog"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AddKatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/remove-katalog"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <RemoveKatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-katalog/:id"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <EditKatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail-benih-admin/:id"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <DetailBenihAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perbandingan/:id"
            element={
              <ProtectedRoute allowedRoles={[0]}>
                <Perbandingan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlists"
            element={
              <ProtectedRoute allowedRoles={[0]}>
                <Wishlists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/optimasi"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <Optimasi />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
