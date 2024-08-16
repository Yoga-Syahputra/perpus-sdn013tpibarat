import React, { useRef } from "react";
import {
  Link,
  Button,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { FaHome, FaListAlt, FaBars, FaUserCog } from "react-icons/fa";
import logo from "../assets/img/library.png";

const Sidebar = ({ isOpen, toggleSidebar, role }) => {
  const navigate = useNavigate();
  const bg = useColorModeValue("gray.100", "gray.900");

  console.log("Role passed to Sidebar:", role); 

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 p-4 flex flex-col transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
      style={{ width: "250px", zIndex: 1000 }}
    >
      <div className="my-2 mb-4 flex items-center justify-between">
        <img
          src={logo}
          alt="Perpustakaan Logo"
          style={{
            width: "150px",
            height: "auto",
            maxHeight: "160px",
          }}
          onClick={() => navigate("/admin")}
          className="cursor-pointer"
        />
        <IconButton
          icon={<FaBars />}
          variant="outline"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          color="white"
          mr="4px"
          mb="25px"
          mt="-90px"
        />
      </div>
      <ul className="space-y-2 flex-1">
        <li>
          <Link as={RouterLink} to="/admin" _hover={{ textDecoration: "none" }}>
            <Button
              leftIcon={<FaHome />}
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
              color="white"
              onClick={toggleSidebar}
            >
              Statistik
            </Button>
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="/list" _hover={{ textDecoration: "none" }}>
            <Button
              leftIcon={<FaListAlt />}
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
              color="white"
              onClick={toggleSidebar}
            >
              Daftar Pengunjung
            </Button>
          </Link>
        </li>
        {role === "admin" && (
          <li>
            <Link
              as={RouterLink}
              to="/admin-config"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                leftIcon={<FaUserCog />}
                variant="ghost"
                w="100%"
                justifyContent="flex-start"
                color="white"
                onClick={toggleSidebar}
              >
                Konfigurasi Admin
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
