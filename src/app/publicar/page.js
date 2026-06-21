"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Input,
  Button,
  Textarea,
  Select,
} from "@chakra-ui/react";
import Link from "next/link";

export default function PublicarPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [stock, setStock] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const ahora = new Date();

    const hora = ahora.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setHoraInicio(hora);
  }, []);

    // Redirigir si no hay sesión
  useEffect(() => {
    if (!cargandoSesion && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargandoSesion, router]);


  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setPrecio("");
    setUbicacion("");
    setHoraFin("");
    setStock("");
  };

  const guardarAnuncio = async () => {
    if (!titulo || !descripcion || !ubicacion || !horaInicio || !horaFin || !stock) {
      alert("Completa los campos principales antes de publicar.");
      return;
    }

    setCargando(true);

    const anuncio = {
      titulo,
      descripcion,
      precio,
      ubicacion,
      horario: `${horaInicio} - ${horaFin}`,
      stock,
      dueno_anuncio: usuario.nombre,
    };

    try {
      const res = await fetch("/api/anuncios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(anuncio),
      });

      const data = await res.json();

      if (data.ok) {
        alert("Anuncio publicado correctamente");
        limpiarFormulario();
      } else {
        alert("Error al publicar el anuncio");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al publicar el anuncio");
    } finally {
      setCargando(false);
    }
  };

  if (cargandoSesion || !usuario) {
    return (
      <Box minH="100vh" bg="#f8f9fc" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">Cargando...</Text>
      </Box>
    );
  }

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
            <VStack align="stretch" spacing={3}>
              <Text fontSize="14px" fontWeight="700" color="gray.800">
                Horario disponible
              </Text>
              
              <HStack>
                <Input
                  placeholder="Hora inicio"
                  bg="white"
                  value={horaInicio}
                  readOnly
                />

                <Input
                  type="time"
                  bg="white"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                />
              </HStack>

              <Text fontSize="12px" color="gray.400">
                Ejemplo: disponible desde ahora hasta las 13:30.
              </Text>
            </VStack>
          </Box>

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