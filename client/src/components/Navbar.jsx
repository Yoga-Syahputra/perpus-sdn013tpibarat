import React from "react";
import { IconButton, Flex, Box, Text } from "@chakra-ui/react";
import { FaBars, FaUserCircle } from "react-icons/fa";

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
      <Flex alignItems="center">
        <IconButton
          icon={<FaBars />}
          variant="outline"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          color="white"
          mr="4"
        />
        <Text fontSize="xl" fontWeight="bold" color="white">
          Dasbor Perpustakaan SDN 013 TPI Barat
        </Text>
      </Flex>
      <Flex alignItems="center" color="white">
        <FaUserCircle size="32" />
        <Box ml="3" textAlign="center">
          <Text fontSize="md">Halo</Text>
          <Text fontWeight="bold">Admin</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
