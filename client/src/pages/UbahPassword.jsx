import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  IconButton,
  InputGroup,
  InputRightElement,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { changePassword } from "../services/api";

const UbahPassword = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
   <Flex direction="column" h="100vh">
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
        <Breadcrumb
          fontWeight="medium"
          fontSize="lg"
          separator={
            <BreadcrumbSeparator>
              <ChevronRightIcon />
            </BreadcrumbSeparator>
          }
          spacing="8px"
          color="gray.600"
          mb={4}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">
              <Flex alignItems="center">
                <Icon as={FaHome} mr={2} />
                Dasbor
              </Flex>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/change-password">Ubah Password</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading mb={6}>Ubah Password</Heading>
        <FormControl mb={4}>
          <FormLabel>Password Lama</FormLabel>
          <InputGroup>
            <Input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                icon={showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowOldPassword(!showOldPassword)}
                variant="ghost"
                size="sm"
                aria-label={showOldPassword ? "Hide password" : "Show password"}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password Baru</FormLabel>
          <InputGroup>
            <Input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowNewPassword(!showNewPassword)}
                variant="ghost"
                size="sm"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Konfirmasi Password Baru</FormLabel>
          <InputGroup>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                variant="ghost"
                size="sm"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button colorScheme="blue" onClick={handlePasswordChange}>
          Simpan
        </Button>
      </Box>
    </Flex>
  );
};

export default UbahPassword;
