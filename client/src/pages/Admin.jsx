import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Icon,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Statistics from "../components/Statistics";
import KalenderLiterasi from "../components/KalenderLiterasi";
import { getVisitors } from "../services/api";

const Admin = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [visitors, setVisitors] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userRole = localStorage.getItem("role");

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
    if (ongoing.length > 0) {
      setIsModalOpen(true);
    }
  }, [events]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Flex direction="column" h="100vh">
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        role={userRole}
      />
      <Flex flex="1">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          role={userRole}
        />
        <Box
          ml={{ base: 0, md: isSidebarOpen ? "250px" : 0 }}
          w="full"
          p={4}
          transition="margin-left 0.5s"
        >
          <Breadcrumb
            fontWeight="medium"
            fontSize="lg"
            separator={
              <BreadcrumbSeparator>
                <ChevronRightIcon />
              </BreadcrumbSeparator>
            }
            spacing="8px"
            color="gray.600"
            mb={4}
          >
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="/admin">
                <Icon as={FaHome} mr={2} />
                Dasbor
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Statistik</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Container maxW="container.xl" py={10}>
            <Statistics visitors={visitors} />
          </Container>
        </Box>
      </Flex>
      <KalenderLiterasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        events={events}
      />
    </Flex>
  );
};

export default Admin;
