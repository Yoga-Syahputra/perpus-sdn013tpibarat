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
} from "@chakra-ui/react";
import { FaFilePdf, FaFileExcel, FaCalendarAlt } from "react-icons/fa";
import ListPengunjung from "../components/ListPengunjung";
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
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
      .forEach((visitor) => {
        const visitorData = [
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
      "Daftar Presensi Kunjungan Perpustakaan",
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
        if (data.column.index === 5 && visitors[data.row.index].tandaTangan) {
          const imgWidth = 5;
          const imgHeight = 5;
          const padding = 3;

          doc.addImage(
            visitors[data.row.index].tandaTangan,
            "JPEG",
            data.cell.x + padding,
            data.cell.y + padding,
            imgWidth,
            imgHeight
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
      doc.internal.pageSize.getHeight() - 20,
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
      .map((visitor) => ({
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
      <Navbar toggleSidebar={toggleSidebar} />
      <Flex flex="1">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box flex="1" ml={{ base: 0, md: isSidebarOpen ? "250px" : "0" }} p={4}>
          <Container maxW="container.xl" py={10}>
            <Flex justifyContent="space-between" mb={4}>
              <Heading as="h1" size="xl">
                Daftar Pengunjung
              </Heading>
              <HStack spacing={2}>
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
                setVisitors={setVisitors}
                onEditClick={handleEditClick}
                selectedDate={selectedDate}
                onDelete={handleDeleteVisitor}
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
                editVisitor={handleEditVisitor}
              />
            )}
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DaftarPengunjung;
