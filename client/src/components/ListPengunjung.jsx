import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListPengunjung = ({
  visitors,
  onEditClick,
  onDelete,
  selectedDate,
}) => {
  return (
    <Table Table id="visitor-table" variant="simple" size="sm">
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
        {visitors
          .filter(
            (visitor) =>
              new Date(visitor.tanggalKehadiran).toLocaleDateString("id-ID") ===
              selectedDate.toLocaleDateString("id-ID")
          )
          .map((visitor, index) => (
            <Tr key={visitor._id}>
              <Td>{index + 1}</Td>
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
                <IconButton
                  aria-label="Edit Visitor"
                  icon={<FaEdit />}
                  onClick={() => onEditClick(visitor)}
                  mr={2}
                />
                <IconButton
                  aria-label="Delete Visitor"
                  icon={<FaTrash />}
                  onClick={() => onDelete(visitor._id)}
                />
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default ListPengunjung;
