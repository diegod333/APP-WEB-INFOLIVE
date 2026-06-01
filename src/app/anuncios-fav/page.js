"use client";

import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Button,
  Icon,
} from "@chakra-ui/react";
import Link from "next/link";

export default function Guardados() {
  return (
    <Box minH="100vh" bg="#f8f9fc">
      {}
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Container maxW="720px">
          <HStack h="56px" justify="space-between">
            {}
            <Link href="/">
              <HStack spacing={2} cursor="pointer">
                <Box
                  w="28px"
                  h="28px"
                  borderRadius="7px"
                  bg="#4f46e5"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontWeight="800" fontSize="12px">
                    IL
                  </Text>
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="700" fontSize="14px" color="gray.900" lineHeight="1">
                    InfoLive
                  </Text>
                  <Text fontSize="10px" color="gray.400" lineHeight="1">
                    INFORMÁTICA UACH
                  </Text>
                </VStack>
              </HStack>
            </Link>

            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              bg="#4f46e5"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="700" fontSize="12px">
                JR
              </Text>
            </Box>
          </HStack>
        </Container>
      </Box>

      {}
      <Container maxW="720px" py={12} px={4}>
        <VStack spacing={6} align="center" mt={10}>
          <Box
            p={6}
            bg="gray.100"
            borderRadius="full"
            color="gray.400"
          >
            {}
            <Text fontSize="4xl">🔖</Text>
          </Box>
          
          <VStack spacing={2} textAlign="center">
            <Text fontWeight="700" fontSize="18px" color="gray.900">
              No hay anuncios guardados
            </Text>
            <Text fontSize="14px" color="gray.500" maxW="300px">
              Por el momento no tienes ningún anuncio guardado. Explora los anuncios disponibles y guárdalos para verlos más tarde.
            </Text>
          </VStack>

          <Link href="/">
            <Button
              mt={4}
              bg="#4f46e5"
              color="white"
              borderRadius="99px"
              px={6}
              fontSize="14px"
              fontWeight="600"
              _hover={{ bg: "#4338ca" }}
            >
              Explorar anuncios
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
}