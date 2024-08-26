import React from "react";
import { Box, Link, Button, IconButton, Image, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { FaHome, FaListAlt, FaBars, FaUserCog } from "react-icons/fa";
import logo from "../assets/img/library.png";

const Sidebar = ({ isOpen, toggleSidebar, role }) => {
  const navigate = useNavigate();

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      height="100vh"
      bg="gray.800"
      p="4"
      display="flex"
      flexDirection="column"
      transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
      transition="transform 0.3s ease-in-out"
      width="250px"
      zIndex="1000"
    >
      <Flex mb="4" alignItems="center" justifyContent="space-between">
        <Image
          src={logo}
          alt="Perpustakaan Logo"
          width="150px"
          height="auto"
          maxHeight="160px"
          cursor="pointer"
          onClick={() => navigate("/admin")}
        />
        <IconButton
          icon={<FaBars />}
          variant="outline"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          color="white"
          size="sm"
          mr="4px"
          mb="25px"
          mt="-60px"
        />
      </Flex>
      <Flex as="ul" flex="1" direction="column" spacing="2">
        <Box as="li">
          <Link as={RouterLink} to="/admin" _hover={{ textDecoration: "none" }}>
            <Button
              leftIcon={<FaHome />}
              variant="ghost"
              width="100%"
              justifyContent="flex-start"
              color="white"
              onClick={toggleSidebar}
            >
              Statistik
            </Button>
          </Link>
        </Box>
        <Box as="li">
          <Link as={RouterLink} to="/list" _hover={{ textDecoration: "none" }}>
            <Button
              leftIcon={<FaListAlt />}
              variant="ghost"
              width="100%"
              justifyContent="flex-start"
              color="white"
              onClick={toggleSidebar}
            >
              Daftar Pengunjung
            </Button>
          </Link>
        </Box>
        {role === "admin" && (
          <Box as="li">
            <Link
              as={RouterLink}
              to="/admin-config"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                leftIcon={<FaUserCog />}
                variant="ghost"
                width="100%"
                justifyContent="flex-start"
                color="white"
                onClick={toggleSidebar}
              >
                Konfigurasi Admin
              </Button>
            </Link>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Sidebar;
