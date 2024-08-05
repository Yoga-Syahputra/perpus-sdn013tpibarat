import React, { useRef } from "react";
import {
  Box,
  Link,
  Button,
  useColorModeValue,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { FaHome, FaListAlt, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/library.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const bg = useColorModeValue("gray.100", "gray.900");
  const {
    isOpen: isSignOutOpen,
    onOpen: onSignOutOpen,
    onClose: onSignOutClose,
  } = useDisclosure();
  const cancelRef = useRef();

  const handleSignOut = () => {
    onSignOutClose();
    navigate("/admin-login");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 p-4 flex flex-col transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
      style={{ width: "250px" }}
    >
      <div className="my-2 mb-4">
        <img
          src={logo}
          alt="Perpustakaan Logo"
          style={{ width: "100%", height: "auto", maxHeight: "160px" }}
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
            >
              Daftar Pengunjung
            </Button>
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        <Button
          leftIcon={<FaSignOutAlt />}
          colorScheme="red"
          onClick={onSignOutOpen}
          w="100%"
        >
          Keluar
        </Button>
      </div>
      <AlertDialog
        isOpen={isSignOutOpen}
        leastDestructiveRef={cancelRef}
        onClose={onSignOutClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Keluar
            </AlertDialogHeader>
            <AlertDialogBody>Ingin keluar?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onSignOutClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleSignOut} ml={3}>
                Keluar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default Sidebar;
