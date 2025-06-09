import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch("http://localhost:5000/check-login", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.logged_in && allowedRoles.includes(data.role)) {
          setAuthorized(true);
          console.log(data.role);
        }
      } catch (err) {
        console.error("Gagal mengecek login", err);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [allowedRoles]);

  useEffect(() => {
    if (!loading && !authorized) {
      navigate("/login", { replace: true });
    }
  }, [loading, authorized, navigate]);

  if (loading) return null;
  console.log(allowedRoles);
  return authorized ? children : null;
};

export default ProtectedRoute;
