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
    <Flex direction="column" h="100vh" bg="gray.50">
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        role={userRole}
      />
      <Flex flex="1">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          role={userRole}
        />
        <Box
          ml={{ base: 0, md: isSidebarOpen ? "250px" : 0 }}
          w="full"
          p={6}
          transition="margin-left 0.3s ease"
        >
          <Breadcrumb
            fontWeight="medium"
            fontSize="lg"
            separator={<ChevronRightIcon />}
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
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="/change-password">
                Ubah Password
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box
            maxW="500px"
            mx="auto"
            p={8}
            boxShadow="xl"
            borderRadius="lg"
            bg="white"
          >
            <Heading mb={6} fontSize="2xl" textAlign="center">
              Ubah Password
            </Heading>
            <FormControl mb={4}>
              <FormLabel>Password Lama</FormLabel>
              <InputGroup>
                <Input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  focusBorderColor="blue.500"
                />
                <InputRightElement>
                  <IconButton
                    icon={showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    variant="ghost"
                    size="sm"
                    aria-label={
                      showOldPassword ? "Hide password" : "Show password"
                    }
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
                  placeholder="Masukkan password baru"
                  focusBorderColor="blue.500"
                />
                <InputRightElement>
                  <IconButton
                    icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    variant="ghost"
                    size="sm"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl mb={6}>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi password baru"
                  focusBorderColor="blue.500"
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

            <Button
              colorScheme="blue"
              width="full"
              onClick={handlePasswordChange}
              _hover={{ bg: "blue.600" }}
              transition="background-color 0.3s"
            >
              Simpan
            </Button>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default UbahPassword;
