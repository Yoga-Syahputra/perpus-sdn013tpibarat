import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { addVisitor, getVisitors } from "../services/api";
import SignatureCanvas from "react-signature-canvas";
import successSound from "../assets/success.mp3"; 

const FormulirPengunjung = () => {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [tanggalKehadiran, setTanggalKehadiran] = useState("");
  const [jamKehadiran, setJamKehadiran] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState("form");
  const [soundEnabled, setSoundEnabled] = useState(true); 
  const sigCanvas = useRef({});
  const toast = useToast();
  const audioRef = useRef(null); 

    useEffect(() => {
      document.title = "Formulir Pengunjung";
    }, []);

  useEffect(() => {
    loadVisitors();
    setCurrentDateTime();
  }, []);

  const loadVisitors = async () => {
    try {
      const data = await getVisitors();
      setVisitors(data);
    } catch (error) {
      console.error("There was an error fetching the visitors!", error);
    }
  };

   const setCurrentDateTime = () => {
     const now = new Date();
     const formattedDate = now.toISOString().split("T")[0]; // Format as YYYY-MM-DD
     const formattedTime = now.toTimeString().split(" ")[0]; // Format as HH:MM:SS
     setTanggalKehadiran(formattedDate);
     setJamKehadiran(formattedTime.slice(0, 5)); // Format as HH:MM
   };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVisitor = {
      nama,
      kelas,
      tanggalKehadiran,
      jamKehadiran,
      keterangan,
      tandaTangan: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
    };

    try {
      await addVisitor(newVisitor);
      toast({
        title: "Selamat datang, selamat belajar!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNama("");
      setKelas("");
      setTanggalKehadiran("");
      setJamKehadiran("");
      setKeterangan("");
      sigCanvas.current.clear();
      if (soundEnabled) {
        audioRef.current.play(); // Play the sound if enabled
      }
      await loadVisitors();
    } catch (error) {
      console.error("There was an error adding the visitor!", error);
      toast({
        title: "Gagal menambahkan pengunjung.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  return (
    <Box
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1018%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(55%2c 81%2c 126%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c501.271C95.306%2c505.041%2c193.558%2c476.244%2c266.785%2c415.126C336.535%2c356.909%2c369.561%2c266.201%2c388.182%2c177.277C404.284%2c100.384%2c366.901%2c26.095%2c364.694%2c-52.435C362.096%2c-144.899%2c432.769%2c-252.646%2c374.093%2c-324.154C315.844%2c-395.141%2c195.54%2c-340.013%2c107.449%2c-365.936C19.278%2c-391.882%2c-49.008%2c-491.028%2c-139.563%2c-475.307C-229.731%2c-459.653%2c-280.244%2c-363.463%2c-333.89%2c-289.318C-383.572%2c-220.653%2c-433.342%2c-147.593%2c-437.909%2c-62.962C-442.312%2c18.632%2c-388.872%2c87.854%2c-358.332%2c163.645C-326.09%2c243.659%2c-316.343%2c335.384%2c-253.557%2c394.542C-185.435%2c458.728%2c-93.524%2c497.571%2c0%2c501.271' fill='%232e446a'%3e%3c/path%3e%3cpath d='M1440 1230.289C1569.933 1251.2640000000001 1726.714 1243.021 1818.05 1148.257 1910.09 1052.763 1834.145 885.803 1888.59 764.864 1942.545 645.014 2138.268 592.154 2127.364 461.172 2116.667 332.682 1942.972 292.036 1842.5 211.23200000000003 1761.57 146.14499999999998 1687.563 79.52199999999999 1594.785 32.85000000000002 1483.889-22.936000000000035 1368.586-123.77099999999996 1250.088-86.78200000000004 1131.342-49.71500000000003 1092.153 98.14600000000002 1033.745 207.978 986.669 296.502 959.836 389.68100000000004 944.0550000000001 488.694 928.0409999999999 589.169 908.229 691.525 941.3430000000001 787.729 976.221 889.057 1052.867 966.5419999999999 1133.017 1037.675 1225.2359999999999 1119.52 1318.276 1210.6399999999999 1440 1230.289' fill='%23405e92'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1018'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxW="container.md" py={10}>
        <Flex justifyContent="flex-start">
          <Button
            as={Link}
            to="/"
            colorScheme="green"
            mb={4}
            leftIcon={<ArrowBackIcon />}
          >
            Kembali ke Beranda
          </Button>
        </Flex>
        <Heading
          as="h1"
          size="xl"
          textAlign="center"
          mb={6}
          color="white"
          fontWeight={"bold"}
        >
          Formulir Pengunjung
        </Heading>
        <Flex justifyContent="center" mb={6}>
          <Button
            colorScheme={activeTab === "form" ? "blue" : "gray"}
            onClick={() => setActiveTab("form")}
            mr={2}
            _hover={{ color: "white", bg: "blue.500" }}
            color="black"
            leftIcon={<EditIcon />}
          >
            Formulir
          </Button>
          <Button
            colorScheme={activeTab === "list" ? "blue" : "gray"}
            onClick={() => setActiveTab("list")}
            _hover={{ color: "white", bg: "blue.500" }}
            color="black"
            leftIcon={<ViewIcon />}
          >
            Daftar Pengunjung Hari Ini
          </Button>
        </Flex>
        {activeTab === "form" && (
          <Flex justifyContent="center">
            <Box
              as="form"
              onSubmit={handleSubmit}
              bg="white"
              p={8}
              rounded="lg"
              shadow="lg"
              w="full"
              maxW="lg"
            >
              <VStack spacing={4} align="stretch">
                <FormControl id="tanggalKehadiran" isRequired>
                  <FormLabel>Tanggal Kehadiran</FormLabel>
                  <Input
                    type="date"
                    value={tanggalKehadiran}
                    onChange={(e) => setTanggalKehadiran(e.target.value)}
                  />
                </FormControl>
                <FormControl id="jamKehadiran" isRequired>
                  <FormLabel>Jam Kehadiran</FormLabel>
                  <Input
                    type="time"
                    value={jamKehadiran}
                    onChange={(e) => setJamKehadiran(e.target.value)}
                  />
                </FormControl>
                <FormControl id="nama" isRequired>
                  <FormLabel>Nama</FormLabel>
                  <Input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </FormControl>
                <FormControl id="kelas" isRequired>
                  <FormLabel>Kelas</FormLabel>
                  <Select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                  >
                    <option value="">Pilih</option>
                    <option value="1A">1A</option>
                    <option value="1B">1B</option>
                    <option value="2A">2A</option>
                    <option value="2B">2B</option>
                    <option value="3A">3A</option>
                    <option value="3B">3B</option>
                    <option value="4A">4A</option>
                    <option value="4B">4B</option>
                    <option value="5A">5A</option>
                    <option value="5B">5B</option>
                    <option value="6">6</option>
                  </Select>
                </FormControl>
                <FormControl id="keterangan" isRequired>
                  <FormLabel>Keterangan</FormLabel>
                  <Textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </FormControl>
                <FormControl id="tandaTangan" isRequired>
                  <FormLabel>Tanda Tangan</FormLabel>
                  <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{ className: "border rounded w-full h-36" }}
                  />
                  <Button mt={2} colorScheme="red" onClick={clearSignature}>
                    Hapus Tanda Tangan
                  </Button>
                </FormControl>
                <Button colorScheme="green" type="submit" w="full" mt={4}>
                  Tambah Pengunjung
                </Button>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="sound-toggle" mb="0">
                    Aktifkan Suara Notifikasi
                  </FormLabel>
                  <Switch
                    id="sound-toggle"
                    isChecked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                </FormControl>
              </VStack>
            </Box>
          </Flex>
        )}
        {activeTab === "list" && (
          <Flex justifyContent="center" mt={8} overflowX="auto">
            <Box>
              <Table
                variant="simple"
                bg="white"
                rounded="lg"
                shadow="lg"
                w="full"
                maxW="lg"
              >
                <Thead bg="gray.100">
                  <Tr>
                    <Th>NO.</Th>
                    <Th>Tanggal Kehadiran</Th>
                    <Th>Jam Kehadiran</Th>
                    <Th>Nama</Th>
                    <Th>Kelas</Th>
                    <Th>Keterangan</Th>
                    <Th>Tanda Tangan</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {visitors
                    .filter(
                      (visitor) =>
                        new Date(visitor.tanggalKehadiran).toDateString() ===
                        new Date().toDateString()
                    )
                    .map((visitor, index) => (
                      <Tr key={visitor._id}>
                        <Td>{index + 1}</Td> 
                        <Td>
                          {new Date(
                            visitor.tanggalKehadiran
                          ).toLocaleDateString()}
                        </Td>
                        <Td>{visitor.jamKehadiran}</Td>
                        <Td>{visitor.nama}</Td>
                        <Td>{visitor.kelas}</Td>
                        <Td>{visitor.keterangan}</Td>
                        <Td>
                          <img
                            src={visitor.tandaTangan}
                            alt="Tanda Tangan"
                            className="border rounded w-full max-w-sm"
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        )}
        <audio ref={audioRef} src={successSound} />
      </Container>
    </Box>
  );
};

export default FormulirPengunjung;
