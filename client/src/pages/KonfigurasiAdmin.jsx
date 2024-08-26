import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  addGuru,
  getGurus,
  deleteGuru,
  changePasswordGuru,
} from "../services/api";

const KonfigurasiAdmin = () => {
  const [gurus, setGurus] = useState([]);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const toast = useToast();

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchGurus();
  }, []);

  const fetchGurus = async () => {
    try {
      const response = await getGurus();
      setGurus(response);
      setTempPassword(""); 
    } catch (error) {
      console.error("Error fetching gurus", error);
      setGurus([]);
    }
  };

  const handleAddGuru = async () => {
    try {
      await addGuru({
        nama: newName,
        username: newUsername,
        password: newPassword,
      });
      setTempPassword(newPassword); 
      fetchGurus();
      setNewName("");
      setNewUsername("");
      setNewPassword("");
      toast({
        title: "Admin ditambahkan",
        description: "Admin baru berhasil ditambahkan.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding guru", error);
      toast({
        title: "Gagal menambahkan admin",
        description: "Tidak bisa menambah admin baru. Coba lagi nanti.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteGuru = async (id) => {
    try {
      await deleteGuru(id);
      fetchGurus();
      toast({
        title: "Admin dihapus",
        description: "Admin berhasil dihapus.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting guru", error);
      toast({
        title: "Gagal menghapus admin",
        description: "Tidak bisa menghapus admin. Coba lagi nanti.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChangePassword = async (id) => {
    try {
      await changePasswordGuru(id, newPassword);
      setPasswordModalOpen(false);
      setNewPassword("");
      toast({
        title: "Password diperbarui",
        description: "Password berhasil diperbarui.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating password", error);
      toast({
        title: "Gagal memperbarui password",
        description: "Tidak bisa memperbarui password. Coba lagi nanti.",
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
      <Flex flex="1">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          role={userRole}
        />
        <Box flex="1" ml={{ base: 0, md: isSidebarOpen ? "250px" : "0" }} p={4}>
          <Container maxW="container.xl" py={10}>
            <Flex justifyContent="space-between" mb={4}>
              <Heading as="h1" size="xl">
                Konfigurasi Admin
              </Heading>
            </Flex>
            <Box
              bg="white"
              p={4}
              rounded="lg"
              shadow="md"
              overflowY="auto"
              maxHeight="600px"
            >
              <VStack spacing={4} mb={4}>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama Guru (Admin Baru)"
                />
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Username Guru (Admin Baru)"
                />
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password Guru (Admin Baru)"
                  type="password"
                />
                <Button onClick={handleAddGuru} colorScheme="blue">
                  Tambah Admin
                </Button>
              </VStack>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Nama Guru (Admin)</Th>
                    <Th>Username</Th>
                    <Th>Password</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {gurus.length > 0 ? (
                    gurus.map((guru) => (
                      <Tr key={guru._id}>
                        <Td>{guru.nama}</Td>
                        <Td>{guru.username}</Td>
                        <Td>
                          {tempPassword && guru.username === newUsername
                            ? tempPassword
                            : "******"}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                setSelectedGuru(guru);
                                onOpen();
                              }}
                            >
                              Hapus
                            </Button>
                            <Button
                              colorScheme="blue"
                              onClick={() => {
                                setSelectedGuru(guru);
                                setPasswordModalOpen(true);
                              }}
                            >
                              Ubah Password
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan="4">Tidak ada data guru.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </Container>
        </Box>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Admin
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus admin{" "}
              {selectedGuru && selectedGuru.username}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDeleteGuru(selectedGuru._id);
                  onClose();
                }}
                ml={3}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isPasswordModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setPasswordModalOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Ubah Password
            </AlertDialogHeader>
            <AlertDialogBody>
              <Input
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setPasswordModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                colorScheme="green"
                onClick={() => handleChangePassword(selectedGuru._id)}
                ml={3}
              >
                Ubah Password
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default KonfigurasiAdmin;
