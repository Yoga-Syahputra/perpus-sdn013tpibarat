import React, { useState, useEffect, useRef } from "react";
import {
  Flex,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Box,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
} from "@chakra-ui/react";
import {
  FaBars,
  FaUserCircle,
  FaExpand,
  FaCompress,
  FaBell,
} from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, isSidebarOpen, role }) => {
  const [events, setEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();

 const handleSignOut = () => {
   if (document.fullscreenElement) {
     document.exitFullscreen();
     setIsFullScreen(false);
   }

   localStorage.removeItem("token");
   localStorage.removeItem("role");

   onClose();
   navigate("/admin-login");
 };


  const handlePasswordChange = () => {
    navigate("/change-password");
  };

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

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1.5rem"
      bg="gray.800"
      color="white"
      position="sticky"
      top="0"
      zIndex={1000}
    >
      <Flex align="center">
        <IconButton
          icon={<FaBars />}
          variant="outline"
          color="white"
          aria-label="Toggle Sidebar"
          onClick={toggleSidebar}
          mr={2}
        />
        <Text
          fontSize="2xl"
          fontWeight="bold"
          ml={isSidebarOpen ? "200px" : "0"}
          transition="margin-left 0.3s"
          cursor="pointer"
          onClick={() => navigate("/admin")}
        >
          Dasbor DIGI-PenPus
        </Text>
      </Flex>
      <Flex align="center">
        <IconButton
          icon={isFullScreen ? <FaCompress /> : <FaExpand />}
          variant="outline"
          color="white"
          aria-label="Toggle Fullscreen Mode"
          onClick={handleToggleFullScreen}
          mr={4}
        />
        <Menu>
          <MenuButton
            as={Box}
            position="relative"
            aria-label="Notifications"
            cursor="pointer"
            mr={4}
          >
            <FaBell size="24" />
            {ongoingEvents.length > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-1"
                right="-1"
                fontSize="0.8em"
                px={2}
              >
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
        <Menu>
          <MenuButton as={Box} ml="4" cursor="pointer">
            <HStack>
              <FaUserCircle size="32" />
              <ChevronDownIcon boxSize={5} /> 
            </HStack>
          </MenuButton>
          <MenuList bg="gray.700" color="white" borderColor="gray.600">
            {role === "admin" && (
              <MenuItem
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
                onClick={handlePasswordChange}
              >
                Ubah Password
              </MenuItem>
            )}
            <MenuItem
              bg="gray.700"
              _hover={{ bg: "gray.600" }}
              onClick={onOpen}
            >
              Keluar
            </MenuItem>
          </MenuList>
        </Menu>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Konfirmasi Keluar
              </AlertDialogHeader>
              <AlertDialogBody>Ingin keluar?</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Batal
                </Button>
                <Button colorScheme="red" onClick={handleSignOut} ml={3}>
                  Keluar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Box ml="3" textAlign="center">
          <Text fontSize="md">Halo</Text>
          <Text fontWeight="bold">{role === "admin" ? "Admin" : "Guru"}</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
