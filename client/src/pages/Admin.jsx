import React, { useState, useEffect } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Statistics from "../components/Statistics";
import { getVisitors } from "../services/api";

const Admin = () => {
  const [visitors, setVisitors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
    }

    const fetchData = async () => {
      const data = await getVisitors();
      setVisitors(data);
    };
    fetchData();
  }, [navigate]);

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
