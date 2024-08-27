import React from "react";
import { Navigate } from "react-router-dom";

const VerificationRoute = ({ children }) => {
  const isVerified = localStorage.getItem("isVerified");

  if (!isVerified) {
    return <Navigate to="/" />;
  }

  return children;
};

export default VerificationRoute;
