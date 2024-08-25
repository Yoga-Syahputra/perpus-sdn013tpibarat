import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  VStack,
  Flex,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Text,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { FaUsers, FaTrophy } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = ({ visitors }) => {
  const localizer = momentLocalizer(moment);

  const loadEvents = () => {
    const eventsFromStorage = localStorage.getItem("events");
    return eventsFromStorage ? JSON.parse(eventsFromStorage) : [];
  };

  const saveEvents = (events) => {
    localStorage.setItem("events", JSON.stringify(events));
  };

  const [events, setEvents] = useState(loadEvents);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const handleSelectSlot = ({ start, end }) => {
    setCurrentEvent({ start, end });
    setModalIsOpen(true);
  };

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setModalIsOpen(true);
  };

  const handleSaveEvent = () => {
    setEvents((prevEvents) => {
      if (currentEvent.id !== undefined) {
        return prevEvents.map((evt) =>
          evt.id === currentEvent.id ? currentEvent : evt
        );
      }
      return [...prevEvents, { ...currentEvent, id: prevEvents.length }];
    });
    setModalIsOpen(false);
  };

  const handleDeleteEvent = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((evt) => evt.id !== currentEvent.id)
    );
    setModalIsOpen(false);
  };

  const handleChange = (field, value) => {
    setCurrentEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
  };

  const uniqueVisitors = useMemo(() => {
    const visitorMap = new Map();
    visitors.forEach((visitor) => {
      const normalizedNama = visitor.nama.toLowerCase();
      const key = `${normalizedNama}-${visitor.kelas}`;

      if (!visitorMap.has(key)) {
        visitorMap.set(key, {
          ...visitor,
          nama: normalizedNama,
          visitCount: 1,
        });
      } else {
        visitorMap.get(key).visitCount += 1;
      }
    });
    return Array.from(visitorMap.values());
  }, [visitors]);

  const totalVisitors = uniqueVisitors.length;

  const classStats = useMemo(
    () =>
      uniqueVisitors.reduce((acc, visitor) => {
        acc[visitor.kelas] = (acc[visitor.kelas] || 0) + 1;
        return acc;
      }, {}),
    [uniqueVisitors]
  );

  const topVisitors = uniqueVisitors
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 5);

  const data = {
    labels: Object.keys(classStats),
    datasets: [
      {
        label: "Jumlah Pengunjung",
        data: Object.values(classStats),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pengunjung Berdasarkan Kelas",
      },
    },
  };

  return (
    <Box mb={8}>
      <VStack spacing={5} align="stretch">
        <Heading as="h2" size="lg" mb={5} textAlign="center">
          Statistik Pengunjung Perpustakaan
        </Heading>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={5} w="full">
          <Stat>
            <Flex alignItems="center">
              <Icon as={FaUsers} boxSize={6} mr={2} color="teal.500" />
              <StatLabel>Total Pengunjung</StatLabel>
            </Flex>
            <StatNumber>{totalVisitors}</StatNumber>
            <StatHelpText>Total pengunjung perpustakaan</StatHelpText>
          </Stat>
        </SimpleGrid>
        <Box
          w="full"
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          shadow="md"
        >
          <Bar data={data} options={options} />
        </Box>
        <Box
          w="full"
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          shadow="md"
        >
          <Heading as="h3" size="md" mb={3}>
           Lima Pengunjung Teratas
          </Heading>
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={5}>
            {topVisitors.map((visitor, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                bg="gray.50"
                shadow="md"
              >
                <HStack>
                  <Avatar
                    size="md"
                    name={visitor.nama}
                    bg="teal.500"
                    color="white"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{visitor.nama}</Text>
                    <Text>Kelas: {visitor.kelas}</Text>
                    <Text>Jumlah Kunjungan: {visitor.visitCount}</Text>
                  </VStack>
                  <Icon as={FaTrophy} boxSize={6} color="yellow.500" ml="auto"/>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        <Box
          w="full"
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          shadow="md"
        >
          <Heading as="h3" size="md" mb={3}>
            Kalender Literasi
          </Heading>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={["month", "agenda"]}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        </Box>
      </VStack>
      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentEvent?.id !== undefined ? "Edit Acara" : "Tambah Acara"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Judul Acara</FormLabel>
              <Input
                value={currentEvent?.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Tanggal Mulai</FormLabel>
              <DatePicker
                selected={currentEvent?.start}
                onChange={(date) => handleChange("start", date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Tanggal Selesai</FormLabel>
              <DatePicker
                selected={currentEvent?.end}
                onChange={(date) => handleChange("end", date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {currentEvent?.id !== undefined && (
              <Button colorScheme="red" mr={3} onClick={handleDeleteEvent}>
                Hapus
              </Button>
            )}
            <Button colorScheme="blue" onClick={handleSaveEvent}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Statistics;
