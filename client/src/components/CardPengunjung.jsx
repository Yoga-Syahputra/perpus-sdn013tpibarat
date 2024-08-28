import React, { useState, useRef } from "react";
import {
  Button,
  useToast,
  Flex,
  Tr,
  Td,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { deleteVisitor } from "../services/api";

const CardPengunjung = ({ visitor, onEditClick, index }) => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();

  const onClose = () => setIsOpen(false);

  const handleDelete = async () => {
    try {
      await deleteVisitor(visitor._id);
      toast({
        title: "Pengunjung berhasil dihapus.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("There was an error deleting the visitor!", error);
      toast({
        title: "Gagal menghapus pengunjung.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-CA", options);
  };

  return (
    <>
      <Tr>
        <Td>{index + 1}</Td>
        <Td>{formatDate(visitor.tanggalKehadiran)}</Td>
        <Td>{visitor.jamKehadiran}</Td>
        <Td>{visitor.nama}</Td>
        <Td>{visitor.kelas}</Td>
        <Td>{visitor.keterangan}</Td>
        <Td>
          <Image
            src={visitor.tandaTangan}
            alt="Tanda Tangan"
            borderRadius="md"
            boxSize="100px"
          />
        </Td>
        <Td>
          <Flex>
            <Button
              colorScheme="teal"
              onClick={() => onEditClick(visitor)}
              mr={2}
            >
              Edit
            </Button>
            <Button colorScheme="red" onClick={() => setIsOpen(true)}>
              Hapus
            </Button>
          </Flex>
        </Td>
      </Tr>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Pengunjung
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus pengunjung {visitor.nama}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CardPengunjung;
