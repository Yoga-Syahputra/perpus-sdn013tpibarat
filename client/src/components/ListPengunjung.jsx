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
            <Th>Nama</Th>
            <Th>Kelas</Th>
            <Th>Tanggal Kehadiran</Th>
            <Th>Keterangan</Th>
            <Th>Tanda Tangan</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredVisitors.map((visitor) => (
            <CardPengunjung
              key={visitor._id}
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
