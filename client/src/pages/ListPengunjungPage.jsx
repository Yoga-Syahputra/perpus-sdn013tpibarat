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
import Header from "../components/Header"; 
import { getVisitors } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ListPengunjungPage = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVisitors();
      setVisitors(data);
    };
    fetchData();
  }, []);

  const addVisitor = (newVisitor) => {
    setVisitors([...visitors, newVisitor]);
  };

  const editVisitor = (updatedVisitor) => {
    setVisitors(
      visitors.map((visitor) =>
        visitor._id === updatedVisitor._id ? updatedVisitor : visitor
      )
    );
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
          new Date(visitor.tanggalKehadiran).toLocaleDateString("id-ID"),
          visitor.keterangan,
          "", // Tanda tangan akan ditambahkan sebagai gambar
        ];

        tableRows.push(visitorData);
      });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      didDrawCell: (data) => {
        if (data.column.index === 4 && visitors[data.row.index].tandaTangan) {
          // Mengatur ukuran gambar tanda tangan agar lebih kecil
          const imgWidth = 5; // Lebar gambar
          const imgHeight = 5; // Tinggi gambar
          const padding = 3; // Jarak antara gambar dan batas sel

          // Menambahkan gambar tanda tangan dengan ukuran yang lebih kecil
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
        ).toLocaleDateString("id-ID"),
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
    <Flex>
      <Sidebar />
      <Box flex="1" ml="250px" p={4}>
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
                  <Button leftIcon={<FaCalendarAlt />} colorScheme="teal">
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
            addVisitor={addVisitor}
          />
          {selectedVisitor && (
            <EditVisitorModal
              isOpen={isEditOpen}
              onClose={onEditClose}
              visitor={selectedVisitor}
              editVisitor={editVisitor}
            />
          )}
        </Container>
      </Box>
    </Flex>
  );
};

export default ListPengunjungPage;
