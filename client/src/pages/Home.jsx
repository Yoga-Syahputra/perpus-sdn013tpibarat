import React from "react";
import { Link } from "react-router-dom";
import { Box, AbsoluteCenter } from "@chakra-ui/react";
import backgroundImage from "../assets/background.jpg";
import logo from "../assets/library.png";

const Home = () => {
  return (
    <div
      className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60 backdrop-blur-md"></div>
      <div className="relative z-10 text-center">
        <Box position="relative" h="300px">
          <AbsoluteCenter>
            <img
              src={logo}
              alt="Perpustakaan Logo"
              className="mb-1 w-100 h-80 justify-center transition-transform transform hover:scale-105"
            />
          </AbsoluteCenter>
        </Box>
        <h1 className="text-4xl font-bold mb-4 text-white">
          Aplikasi Pengunjung Perpustakaan SDN 013 Tanjungpinang Barat
        </h1>
        <p className="text-lg mb-8 text-white">
          Selamat datang! Silakan pilih salah satu opsi yang ada di bawah ini!
        </p>
        <div className="space-x-4">
          <Link
            to="/visitor-form"
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded transition duration-300"
          >
            Formulir Pengunjung
          </Link>
          <Link
            to="/admin-login"
            className="bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded transition duration-300"
          >
            Login Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
