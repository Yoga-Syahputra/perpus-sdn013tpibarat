import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Text,
  Box,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import member1 from "../assets/img/fiqri-raekhal.png";
import member2 from "../assets/img/yoga-syahputra.png";

const Footer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState({});
  const members = [
    {
      image: member1,
      name: "Mohd. Fiqri Raekhal (2101020097)",
    },
    {
      image: member2,
      name: "Yoga Syahputra (2101020105)",
    },
  ];
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const handleLinkClick = (e) => {
    e.preventDefault();
    setContent(members[currentMemberIndex]);
    onOpen();
  };

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentMemberIndex((prevIndex) =>
          prevIndex === members.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isOpen, members.length]);

  useEffect(() => {
    if (isOpen) {
      setContent(members[currentMemberIndex]);
    }
  }, [currentMemberIndex, isOpen, members]);

  return (
    <footer
      className="text-white text-center p-4 fixed bottom-0 w-full"
      style={{
        zIndex: 1000,
        textShadow:
          "2px 2px 4px rgba(0, 0, 0, 0.3), 4px 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <style jsx>{`
        .glowing-red:hover {
          text-shadow: 0 0 8px red;
        }

        .glowing-orange:hover {
          text-shadow: 0 0 8px orange;
        }
      `}</style>
      &copy; {new Date().getFullYear()}{" "}
      <a
        href="/#"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-blue-600 glowing-red"
      >
        SMP Negeri 2 Bintan
      </a>
      . Developed by{" "}
      <a
        href="/#"
        onClick={handleLinkClick}
        className="font-bold text-blue-600 glowing-orange"
      >
        TIM KP TI - FTTK UMRAH
      </a>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
            TIM KAMI!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={content.image}
                alt={content.name}
                width="100%"
                height="25rem"
                borderRadius="5px"
              />
              <Text
                className="font-bold text-blue-600"
                fontWeight="bold"
                fontSize="xl"
                mt={4}
                textAlign={"center"}
              >
                {content.name}
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </footer>
  );
};

export default Footer;
