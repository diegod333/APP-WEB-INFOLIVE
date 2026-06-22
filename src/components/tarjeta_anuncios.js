"use client";

import { Box, HStack, VStack, Text, Badge, Image, Avatar } from "@chakra-ui/react";

export default function TarjetaAnuncios({ anuncio }) {
  if (!anuncio) return null;


  const imagenPublicacion = anuncio.imagen || "https://cdn-icons-png.flaticon.com/512/10449/10449543.png";


  const inicialVendedor = anuncio.dueno_anuncio ? anuncio.dueno_anuncio.charAt(0).toUpperCase() : "U";

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
            <Badge borderRadius="md" px={2} colorScheme={anuncio.stock === "disponible" ? "green" : "red"} fontSize="10px">
              {anuncio.stock || "disponible"}
            </Badge>
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
