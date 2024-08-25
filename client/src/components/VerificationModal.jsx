import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { adminLogin, guruLogin } from "../services/api"; 

const VerificationModal = ({ isOpen, onVerified }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); 
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (role === "admin") {
        await adminLogin({ username, password });
      } else if (role === "guru") {
        await guruLogin({ username, password });
      }
      toast({
        title: "Verifikasi berhasil.",
        description: "Selamat datang :)",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onVerified(); 
    } catch (error) {
      toast({
        title: "Verifikasi gagal.",
        description: "Silakan coba lagi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Verifikasi</ModalHeader>
        <ModalBody>
          <FormControl id="username" mb={4}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="role" mb={4}>
            <FormLabel>Masuk sebagai</FormLabel>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                width: "100%",
              }}
            >
              <option value="admin">Administrator</option>
              <option value="guru">Guru</option>
            </select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleLogin}
            isLoading={loading}
          >
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerificationModal;
