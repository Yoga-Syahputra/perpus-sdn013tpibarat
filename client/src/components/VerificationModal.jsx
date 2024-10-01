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
  Tooltip,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { InfoIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { adminLogin, guruLogin } from "../services/api"; 
import ReCAPTCHA from "react-google-recaptcha";

const VerificationModal = ({ isOpen, onVerified, userType }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const toast = useToast();

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleLogin = async () => {
    if (!captchaValue) {
      toast({
        title: "Verifikasi gagal.",
        description: "Harap selesaikan CAPTCHA.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      if (userType === "admin") {
        await adminLogin({ username, password });
      } else if (userType === "guru") {
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
        <ModalHeader textAlign="center" position="relative">
          Silakan Verifikasi Terlebih Dahulu!
          <Tooltip
            label="Verifikasi diperlukan untuk mencegah akses dari pihak yang tidak bertanggungjawab dan meminimalisir kejahatan cyber."
            fontSize="sm"
            placement="top"
          >
            <IconButton
              aria-label="Informasi verifikasi"
              icon={<InfoIcon />}
              variant="ghost"
              size="sm"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              right="10px"
            />
          </Tooltip>
        </ModalHeader>
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
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="captcha" mb={4}>
            <ReCAPTCHA
              sitekey="6Ld18y8qAAAAAP_3XVE3-ckUGIhhaVDEk7C3ylTd"
              onChange={handleCaptchaChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleLogin}
            isLoading={loading}
          >
            Verifikasi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerificationModal;
