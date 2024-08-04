import React from "react";
import {
  Box,
  Text,
  Heading,
  Button,
  useToast,
  Flex,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Image,
} from "@chakra-ui/react";
import { deleteVisitor } from "../services/api";

const CardPengunjung = ({ visitor, onEditClick }) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteVisitor(visitor._id);
      toast({
        title: "Pengunjung berhasil dihapus.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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

  // Format the date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-CA", options);
  };

  return (
    <Tr>
      <Td>{visitor.nama}</Td>
      <Td>{visitor.kelas}</Td>
      <Td>{formatDate(visitor.tanggalKehadiran)}</Td>
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
          <Button colorScheme="red" onClick={handleDelete}>
            Hapus
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};

export default CardPengunjung;
