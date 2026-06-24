"use client";

import { Box, HStack, VStack, Text, Badge, Image, Avatar } from "@chakra-ui/react";

export default function TarjetaAnuncios({ anuncio }) {
  if (!anuncio) return null;


  const imagenPublicacion = anuncio.imagen || "https://cdn-icons-png.flaticon.com/512/10449/10449543.png";


  const inicialVendedor = anuncio.dueno_anuncio ? anuncio.dueno_anuncio.charAt(0).toUpperCase() : "U";

  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
  const [horaInicio, horaFin] = anuncio.horario.split(" - ");
  const [hFin, mFin] = horaFin.split(":").map(Number);
  const minutosFin = hFin * 60 + mFin;
  const tiempoRestante = Math.max(0, minutosFin - minutosActuales);
  const horasRestantes = String(Math.floor(tiempoRestante / 60)).padStart(2, "0");
  const minutosRestantes = String(tiempoRestante % 60).padStart(2, "0");
  const contador = `${horasRestantes}:${minutosRestantes}`;
  
  let colorContador = {
    bg: "gray.100",
    color: "gray.500",
    border: "gray.300",
  };

  if (tiempoRestante > 60) {
    colorContador = {
      bg: "green.100",
      color: "green.700",
      border: "green.300",
    };
  } else if (tiempoRestante > 30) {
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
  } else if (tiempoRestante > 0) {
    colorContador = {
      bg: "red.100",
      color: "red.700",
      border: "red.300",
    };
  }
  
  return (
    <Box
      bg="white"
      borderRadius="14px"
      border="2px solid" 
      borderColor="gray.200"
      p={4}
      mb={4} 
      shadow="sm"
      w="full"
    >
      <HStack align="center" spacing={5} justify="space-between" w="full">
        

        <Avatar
          name={anuncio.dueno_anuncio}
          getInitials={() => inicialVendedor}
          bg="white"
          color="gray.800"
          border="2px solid"
          borderColor="gray.800"
          size="md"
          fontWeight="700"
          fontSize="18px"
        />

        <VStack align="start" spacing={1} flex="1">
          <HStack justify="space-between" w="full">
            <Text fontSize="12px" fontWeight="700" color="gray.400">
              {anuncio.dueno_anuncio || "Vendedor"}
            </Text>

            <HStack spacing={2}>
              <Box
                px={2}
                py={1}
                borderRadius="8px"
                bg={colorContador.bg}
                color={colorContador.color}
                border="1px solid"
                borderColor={colorContador.border}
                fontSize="11px"
                fontWeight="700"
                minW="70px"
                textAlign="center"
              >
                ⏳ {contador}
              </Box>

              <Badge
                borderRadius="md"
                px={2}
                colorScheme={anuncio.stock === "disponible" ? "green" : "red"}
                fontSize="10px"
              >
                {anuncio.stock || "disponible"}
              </Badge>
            </HStack>
          </HStack>

          {/* Título Principal */}
          <Text fontSize="16px" fontWeight="800" color="gray.900" lineHeight="1.2">
            {anuncio.titulo}
          </Text>

          {/* Detalles del Anuncio */}
          <Text fontSize="13px" color="gray.600" noOfLines={2}>
            {anuncio.descripcion}
          </Text>

          {/* Precio y Ubicación */}
          <HStack spacing={3} pt={1}>
            <Text color="#4f46e5" fontSize="14px" fontWeight="800">
              {anuncio.precio ? `$${anuncio.precio}` : "Consultar"}
            </Text>
            <Text fontSize="11px" bg="gray.100" px={2} py={0.5} borderRadius="6px" color="gray.600" fontWeight="600">
              📍 Edif. {anuncio.ubicacion}
            </Text>
          </HStack>
        </VStack>

        <Box 
          minW="90px" 
          w="90px" 
          h="80px" 
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
