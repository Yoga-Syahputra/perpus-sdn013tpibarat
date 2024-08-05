import React, { useState, useEffect } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Statistics from "../components/Statistics";
import { getVisitors } from "../services/api";

const Admin = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVisitors();
      setVisitors(data);
    };
    fetchData();
  }, []);

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
    </Flex>
  );
};

export default Admin;
