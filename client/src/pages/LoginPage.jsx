import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForms from "../components/auth/AuthForms.jsx";

// Login + signup page; redirects away if already logged in
const LoginPage = ({ auth }) => {
  const { user, login } = auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const target = user.role === "ADMIN" ? "/admin" : "/client";
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  return <AuthForms onAuth={login} />;
};

export default LoginPage;

