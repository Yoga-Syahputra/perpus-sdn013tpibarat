import React, { useState, useRef } from "react";
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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import SignatureCanvas from "react-signature-canvas";
import { addVisitor } from "../services/api";

const AddVisitorModal = ({ isOpen, onClose, addVisitor }) => {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [tanggalKehadiran, setTanggalKehadiran] = useState("");
  const [jamKehadiran, setJamKehadiran] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const sigCanvas = useRef({});
  const toast = useToast();

  const handleSubmit = async () => {
    const newVisitor = {
      nama,
      kelas,
      tanggalKehadiran,
      jamKehadiran,
      keterangan,
      tandaTangan: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
    };

    try {
      const addedVisitor = await addVisitor(newVisitor);
      addVisitor(addedVisitor);
      toast({
        title: "Pengunjung berhasil ditambahkan!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("There was an error adding the visitor!", error);
      toast({
        title: "Gagal menambahkan pengunjung.",
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
        <ModalHeader>Tambah Pengunjung</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="nama" isRequired>
            <FormLabel>Nama</FormLabel>
            <Input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </FormControl>
          <FormControl id="kelas" isRequired>
            <FormLabel>Kelas</FormLabel>
            <Select value={kelas} onChange={(e) => setKelas(e.target.value)}>
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
              <option value="6A">6A</option>
              <option value="6B">6B</option>
            </Select>
          </FormControl>
          <FormControl id="tanggalKehadiran" isRequired>
            <FormLabel>Tanggal Kehadiran</FormLabel>
            <Input
              type="date"
              value={tanggalKehadiran}
              onChange={(e) => setTanggalKehadiran(e.target.value)}
            />
          </FormControl>
          <FormControl id="jamKehadiran" isRequired>
            <FormLabel>Jam Kehadiran</FormLabel>
            <Input
              type="time"
              value={jamKehadiran}
              onChange={(e) => setJamKehadiran(e.target.value)}
            />
          </FormControl>
          <FormControl id="keterangan">
            <FormLabel>Keterangan</FormLabel>
            <Textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </FormControl>
          <FormControl id="tandaTangan">
            <FormLabel>Tanda Tangan</FormLabel>
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{ className: "border rounded w-full h-36" }}
            />
            <Button
              mt={2}
              colorScheme="red"
              onClick={() => sigCanvas.current.clear()}
            >
              Hapus Tanda Tangan
            </Button>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Tambah Pengunjung
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddVisitorModal;
