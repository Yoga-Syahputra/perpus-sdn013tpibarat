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
  useToast,
} from "@chakra-ui/react";
import { editVisitor } from "../services/api";

const EditVisitorModal = ({ isOpen, onClose, visitor, editVisitor }) => {
  const [formData, setFormData] = useState(visitor);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const updatedVisitor = await editVisitor(visitor._id, formData);
      editVisitor(updatedVisitor);
      toast({
        title: "Pengunjung berhasil diupdate.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
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
          <FormControl id="nama" mb={4}>
            <FormLabel>Nama</FormLabel>
            <Input name="nama" value={formData.nama} onChange={handleChange} />
          </FormControl>
          <FormControl id="kelas" mb={4}>
            <FormLabel>Kelas</FormLabel>
            <Input
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="tanggalKehadiran" mb={4}>
            <FormLabel>Tanggal Kehadiran</FormLabel>
            <Input
              name="tanggalKehadiran"
              value={formData.tanggalKehadiran}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="jamKehadiran" mb={4}>
            <FormLabel>Jam Kehadiran</FormLabel>
            <Input
              name="jamKehadiran"
              value={formData.jamKehadiran}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="keterangan" mb={4}>
            <FormLabel>Keterangan</FormLabel>
            <Input
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditVisitorModal;
