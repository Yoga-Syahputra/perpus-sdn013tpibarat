import React from "react";
import { Box, Flex, Avatar, Text, Heading, Spacer } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <Box
      bg="#37517e"
      w="full"
      p={4}
      color="white"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex alignItems="center">
        <Heading as="h1" size="lg">
          Dashboard
        </Heading>
        <Spacer />
        <Flex alignItems="center">
          <Box as={FaUserCircle} size="2rem" mr={2} />
          <Box>
            <Text fontSize="md">Halo,</Text>
            <Heading as="h2" size="md">
              admin
            </Heading>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
