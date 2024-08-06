import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Statistics from "../components/Statistics";
import { getVisitors } from "../services/api";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Admin = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [visitors, setVisitors] = useState([]);
  const [events, setEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVisitors();
      setVisitors(data);
    };
    fetchData();

    const eventsFromStorage = localStorage.getItem("events");
    if (eventsFromStorage) {
      setEvents(JSON.parse(eventsFromStorage));
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const ongoing = events.filter(
      (event) => new Date(event.start) <= now && new Date(event.end) >= now
    );
    setOngoingEvents(ongoing);
    if (ongoing.length > 0) {
      setIsModalOpen(true);
    }
  }, [events]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Flex direction="column" h="100vh">
      <Navbar toggleSidebar={toggleSidebar} />
      <Flex flex="1">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          ml={{ base: 0, md: isSidebarOpen ? "250px" : 0 }}
          w="full"
          p={4}
          transition="margin-left 0.5s"
        >
          <Container maxW="container.xl" py={10}>
            <Statistics visitors={visitors} />
          </Container>
        </Box>
      </Flex>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Jadwal Literasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {ongoingEvents.map((event) => (
              <Text key={event.id}>{event.title}</Text>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Admin;
