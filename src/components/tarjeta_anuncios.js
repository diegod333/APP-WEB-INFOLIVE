"use client";

import { Box, HStack, VStack, Text, Image, Avatar } from "@chakra-ui/react";

export default function TarjetaAnuncios({ anuncio }) {
  if (!anuncio) return null;

  const imagenPublicacion = anuncio.imagen || "https://cdn-icons-png.flaticon.com/512/10449/10449543.png";
  const inicialVendedor = anuncio.dueno_anuncio ? anuncio.dueno_anuncio.charAt(0).toUpperCase() : "U";

  
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  let contador = "00:00";
  let anuncioActivo = false;
  let anuncioTerminado = false;

  let colorContador = {
    bg: "gray.100",
    color: "gray.500",
    border: "gray.300",
  };

  if (anuncio.horario && anuncio.horario.includes(" - ")) {
    try {
      const [horaInicio, horaFin] = anuncio.horario.split(" - ");

      const [hInicio, mInicio] = horaInicio.split(":").map(Number);
      const [hFin, mFin] = horaFin.split(":").map(Number);

      const minutosInicio = hInicio * 60 + mInicio;
      const minutosFin = hFin * 60 + mFin;

      anuncioActivo =
        minutosActuales >= minutosInicio &&
        minutosActuales <= minutosFin;

      anuncioTerminado =
        minutosActuales > minutosFin;

      if (anuncioActivo) {
        const tiempoRestante = minutosFin - minutosActuales;

        const horasRestantes = String(Math.floor(tiempoRestante / 60)).padStart(2, "0");
        const minutosRestantes = String(tiempoRestante % 60).padStart(2, "0");

        contador = `${horasRestantes}:${minutosRestantes}`;

        if (tiempoRestante > 30) {
          colorContador = {
            bg: "green.100",
            color: "green.700",
            border: "green.300",
          };
        } else if (tiempoRestante > 20) {
          colorContador = {
            bg: "yellow.100",
            color: "yellow.700",
            border: "yellow.300",
          };
        } else if (tiempoRestante > 10) {
          colorContador = {
            bg: "orange.100",
            color: "orange.700",
            border: "orange.300",
          };
        } else {
          colorContador = {
            bg: "red.100",
            color: "red.700",
            border: "red.300",
          };
        }
      }
    } catch (e) {
      console.error("Error al calcular el horario:", e);
    }
  }

  const renderPrecio = () => {
    if (!anuncio.precio) return "Consultar";
    return anuncio.precio.toString().startsWith("$") ? anuncio.precio : `$${anuncio.precio}`;
  };

  const esDisponible = (anuncio.stock || "disponible").toLowerCase() === "disponible";
  const colorPuntoStock = esDisponible ? "green.400" : "red.400";

  return (
    <Box
      bg="white"
      borderRadius="14px"
      border="2px solid" 
      borderColor="gray.200"
      p={{ base: 3, md: 4 }}
      mb={4} 
      shadow="sm"
      w="full"
      opacity={anuncioTerminado ? 0.6 : 1}
      filter={anuncioTerminado ? "grayscale(65%)" : "none"}
    >
      <HStack align="center" spacing={{ base: 3, md: 5 }} w="full">
        
        <Avatar
          name={anuncio.dueno_anuncio}
          getInitials={() => inicialVendedor}
          bg="white"
          color="gray.800"
          border="2px solid"
          borderColor="gray.800"
          size={{ base: "sm", md: "md" }}
          fontWeight="700"
          fontSize={{ base: "14px", md: "18px" }}
        />

        <VStack align="start" spacing={1} flex="1" minW={0}>
          <HStack justify="space-between" w="full">
            <Text fontSize="12px" fontWeight="700" color="gray.400" isTruncated>
              {anuncio.dueno_anuncio || "Vendedor"}
            </Text>

            <HStack spacing={3} align="center">
              {anuncio.horario && (
                <Box
                  px={2}
                  py={0.5}
                  borderRadius="8px"
                  bg={colorContador.bg}
                  color={colorContador.color}
                  border="1px solid"
                  borderColor={colorContador.border}
                  fontSize="10px"
                  fontWeight="700"
                  minW="60px"
                  textAlign="center"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  ⏳ {contador}
                </Box>
              )}

              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={colorPuntoStock}
                boxShadow={`0 0 6px ${esDisponible ? "rgba(72, 187, 120, 0.6)" : "rgba(245, 101, 101, 0.6)"}`}
                title={esDisponible ? "Disponible" : "Agotado"}
                flexShrink={0}
              />
            </HStack>
          </HStack>

          <Text fontSize={{ base: "15px", md: "16px" }} fontWeight="800" color="gray.900" lineHeight="1.2" isTruncated w="full">
            {anuncio.titulo}
          </Text>

          <Text fontSize="13px" color="gray.600" noOfLines={2} w="full">
            {anuncio.descripcion}
          </Text>

          <HStack spacing={3} pt={1}>
            <Text color="#4f46e5" fontSize="14px" fontWeight="800">
              {renderPrecio()}
            </Text>
            <Text fontSize="11px" bg="gray.100" px={2} py={0.5} borderRadius="6px" color="gray.600" fontWeight="600">
              📍 Edif. {anuncio.ubicacion}
            </Text>
          </HStack>
        </VStack>

        <Box 
          minW={{ base: "70px", md: "90px" }} 
          w={{ base: "70px", md: "90px" }} 
          h={{ base: "65px", md: "80px" }} 
          borderRadius="10px" 
          border="2px solid" 
          borderColor="gray.800" 
          overflow="hidden"
        >
          <Image
            src={imagenPublicacion}
            alt={anuncio.titulo}
            objectFit="cover"
            w="full"
            h="full"
          />
        </Box>

      </HStack>
    </Box>
  );
}
