import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import FormulirPengunjung from "./pages/FormulirPengunjung";
import Footer from "./components/Footer";
import ListPengunjungPage from "./pages/ListPengunjungPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/";

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
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/list"
            element={
              <PrivateRoute>
                <ListPengunjungPage />
              </PrivateRoute>
            }
          />
          <Route path="/visitor-form" element={<FormulirPengunjung />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
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
