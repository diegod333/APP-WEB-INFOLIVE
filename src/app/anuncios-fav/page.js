"use client";

import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
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

            <Menu placement="bottom-end">
              <MenuButton
              as={Box}
              w="32px"
              h="32px"
              borderRadius="full"
              bg="#4f46e5"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              hover={{ bg: "#4338ca" }}
              transition="all 0.2s"
              >
                <Text color="white" fontSize="9px" textAlign="center" lineHeight="10px">
                  Mi perfil
                  </Text>
                  </MenuButton>
                  <MenuList
                  minW="200px"
                  borderRadius="12px"
                  shadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                  p={1}
                  >
                    <MenuItem
                    as={Link}
                    href="/mis-anuncios"
                    fontSize="13px"
                    fontWeight="500"
                    color="gray.700"
                    borderRadius="8px"
                     _hover={{ bg: "gray.50", color: "#4f46e5" }}
                     >
                      Mis anuncios
                      </MenuItem>
                       <MenuDivider borderColor="gray.100" my={1} />
                       <MenuItem
                       as={Link}
                       href="/anuncios-fav"
                       fontSize="13px"
                       fontWeight="500"
                       color="gray.700"
                       borderRadius="8px"
                       hover={{ bg: "gray.50", color: "#4f46e5" }}
                       >
                        Anuncios guardados
                        </MenuItem>
                        <MenuDivider borderColor="gray.100" my={1} />
                        <MenuItem
                        fontSize="13px"
                        fontWeight="500"
                        color="red.600"
                        borderRadius="8px"
                        _hover={{ bg: "red.50" }}
                        >
                          Cerrar sesión
                          </MenuItem>
                          </MenuList>
                          </Menu>
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
