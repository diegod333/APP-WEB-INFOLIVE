"use client";

import { useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  InputGroup,
  SimpleGrid,
  useDisclosure,
  Container,
  Divider,
} from "@chakra-ui/react";

import TarjetaAnuncios from "@/components/tarjeta_anuncios";
import { anuncios, categorias } from "@/data/anuncios";
import Link from "next/link";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeCategory, setActiveCategory] = useState("inicio");
  const [search, setSearch] = useState("");

  const filtered = anuncios.filter((a) => {
    const matchCat =
      activeCategory === "inicio" || a.categoria === activeCategory;

    const matchSearch =
      search === "" ||
      a.titulo.toLowerCase().includes(search.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(search.toLowerCase());

    return matchCat && matchSearch;
  });

  const agrupados = categorias
    .map((cat) => ({
      ...cat,
      items: filtered.filter((a) => a.categoria === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  const isInicio = activeCategory === "inicio";

  return (
    <Box minH="100vh" bg="#f8f9fc">
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Container maxW="720px">
          <HStack h="56px" spacing={3}>

            <HStack spacing={2} flex="1">
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

             <Link href="/publicar">
                <Button
                  size="sm"
                  bg="#4f46e5"
                  color="white"
                  borderRadius="99px"
                  px={4}
                  fontSize="12px"
                  fontWeight="600"
                  _hover={{ bg: "#4338ca" }}
                >
                  Publicar
                </Button>
            </Link>   

            <InputGroup maxW="180px" size="sm">         
              <Input
                placeholder="Buscar anuncios..."
                borderRadius="99px"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                fontSize="12px"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                _focus={{ borderColor: "#4f46e5", bg: "white" }}
              />
            </InputGroup>

            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              bg="#4f46e5"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
            >
              <Text color="white" fontWeight="700" fontSize="12px">
                JR
              </Text>
            </Box>
          </HStack>
        </Container>
      </Box>
      <Container maxW="720px" py={6} px={4}>
        {isInicio ? (
          <VStack align="stretch" spacing={6}>
            {agrupados.length === 0 ? (
              <Box textAlign="center" py={16} color="gray.400">
                <Text fontSize="14px">No se encontraron anuncios.</Text>
              </Box>
            ) : (
              agrupados.map((grupo) => (
                <Box key={grupo.id}>
                  <HStack justify="space-between" mb={3}>
                    <Text fontWeight="700" fontSize="14px" color="gray.800">
                      {grupo.label}
                    </Text>

                    <Button
                      size="xs"
                      variant="ghost"
                      color="gray.400"
                      onClick={() => setActiveCategory(grupo.id)}
                      _hover={{ color: "#4f46e5" }}
                    >
                      Ver todos
                    </Button>
                  </HStack>

                  <TarjetaAnuncios anuncio={grupo.items[0]} />
                  <Divider mt={4} />
                </Box>
              ))
            )}
          </VStack>
        ) : (
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Text fontWeight="700" fontSize="18px" color="gray.900">
                {categorias.find((c) => c.id === activeCategory)?.label ?? "Anuncios"}
              </Text>

              <Text fontSize="12px" color="gray.400">
                {filtered.length} anuncios
              </Text>
            </HStack>

            {filtered.length === 0 ? (
              <Box textAlign="center" py={16} color="gray.400">
                <Text fontSize="14px">No hay anuncios aquí todavía.</Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                {filtered.map((a) => (
                  <TarjetaAnuncios key={a.id} anuncio={a} />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        )}
      </Container>
    </Box>
  );
}