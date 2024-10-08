import React, { useState, useEffect } from "react";
import {
  Box,
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
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Icon,
  Tooltip,
  Card,
  CardHeader,
  CardBody,
  Select,
  Text,
} from "@chakra-ui/react";
import {
  ViewIcon,
  ViewOffIcon,
  ChevronRightIcon,
  AddIcon,
} from "@chakra-ui/icons";
import { FaHome, FaLock, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  addGuru,
  getGurus,
  deleteGuru,
  changePasswordGuru,
} from "../services/api";
import ReCAPTCHA from "react-google-recaptcha";

const KonfigurasiAdmin = () => {
  const [gurus, setGurus] = useState([]);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updatePassword, setUpdatePassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    document.title = "Konfigurasi Admin";
  }, []);

  useEffect(() => {
    fetchGurus();
  }, []);

  const fetchGurus = async () => {
    try {
      const response = await getGurus();
      setGurus(response);
    } catch (error) {
      console.error("Error fetching gurus", error);
      setGurus([]);
    }
  };

  const handleAddGuru = async () => {
    if (!newName || !newUsername || !newPassword) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon isi semua field yang diperlukan.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await addGuru({
        nama: newName,
        username: newUsername,
        password: newPassword,
      });
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
      toast({
        title: "Gagal menghapus admin",
        description: "Tidak bisa menghapus admin. Coba lagi nanti.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCaptcha = async () => {
    if (!captchaValue) {
      toast({
        title: "Ubah password gagal",
        description: "Harap selesaikan CAPTCHA.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleChangePassword = async (id) => {
    const isCaptchaVerified = await handleCaptcha();
    if (!isCaptchaVerified) return;

    if (!updatePassword) {
      toast({
        title: "Password kosong",
        description: "Mohon masukkan password baru.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await changePasswordGuru(id, updatePassword);
      setPasswordModalOpen(false);
      setUpdatePassword("");

      toast({
        title: "Password diperbarui",
        description: "Password berhasil diperbarui.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Gagal memperbarui password",
        description: "Tidak bisa memperbarui password. Coba lagi nanti.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = gurus.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(gurus.length / entriesPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Konfigurasi Admin</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <VStack spacing={6} align="stretch">
            <Box>
              <Heading as="h1" size="xl" mb={2}>
                Konfigurasi Admin
              </Heading>
              <Heading as="h2" size="sm" color="gray.500">
                Kelola guru piket sebagai admin
              </Heading>
            </Box>

            <Card>
              <CardHeader>
                <Heading size="md">Tambah Admin Baru</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <InputGroup>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nama Guru"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Username"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Password"
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddGuru}
                    colorScheme="blue"
                    width="full"
                  >
                    Tambah Admin
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="md">Daftar Admin</Heading>
              </CardHeader>
              <CardBody>
                <Flex justifyContent="space-between" mb={4}>
                  <HStack>
                    <Select
                      value={entriesPerPage}
                      onChange={(e) =>
                        setEntriesPerPage(Number(e.target.value))
                      }
                      width="100px"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </Select>
                    <Box>entries per page</Box>
                  </HStack>
                </Flex>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th width="40%">Nama Guru</Th>
                      <Th width="40%">Username</Th>
                      <Th width="20%" textAlign="center">
                        Aksi
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentEntries.length > 0 ? (
                      currentEntries.map((guru) => (
                        <Tr key={guru._id}>
                          <Td>{guru.nama}</Td>
                          <Td>{guru.username}</Td>
                          <Td textAlign="center">
                            <Tooltip label="Ubah Password" placement="top">
                              <IconButton
                                icon={<FaLock />}
                                mr={2}
                                onClick={() => {
                                  setSelectedGuru(guru);
                                  setPasswordModalOpen(true);
                                  setUpdatePassword("");
                                }}
                                aria-label="Ubah password"
                              />
                            </Tooltip>
                            <Tooltip label="Hapus Admin" placement="top">
                              <IconButton
                                icon={<FaTrash />}
                                onClick={() => {
                                  setSelectedGuru(guru);
                                  onOpen();
                                }}
                                aria-label="Hapus admin"
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan="4" textAlign="center">
                          Tidak ada data guru.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
                <Flex justifyContent="flex-end" mt={4}>
                  <HStack>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      isDisabled={currentPage === 1}
                      mr={2}
                    >
                      Previous
                    </Button>
                    <Box>
                      {currentPage} of {totalPages}
                    </Box>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      isDisabled={currentPage === totalPages}
                      ml={2}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              </CardBody>
            </Card>
          </VStack>
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
              {selectedGuru && selectedGuru.nama}?
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
              <InputGroup>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password Baru"
                  value={updatePassword}
                  onChange={(e) => setUpdatePassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    variant="ghost"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <Box mb={4}>
                <ReCAPTCHA
                  sitekey="6Ld18y8qAAAAAP_3XVE3-ckUGIhhaVDEk7C3ylTd"
                  onChange={handleCaptchaChange}
                />
              </Box>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setPasswordModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                colorScheme="blue"
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
