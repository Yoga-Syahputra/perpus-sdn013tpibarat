import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Flex direction="column" h="100vh">
      <Navbar toggleSidebar={toggleSidebar} />
      <Flex flex="1">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box flex="1" ml={{ base: 0, md: isSidebarOpen ? "250px" : "0" }} p={4}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
