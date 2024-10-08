import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import FormulirPengunjung from "./pages/FormulirPengunjung";
import DaftarPengunjung from "./pages/DaftarPengunjung";
import PrivateRoute from "./components/PrivateRoute";
import VerificationRoute from "./components/VerificationRoute";
import UbahPassword from "./pages/UbahPassword";
import KonfigurasiAdmin from "./pages/KonfigurasiAdmin";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-login"
            element={
              <VerificationRoute>
                <AdminLogin />
              </VerificationRoute>
            }
          />
          <Route
            path="/list"
            element={
              <PrivateRoute>
                <DaftarPengunjung />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <UbahPassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-config"
            element={
            
                <KonfigurasiAdmin />
             
            }
          />
          <Route
            path="/visitor-form"
            element={
              <VerificationRoute>
                <FormulirPengunjung />
              </VerificationRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const WrappedApp = () => (
  <ChakraProvider>
    <Router>
      <App />
    </Router>
  </ChakraProvider>
);

export default WrappedApp;
