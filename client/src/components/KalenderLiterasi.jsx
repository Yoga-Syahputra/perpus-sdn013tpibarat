import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const KalenderLiterasi = ({ isOpen, onClose, events }) => {
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const modalBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "black");

  useEffect(() => {
    const now = new Date();
    const ongoing = events.filter(
      (event) => new Date(event.start) <= now && new Date(event.end) >= now
    );
    setOngoingEvents(ongoing);
  }, [events]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader>Jadwal Literasi</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {ongoingEvents.map((event) => (
            <Text key={event.id} color={textColor}>
              {event.title}
            </Text>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default KalenderLiterasi;
