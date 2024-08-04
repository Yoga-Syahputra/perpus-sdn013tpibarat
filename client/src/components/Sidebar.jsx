import React, { useRef } from "react";
import {
  Box,
  VStack,
  Link,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { FaHome, FaListAlt, FaSignOutAlt, FaAdjust } from "react-icons/fa";

const Sidebar = () => {
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
    <Box
      w="250px"
      h="100vh"
      bg={bg}
      p={4}
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
    >
      <Flex direction="column" h="100%">
        <VStack spacing={4} align="stretch" flex="1">
          <Text fontSize="2xl" fontWeight="bold">
            Dasbor Admin
          </Text>
          <Link as={RouterLink} to="/admin" _hover={{ textDecoration: "none" }}>
            <Button
              leftIcon={<FaHome />}
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
            >
              Statistik
            </Button>
          </Link>
          <Link as={RouterLink} to="/list" _hover={{ textDecoration: "none" }}>
            <Button
              leftIcon={<FaListAlt />}
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
            >
              Daftar Pengunjung
            </Button>
          </Link>
          <Spacer />
          <Button
            leftIcon={<FaSignOutAlt />}
            colorScheme="red"
            onClick={onSignOutOpen}
          >
            Keluar
          </Button>
        </VStack>
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
      </Flex>
    </Box>
  );
};

export default Sidebar;
