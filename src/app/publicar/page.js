"use client";

import { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  Textarea,
  Select,
  Checkbox,
  SimpleGrid,
} from "@chakra-ui/react";
import Link from "next/link";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdqF6zqNAsl5uQKhl5OpCAl8TAHuWYIk2V02WgPmQc5B1FAuJd5CmvyCKWQZHvcpaXBw/exec";

export default function PublicarPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [horario, setHorario] = useState("");
  const [stock, setStock] = useState("");
  const [dias, setDias] = useState([]);
  const [cargando, setCargando] = useState(false);

  const toggleDia = (dia) => {
    if (dias.includes(dia)) {
      setDias(dias.filter((d) => d !== dia));
    } else {
      setDias([...dias, dia]);
    }
  };

  const guardarAnuncio = async () => {
    setCargando(true);

    const anuncio = {
      titulo,
      descripcion,
      precio,
      ubicacion,
      dias: dias.join(", "),
      horario,
      stock,
    };

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(anuncio),
    });

    setCargando(false);
    alert("Anuncio publicado correctamente");
  };

  return (
    <Box minH="100vh" bg="#f8f9fc">
      <Container maxW="600px" py={8}>
        <VStack align="stretch" spacing={4}>
          <Link href="/">
            <Text fontSize="13px" color="#4f46e5" cursor="pointer">
              ← Volver
            </Text>
          </Link>

          <Text fontSize="24px" fontWeight="800" color="gray.900">
            Publicar anuncio
          </Text>

          <Input
            placeholder="Título del anuncio"
            bg="white"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <Textarea
            placeholder="Descripción"
            bg="white"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <Input
            placeholder="Precio o información extra"
            bg="white"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <Select
            placeholder="Ubicación"
            bg="white"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          >
            <option value="2000">Edificio 2000</option>
            <option value="3000">Edificio 3000</option>
            <option value="4000">Edificio 4000</option>
            <option value="6000">Edificio 6000</option>
            <option value="7000">Edificio 7000</option>
            <option value="8000">Edificio 8000</option>
            <option value="9000">Edificio 9000</option>
            <option value="10000">Edificio 10000</option>
            <option value="14000">Edificio 14000</option>
          </Select>

          <Box bg="white" p={4} borderRadius="12px" border="1px solid #e5e7eb">
            <Text fontSize="14px" fontWeight="700" mb={3} color="gray.800">
              Días disponibles
            </Text>

            <SimpleGrid columns={2} spacing={2}>
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(
                (dia) => (
                  <Checkbox
                    key={dia}
                    isChecked={dias.includes(dia)}
                    onChange={() => toggleDia(dia)}
                  >
                    {dia}
                  </Checkbox>
                )
              )}
            </SimpleGrid>
          </Box>

          <Input
            placeholder="Horario. Ej: 12:00 - 15:30"
            bg="white"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />

          <Select
            placeholder="Stock"
            bg="white"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          >
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
          </Select>

          <Button
            onClick={guardarAnuncio}
            isLoading={cargando}
            bg="#4f46e5"
            color="white"
            borderRadius="99px"
            fontWeight="700"
            _hover={{ bg: "#4338ca" }}
          >
            Guardar anuncio
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}