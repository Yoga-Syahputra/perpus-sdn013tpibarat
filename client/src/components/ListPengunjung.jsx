import React, { useEffect } from "react";
import { Table, Tbody, Th, Thead, Tr, TableContainer } from "@chakra-ui/react";
import { getVisitors } from "../services/api";
import CardPengunjung from "./CardPengunjung";

const ListPengunjung = ({
  visitors,
  setVisitors,
  onEditClick,
  selectedDate,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await getVisitors();
      setVisitors(data);
    };
    fetchData();
  }, [setVisitors]);

  const filteredVisitors = visitors.filter((visitor) => {
    const visitDate = new Date(visitor.tanggalKehadiran);
    return visitDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <TableContainer>
      <Table id="visitor-table" variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>NO.</Th> {/* Kolom Nomor Urut */}
            <Th>Tanggal Kehadiran</Th>
            <Th>Jam Kehadiran</Th>
            <Th>Nama</Th>
            <Th>Kelas</Th>
            <Th>Keterangan</Th>
            <Th>Tanda Tangan</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredVisitors.map((visitor, index) => (
            <CardPengunjung
              key={visitor._id}
              index={index}
              visitor={visitor}
              onEditClick={onEditClick}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ListPengunjung;
