import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  useDisclosure,
  HStack,
  VStack,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  FaFilePdf,
  FaFileExcel,
  FaCalendarAlt,
  FaSearch,
  FaHome,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import AddVisitorModal from "../components/AddVisitorModal";
import EditVisitorModal from "../components/EditVisitorModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  getVisitors,
  addVisitor,
  editVisitor,
  deleteVisitor,
} from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DaftarPengunjung = () => {
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("all");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visitorToDelete, setVisitorToDelete] = useState(null);
  const toast = useToast();

  const cancelRef = React.useRef();

  const userRole = localStorage.getItem("role");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVisitors();
        setVisitors(data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddVisitor = async (newVisitor) => {
    try {
      const addedVisitor = await addVisitor(newVisitor);
      setVisitors([...visitors, addedVisitor]);
      onAddClose();
    } catch (error) {
      console.error("Error adding visitor:", error);
    }
  };

  const handleEditVisitor = async (updatedVisitor) => {
    try {
      const editedVisitor = await editVisitor(
        updatedVisitor._id,
        updatedVisitor
      );
      setVisitors(
        visitors.map((visitor) =>
          visitor._id === editedVisitor._id ? editedVisitor : visitor
        )
      );
      onEditClose();
    } catch (error) {
      console.error("Error editing visitor:", error);
    }
  };

  const handleDeleteClick = (visitor) => {
    setVisitorToDelete(visitor);
    onDeleteAlertOpen();
  };

  const handleDeleteConfirm = async () => {
    if (visitorToDelete) {
      try {
        await deleteVisitor(visitorToDelete._id);
        setVisitors(
          visitors.filter((visitor) => visitor._id !== visitorToDelete._id)
        );
        onDeleteAlertClose();

        toast({
          title: "Pengunjung dihapus.",
          description: `${visitorToDelete.nama} telah berhasil dihapus.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting visitor:", error);

        toast({
          title: "Gagal menghapus pengunjung.",
          description: "Terjadi kesalahan saat menghapus pengunjung.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleEditClick = (visitor) => {
    setSelectedVisitor(visitor);
    onEditOpen();
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "NO",
      "Nama",
      "Kelas",
      "Tanggal Kehadiran",
      "Jam Kehadiran",
      "Keterangan",
      "Tanda Tangan",
    ];
    const tableRows = [];

    visitors
      .filter(
        (visitor) =>
          new Date(visitor.tanggalKehadiran).toLocaleDateString("id-ID") ===
          selectedDate.toLocaleDateString("id-ID")
      )
      .forEach((visitor, index) => {
        const visitorData = [
          index + 1,
          visitor.nama,
          visitor.kelas,
          new Date(visitor.tanggalKehadiran).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          visitor.jamKehadiran,
          visitor.keterangan,
          "",
        ];

        tableRows.push(visitorData);
      });

    doc.text(
      "Daftar Hadir Kunjungan Perpustakaan SDN 013 Tanjungpinang Barat",
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );
    doc.setLineWidth(0.5);
    doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);
    doc.text(
      `Hari/Tanggal: ${selectedDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      15,
      30
    );

    doc.autoTable({
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      didDrawCell: (data) => {
        const tandaTangan = visitors[data.row.index].tandaTangan;
        if (data.column.index === 6 && tandaTangan) {
          doc.addImage(
            tandaTangan,
            "JPEG",
            data.cell.x + 3,
            data.cell.y + 3,
            5,
            5
          );
        }
      },
    });

    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    doc.text(
      `Tanjungpinang, ${currentDate}`,
      doc.internal.pageSize.getWidth() - 60,
      doc.internal.pageSize.getHeight() - 40,
      { align: "center" }
    );
    doc.text(
      "Tertanda,",
      doc.internal.pageSize.getWidth() - 60,
      doc.internal.pageSize.getHeight() - 35,
      { align: "center" }
    );
    doc.text(
      "Pengelola Perpustakaan",
      doc.internal.pageSize.getWidth() - 60,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save("visitors.pdf");
  };

  const handleExportExcel = () => {
    const exportData = visitors
      .filter(
        (visitor) =>
          new Date(visitor.tanggalKehadiran).toLocaleDateString("id-ID") ===
          selectedDate.toLocaleDateString("id-ID")
      )
      .map((visitor, index) => ({
        NO: index + 1,
        Nama: visitor.nama,
        Kelas: visitor.kelas,
        "Tanggal Kehadiran": new Date(
          visitor.tanggalKehadiran
        ).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        "Jam Kehadiran": visitor.jamKehadiran,
        Keterangan: visitor.keterangan,
        "Tanda Tangan": visitor.tandaTangan ? visitor.tandaTangan : "",
      }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "visitors.xlsx");
  };

  const getUniqueClasses = () => {
    const classes = visitors.map((visitor) => visitor.kelas);
    return ["all", ...new Set(classes)].filter(Boolean);
  };

  const ListPengunjung = ({
    visitors,
    onEditClick,
    onDeleteClick,
    selectedDate,
    searchTerm,
    entriesPerPage,
    currentPage,
    selectedClass,
  }) => {
    // Filter visitors based on date, search term, and class
    const filteredVisitors = visitors.filter(
      (visitor) =>
        new Date(visitor.tanggalKehadiran).toLocaleDateString("id-ID") ===
          selectedDate.toLocaleDateString("id-ID") &&
        visitor.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedClass === "all" || visitor.kelas === selectedClass)
    );

    // Calculate pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredVisitors.slice(
      indexOfFirstEntry,
      indexOfLastEntry
    );
    const totalPages = Math.ceil(filteredVisitors.length / entriesPerPage);
    return (
      <Box>
        <Flex justifyContent="space-between" mb={4}>
          <HStack>
            <Select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              width="100px"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Select>
            <Box>entries per page</Box>
          </HStack>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            width="150px"
          >
            {getUniqueClasses().map((kelas) => (
              <option key={kelas} value={kelas}>
                {kelas === "all" ? "Semua Kelas" : kelas}
              </option>
            ))}
          </Select>
        </Flex>
        <Table id="visitor-table" variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama</Th>
              <Th>Kelas</Th>
              <Th>Tanggal Kehadiran</Th>
              <Th>Jam Kehadiran</Th>
              <Th>Keterangan</Th>
              <Th>Tanda Tangan</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEntries.map((visitor, index) => (
              <Tr key={visitor._id}>
                <Td>{indexOfFirstEntry + index + 1}</Td>
                <Td>{visitor.nama}</Td>
                <Td>{visitor.kelas}</Td>
                <Td>
                  {new Date(visitor.tanggalKehadiran).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </Td>
                <Td>{visitor.jamKehadiran}</Td>
                <Td>{visitor.keterangan}</Td>
                <Td>
                  {visitor.tandaTangan ? (
                    <img
                      src={visitor.tandaTangan}
                      alt="Tanda Tangan"
                      width="50"
                    />
                  ) : (
                    "Belum Tanda Tangan"
                  )}
                </Td>
                <Td>
                  <Tooltip label="Edit Pengunjung" placement="top">
                    <IconButton
                      aria-label="Edit Visitor"
                      icon={<FaEdit />}
                      onClick={() => onEditClick(visitor)}
                      mr={2}
                    />
                  </Tooltip>
                  <Tooltip label="Hapus Pengunjung" placement="top">
                    <IconButton
                      aria-label="Delete Visitor"
                      icon={<FaTrash />}
                      onClick={() => onDeleteClick(visitor)}
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Flex justifyContent="space-between" mt={4}>
          <Box>
            Showing {indexOfFirstEntry + 1} to{" "}
            {Math.min(indexOfLastEntry, filteredVisitors.length)} of{" "}
            {filteredVisitors.length} entries
          </Box>
          <HStack>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
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
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      </Box>
    );
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
              <BreadcrumbLink href="/list">Daftar Pengunjung</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Container maxW="container.xl" py={10}>
            <Flex justifyContent="space-between" mb={4}>
              <Heading as="h1" size="xl">
                Daftar Pengunjung
              </Heading>
              <HStack spacing={2}>
                <HStack spacing={2}>
                  <InputGroup width="250px">
                    <InputLeftElement pointerEvents="none">
                      <FaSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Cari nama pengunjung..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </HStack>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  customInput={
                    <Button leftIcon={<FaCalendarAlt />} colorScheme="blue">
                      Pilih Tanggal
                    </Button>
                  }
                />
                <Button colorScheme="teal" onClick={onAddOpen}>
                  Tambah Pengunjung
                </Button>
              </HStack>
            </Flex>
            <Box
              bg="white"
              p={4}
              rounded="lg"
              shadow="md"
              overflowY="auto"
              maxHeight="600px"
            >
              <ListPengunjung
                visitors={visitors}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                selectedDate={selectedDate}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                currentPage={currentPage}
                selectedClass={selectedClass}
              />
            </Box>
            <VStack spacing={2} mt={4}>
              <Button
                leftIcon={<FaFilePdf />}
                colorScheme="red"
                onClick={handlePrint}
                width="full"
              >
                Cetak PDF
              </Button>
              <Button
                leftIcon={<FaFileExcel />}
                colorScheme="green"
                onClick={handleExportExcel}
                width="full"
              >
                Ekspor ke Excel
              </Button>
            </VStack>
            <AddVisitorModal
              isOpen={isAddOpen}
              onClose={onAddClose}
              addVisitor={handleAddVisitor}
            />
            {selectedVisitor && (
              <EditVisitorModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                visitor={selectedVisitor}
                EditVisitor={handleEditVisitor}
              />
            )}
            <AlertDialog
              isOpen={isDeleteAlertOpen}
              leastDestructiveRef={cancelRef}
              onClose={onDeleteAlertClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Konfirmasi Penghapusan
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Apakah Anda yakin ingin menghapus pengunjung{" "}
                    {visitorToDelete?.nama}?
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                      Batal
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDeleteConfirm}
                      ml={3}
                    >
                      Hapus
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DaftarPengunjung;
