import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import logo from "../assets/img/library.png";
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { adminLogin, guruLogin } from "../services/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

    useEffect(() => {
      document.title = "Login Admin";
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = { username, password };

    try {
      // Try admin login first
      const { token: adminToken } = await adminLogin(credentials);
      localStorage.setItem("token", adminToken);
      localStorage.setItem("role", "admin");

      toast({
        title: "Login berhasil!",
        description: "Anda berhasil masuk sebagai admin.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/admin");
    } catch (adminError) {
      try {
        // If admin login fails, try guru login
        const { token: guruToken } = await guruLogin(credentials);
        localStorage.setItem("token", guruToken);
        localStorage.setItem("role", "guru");

        toast({
          title: "Login berhasil!",
          description: "Anda berhasil masuk sebagai guru.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/admin");
      } catch (guruError) {
        // If both logins fail, show error
        toast({
          title: "Login gagal.",
          description: "Username atau password salah.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1018%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(55%2c 81%2c 126%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c501.271C95.306%2c505.041%2c193.558%2c476.244%2c266.785%2c415.126C336.535%2c356.909%2c369.561%2c266.201%2c388.182%2c177.277C404.284%2c100.384%2c366.901%2c26.095%2c364.694%2c-52.435C362.096%2c-144.899%2c432.769%2c-252.646%2c374.093%2c-324.154C315.844%2c-395.141%2c195.54%2c-340.013%2c107.449%2c-365.936C19.278%2c-391.882%2c-49.008%2c-491.028%2c-139.563%2c-475.307C-229.731%2c-459.653%2c-280.244%2c-363.463%2c-333.89%2c-289.318C-383.572%2c-220.653%2c-433.342%2c-147.593%2c-437.909%2c-62.962C-442.312%2c18.632%2c-388.872%2c87.854%2c-358.332%2c163.645C-326.09%2c243.659%2c-316.343%2c335.384%2c-253.557%2c394.542C-185.435%2c458.728%2c-93.524%2c497.571%2c0%2c501.271' fill='%232e446a'%3e%3c/path%3e%3cpath d='M1440 1230.289C1569.933 1251.2640000000001 1726.714 1243.021 1818.05 1148.257 1910.09 1052.763 1834.145 885.803 1888.59 764.864 1942.545 645.014 2138.268 592.154 2127.364 461.172 2116.667 332.682 1942.972 292.036 1842.5 211.23200000000003 1761.57 146.14499999999998 1687.563 79.52199999999999 1594.785 32.85000000000002 1483.889-22.936000000000035 1368.586-123.77099999999996 1250.088-86.78200000000004 1131.342-49.71500000000003 1092.153 98.14600000000002 1033.745 207.978 986.669 296.502 959.836 389.68100000000004 944.0550000000001 488.694 928.0409999999999 589.169 908.229 691.525 941.3430000000001 787.729 976.221 889.057 1052.867 966.5419999999999 1133.017 1037.675 1225.2359999999999 1119.52 1318.276 1210.6399999999999 1440 1230.289' fill='%23405e92'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1018'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Flex minH="100vh" align="center" justify="center" py={4} px={4}>
        <Container maxW="lg" maxHeight="100vh" overflowY="auto">
          <Flex justifyContent="flex-start" mb={4}>
            <Button
              as={Link}
              to="/"
              colorScheme="green"
              mb={4}
              leftIcon={<ArrowBackIcon />}
            >
              Kembali ke Beranda
            </Button>
          </Flex>
          <Box bg="white" p={6} rounded="lg" shadow="lg" w="full" maxW="md">
            <Flex justifyContent="center" mb={6}>
              <Link to="/">
                <img src={logo} alt="Library Logo" className="w-32 h-32" />
              </Link>
            </Flex>
            <Heading
              as="h1"
              size="lg"
              textAlign="center"
              mb={4}
              color="gray.800"
            >
              Login Admin
            </Heading>
            <p className="text-center text-gray-600 mb={8} font-medium">
              Masuk sebagai admin
            </p>
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={3} align="stretch">
                <FormControl id="username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda"
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">
                  Login
                </Button>
              </VStack>
            </Box>
          </Box>
        </Container>
      </Flex>
    </Box>
  );
};

export default AdminLogin;
