import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Box, AbsoluteCenter } from "@chakra-ui/react";
import VerificationModal from "../components/VerificationModal";
import { FaUserEdit, FaSignInAlt } from "react-icons/fa";
import logo from "../assets/img/library.png";
import bg1 from "../assets/img/background.jpg";
import bg2 from "../assets/img/background2.jpg";
import bg3 from "../assets/img/background3.jpg";
import { gsap } from "gsap";
import Footer from "../components/Footer"; 

const Home = () => {
  const backgrounds = [bg1, bg2, bg3];
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [nextBackgroundIndex, setNextBackgroundIndex] = useState(1);
  const [isVerified, setIsVerified] = useState(
    localStorage.getItem("isVerified") === "true"
  );
  const [isModalOpen, setIsModalOpen] = useState(!isVerified);

  const logoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex(
        (prevIndex) => (prevIndex + 1) % backgrounds.length
      );
      setNextBackgroundIndex(
        (prevIndex) => (prevIndex + 2) % backgrounds.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.to(logoRef.current, {
      y: 20, // Move the logo
      duration: 2, // Duration of the animation
      ease: "power1.inOut", // Easing function
      repeat: -1, // Repeat indefinitely
      yoyo: true, // Move back to the original position
    });
  }, []);

  const handleVerification = () => {
    setIsVerified(true);
    localStorage.setItem("isVerified", "true");
    setIsModalOpen(false);
  };

  return (
    <div
      className={`p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${
        isModalOpen ? "filter blur-sm" : ""
      }`}
    >
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${backgrounds[currentBackgroundIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
          filter: "blur(4px)",
        }}
      ></div>
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${backgrounds[nextBackgroundIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
          filter: "blur(4px)",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60 backdrop-blur-md"></div>
      <div className="relative z-10 text-center">
        <Box position="relative" h="300px">
          <AbsoluteCenter>
            <img
              ref={logoRef}
              src={logo}
              alt="Perpustakaan Logo"
              className="mb-1 w-100 h-80 justify-center transition-transform transform hover:scale-105"
            />
          </AbsoluteCenter>
        </Box>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
          Aplikasi Pengunjung Perpustakaan SDN 013 Tanjungpinang Barat
        </h1>
        <p className="text-base md:text-lg lg:text-xl mb-8 font-bold text-white textShadow='1px 1px #ff0000'">
          Selamat datang! Silakan pilih salah satu opsi yang ada di bawah ini!
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-center justify-center">
          <Link
            to="/visitor-form"
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded transition duration-300 text-sm md:text-base lg:text-lg flex items-center"
          >
            <FaUserEdit className="mr-2" />
            Formulir Pengunjung
          </Link>
          <Link
            to="/admin-login"
            className="bg-green-600 hover:bg-green-800 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded transition duration-300 text-sm md:text-base lg:text-lg flex items-center"
          >
            <FaSignInAlt className="mr-2" />
            Login Admin
          </Link>
        </div>
      </div>
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVerified={handleVerification}
      />
      <Footer /> 
    </div>
  );
};

export default Home;
