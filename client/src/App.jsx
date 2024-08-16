import React from "react";
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
import DaftarPengunjung from "./pages/DaftarPengunjung";
import PrivateRoute from "./components/PrivateRoute";
import UbahPassword  from "./pages/UbahPassword";
import KonfigurasiAdmin from "./pages/KonfigurasiAdmin";

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
                <DaftarPengunjung />
              </PrivateRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
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
              <PrivateRoute>
                <KonfigurasiAdmin />
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
