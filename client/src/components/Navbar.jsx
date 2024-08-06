import React, { useState, useEffect } from "react";
import {
  IconButton,
  Flex,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
} from "@chakra-ui/react";
import { FaBars, FaUserCircle, FaBell } from "react-icons/fa";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [events, setEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
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
  }, [events]);

  return (
    <>
      <Flex
        as="nav"
        bg="gray.800"
        px="4"
        py="4"
        justifyContent="space-between"
        alignItems="center"
        ml={isSidebarOpen ? "250px" : "0"} 
        transition="margin-left 0.3s ease-in-out"
        position="fixed"
        top="0"
        width="100%"
        zIndex="1000" 
        height="50px"
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
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaBell />}
              variant="unstyled"
              aria-label="Notifications"
              color="white"
              _hover={{ bg: "transparent" }} // Ensure no hover effect
            >
              {ongoingEvents.length > 0 && (
                <Badge colorScheme="red" borderRadius="full" ml="-2" mt="-2">
                  {ongoingEvents.length}
                </Badge>
              )}
            </MenuButton>
            <MenuList bg="gray.700" color="white" borderColor="gray.600">
              {ongoingEvents.length === 0 ? (
                <MenuItem bg="gray.700" _hover={{ bg: "gray.600" }}>
                  Tidak ada acara yang sedang berlangsung
                </MenuItem>
              ) : (
                ongoingEvents.map((event) => (
                  <MenuItem
                    key={event.id}
                    bg="gray.700"
                    _hover={{ bg: "gray.600" }}
                  >
                    {event.title}
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>
          <FaUserCircle size="32" ml="4" />
          <Box ml="3" textAlign="center">
            <Text fontSize="md">Halo</Text>
            <Text fontWeight="bold">Admin</Text>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Navbar;
