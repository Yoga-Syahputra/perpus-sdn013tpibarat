import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  HStack,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  FaFilePdf,
  FaFileExcel,
  FaCalendarAlt,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import ListPengunjung from "../components/ListPengunjung";
import AddVisitorModal from "../components/AddVisitorModal";
import EditVisitorModal from "../components/EditVisitorModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  getVisitors,
  addVisitor,
  editVisitor,
  deleteVisitor,
} from "../services/api";

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

  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visitorsPerPage] = useState(10); // Set number of visitors per page

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

  // Pagination Logic
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = visitors.slice(
    indexOfFirstVisitor,
    indexOfLastVisitor
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter and search functionality
  const filteredVisitors = currentVisitors.filter((visitor) =>
    visitor.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDeleteVisitor = async (id) => {
    try {
      await deleteVisitor(id);
      setVisitors(visitors.filter((visitor) => visitor._id !== id));
    } catch (error) {
      console.error("Error deleting visitor:", error);
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

  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p={4}>
          <Breadcrumb separator={<ChevronRightIcon />} spacing="8px" mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">
                <Icon as={FaHome} mr={2} />
                Dasbor
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

            {/* Table with Pagination */}
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Nama</Th>
                    <Th>Kelas</Th>
                    <Th>Tanggal Kehadiran</Th>
                    <Th>Jam Kehadiran</Th>
                    <Th>Keterangan</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredVisitors.map((visitor, index) => (
                    <Tr key={visitor._id}>
                      <Td>{index + 1 + (currentPage - 1) * visitorsPerPage}</Td>
                      <Td>{visitor.nama}</Td>
                      <Td>{visitor.kelas}</Td>
                      <Td>
                        {new Date(visitor.tanggalKehadiran).toLocaleDateString(
                          "id-ID"
                        )}
                      </Td>
                      <Td>{visitor.jamKehadiran}</Td>
                      <Td>{visitor.keterangan}</Td>
                      <Td>
                        <Button
                          colorScheme="yellow"
                          onClick={() => handleEditClick(visitor)}
                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          ml={2}
                          onClick={() => handleDeleteVisitor(visitor._id)}
                        >
                          Hapus
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <HStack mt={4} justifyContent="center">
              {Array.from({
                length: Math.ceil(visitors.length / visitorsPerPage),
              }).map((_, i) => (
                <Button key={i + 1} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </Button>
              ))}
            </HStack>

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
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DaftarPengunjung;