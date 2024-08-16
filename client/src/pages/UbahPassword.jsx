import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { changePassword } from "../services/api"; 

const UbahPassword = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  // Get the role from localStorage or other source
  const userRole = localStorage.getItem("role");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password baru dan konfirmasi tidak cocok.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);

      toast({
        title: "Password berhasil diubah.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/admin");
    } catch (error) {
      toast({
        title: "Gagal mengubah password.",
        description: error.response?.data?.message || "Server error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box minH="100vh" bg="gray.100">
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        role={userRole}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        role={userRole}
      />
      <Box p={8} maxW="500px" mx="auto" mt="10">
        <Heading mb={6}>Ubah Password</Heading>
        <FormControl mb={4}>
          <FormLabel>Password Lama</FormLabel>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password Baru</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Konfirmasi Password Baru</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handlePasswordChange}>
          Simpan
        </Button>
      </Box>
    </Box>
  );
};

export default UbahPassword;
