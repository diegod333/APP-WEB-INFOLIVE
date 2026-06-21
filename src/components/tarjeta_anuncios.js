"use client";

import { Box, Text, VStack } from "@chakra-ui/react";

export default function TarjetaAnuncios({ anuncio }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="12px"
      p={4}
      _hover={{ borderColor: "gray.200", shadow: "sm" }}
      transition="all 0.15s"
    >
      <VStack align="start" spacing={2}>
        <Text
          fontWeight="700"
          fontSize="14px"
          color="gray.900"
          lineHeight="1.3"
        >
          {anuncio.titulo}
        </Text>

        <Text
          fontSize="13px"
          color="gray.500"
          lineHeight="1.6"
          noOfLines={2}
        >
          {anuncio.descripcion}
        </Text>

        <VStack align="start" spacing={0.5} pt={1}>
          <Text fontSize="11px" color="gray.400">
            Horario: {anuncio.horario}
          </Text>

          <Text fontSize="11px" color="gray.400">
            Ubicación: Edificio {anuncio.ubicacion}
          </Text>

          <Text fontSize="11px" color="gray.400">
            Vendedor: {anuncio.dueno_anuncio}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
