import React, { useState, useEffect } from "react";
import { Box, Container, Flex, Heading, VStack } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Statistics from "../components/Statistics";
import { getVisitors } from "../services/api";

const Admin = () => {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVisitors();
      setVisitors(data);
    };
    fetchData();
  }, []);

  return (
    <Flex>
      <Sidebar />
      <Box ml="250px" w="full" p={4}>
        <Container maxW="container.xl" py={10}>
          <Statistics visitors={visitors} />
        </Container>
      </Box>
    </Flex>
  );
};

export default Admin;
