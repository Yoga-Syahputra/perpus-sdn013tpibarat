import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Image,
} from "@chakra-ui/react";
import { editVisitor as updateVisitor } from "../services/api"; 

const EditVisitorModal = ({ isOpen, onClose, visitor, EditVisitor }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Initialize form data with visitor details
  const [formData, setFormData] = useState({
    ...visitor,
    tanggalKehadiran: formatDate(visitor.tanggalKehadiran),
  });

  const toast = useToast();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async () => {
   try {
     const updatedVisitor = await updateVisitor(visitor._id, formData);
     EditVisitor(updatedVisitor); 
     toast({
       title: "Pengunjung berhasil diupdate.",
       status: "success",
       duration: 3000,
       isClosable: true,
     });
     onClose(); 
   } catch (error) {
     console.error("Update visitor error:", error);
     toast({
       title: "Gagal mengupdate pengunjung.",
       status: "error",
       duration: 3000,
       isClosable: true,
     });
   }
 };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Pengunjung</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="tanggalKehadiran" mb={4}>
            <FormLabel>Tanggal Kehadiran</FormLabel>
            <Input
              type="date"
              name="tanggalKehadiran"
              value={formData.tanggalKehadiran}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="jamKehadiran" mb={4}>
            <FormLabel>Jam Kehadiran</FormLabel>
            <Input
              type="time"
              name="jamKehadiran"
              value={formData.jamKehadiran}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="nama" mb={4}>
            <FormLabel>Nama</FormLabel>
            <Input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="kelas" isRequired>
            <FormLabel>Kelas</FormLabel>
            <Select
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
            >
              <option value="">Pilih</option>
              <option value="1A">1A</option>
              <option value="1B">1B</option>
              <option value="2A">2A</option>
              <option value="2B">2B</option>
              <option value="3A">3A</option>
              <option value="3B">3B</option>
              <option value="4A">4A</option>
              <option value="4B">4B</option>
              <option value="5A">5A</option>
              <option value="5B">5B</option>
              <option value="6">6</option>
            </Select>
          </FormControl>
          <FormControl id="keterangan" mb={4}>
            <FormLabel>Keterangan</FormLabel>
            <Input
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="tandaTangan" mb={4}>
            <FormLabel>Tanda Tangan</FormLabel>
            <Image
              src={visitor.tandaTangan}
              alt="Tanda Tangan"
              borderRadius="md"
              boxSize="100px"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Simpan
          </Button>
          <Button onClick={onClose}>Batal</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditVisitorModal;
