import React from "react";
import { Box, IconButton, Heading, Flex } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  return (
    <Flex
      as="nav"
      bg="gray.800"
      px="4"
      py="4"
      justifyContent="space-between"
      alignItems="center"
    >
      <IconButton
        icon={<FaBars />}
        variant="outline"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        color="white"
      />
      <Heading as="h1" size="lg" color="white">
        Dasbor Admin
      </Heading>
    </Flex>
  );
};

export default Navbar;
