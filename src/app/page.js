"use client";

import { useState, useEffect } from "react";
import {
  Box, HStack, VStack, Text, Button, Input, InputGroup,
  SimpleGrid, Container, Menu, MenuButton, MenuList,
  MenuItem, MenuDivider,
} from "@chakra-ui/react";

import TarjetaAnuncios from "@/components/tarjeta_anuncios";
import { categorias } from "@/data/anuncios";
import Link from "next/link";
import { useSesion } from "@/context/SessionContext";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("inicio");
  const [search, setSearch] = useState("");
  const [anuncios, setAnuncios] = useState([]);
  const { usuario, cerrarSesion } = useSesion();

  const cargarAnuncios = async () => {
    try {
      const res = await fetch("/api/anuncios");
      const data = await res.json();
      if (data.ok) setAnuncios(data.anuncios);
    } catch (error) {
      console.error("Error cargando anuncios:", error);
    }
  };

  useEffect(() => {
    cargarAnuncios();
  }, []);

  const anunciosFiltrados = anuncios.filter((a) => {
    const esComida = a.categoria === "comidas" || a.categoria === "comida";
    const matchCat = activeCategory === "inicio" || a.categoria === activeCategory;
    const matchSearch =
      search === "" ||
      a.titulo.toLowerCase().includes(search.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(search.toLowerCase());
    return esComida && matchCat && matchSearch;
  });
  
  const anunciosOrdenados = [...anunciosFiltrados].sort((a, b) => {
    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    
    const obtenerHorario = (horario) => {
      if (!horario || !horario.includes(" - ")) return { inicio: 0, fin: 1440 };
      const [inicio, fin] = horario.split(" - ");
      const [hInicio, mInicio] = inicio.split(":").map(Number);
      const [hFin, mFin] = fin.split(":").map(Number);
  
      return {
        inicio: hInicio * 60 + mInicio,
        fin: hFin * 60 + mFin,
      };
    };
    
    const horarioA = obtenerHorario(a.horario);
    const horarioB = obtenerHorario(b.horario);
    const estadoA =
      minutosActuales >= horarioA.inicio &&
      minutosActuales <= horarioA.fin
        ? "activo"
        : minutosActuales < horarioA.inicio
        ? "futuro"
        : "terminado";
    const estadoB =
      minutosActuales >= horarioB.inicio &&
      minutosActuales <= horarioB.fin
        ? "activo"
        : minutosActuales < horarioB.inicio
        ? "futuro"
        : "terminado";
    const prioridad = {
      activo: 0,
      futuro: 1,
      terminado: 2,
    };
    if (prioridad[estadoA] !== prioridad[estadoB]) {
      return prioridad[estadoA] - prioridad[estadoB];
    }
    if (estadoA === "activo") {
      return horarioA.fin - horarioB.fin;
    }
    if (estadoA === "futuro") {
      return horarioA.inicio - horarioB.inicio;
    }
    return horarioB.fin - horarioA.fin;
  });

  const isInicio = activeCategory === "inicio" && search === "";

  const iniciales = usuario
    ? usuario.nombre.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <Box minH="100vh" bg="#f8f9fc">
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.100" position="sticky" top={0} zIndex={100}>
        <Container maxW="720px">
          <HStack h="56px" spacing={3}>

            {/* LOGO */}
            <HStack spacing={2} flex="1" cursor="pointer" onClick={() => { setActiveCategory("inicio"); setSearch(""); }}>
              <Box w="28px" h="28px" borderRadius="7px" bg="#4f46e5" display="flex" alignItems="center" justifyContent="center">
                <Text color="white" fontWeight="800" fontSize="12px">IL</Text>
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="700" fontSize="14px" color="gray.900" lineHeight="1">InfoLive</Text>
                <Text fontSize="9px" color="gray.400" fontWeight="600" lineHeight="1" letterSpacing="0.5px">MUESTRA EDUCACIÓN SUPERIOR</Text>
              </VStack>
            </HStack>

            {/* BOTÓN PUBLICAR */}
            {usuario && (
              <Link href="/publicar">
                <Button size="sm" bg="#4f46e5" color="white" borderRadius="99px" px={4} fontSize="12px" fontWeight="600" _hover={{ bg: "#4338ca" }}>
                  Publicar
                </Button>
              </Link>
            )}

            {/* BARRA DE BÚSQUEDA */}
            <InputGroup maxW="180px" size="sm">
              <Input
                placeholder="Buscar comida..."
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

            {/* MENÚ DE PERFIL */}
            <Menu placement="bottom-end">
              <MenuButton
                as={Box}
                w="32px"
                h="32px"
                borderRadius="full"
                bg={usuario ? "#4f46e5" : "gray.200"}
                display="flex"
                align="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: usuario ? "#4338ca" : "gray.300" }}
                transition="all 0.2s"
              >
                <Text color={usuario ? "white" : "gray.500"} fontSize="11px" fontWeight="700" textAlign="center" lineHeight="32px">
                  {iniciales}
                </Text>
              </MenuButton>

              <MenuList minW="210px" borderRadius="12px" shadow="md" border="1px solid" borderColor="gray.100" p={1}>
                {usuario ? (
                  <>
                    <Box px={3} py={2}>
                      <Text fontSize="13px" fontWeight="700" color="gray.800">{usuario.nombre}</Text>
                      <Text fontSize="11px" color="gray.400">Código: {usuario.codigo}</Text>
                    </Box>
                    <MenuDivider borderColor="gray.100" my={1} />
                    <MenuItem as={Link} href="/mis-anuncios" fontSize="13px" fontWeight="500" color="gray.700" borderRadius="8px" _hover={{ bg: "gray.50", color: "#4f46e5" }}>
                      Mis anuncios
                    </MenuItem>
                    <MenuDivider borderColor="gray.100" my={1} />
                    <MenuItem as={Link} href="/anuncios-fav" fontSize="13px" fontWeight="500" color="gray.700" borderRadius="8px" _hover={{ bg: "gray.50", color: "#4f46e5" }}>
                      Anuncios guardados
                    </MenuItem>
                    <MenuDivider borderColor="gray.100" my={1} />
                    <MenuItem fontSize="13px" fontWeight="600" color="red.500" borderRadius="8px" _hover={{ bg: "red.50" }} onClick={cerrarSesion}>
                      Cerrar sesión
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem as={Link} href="/login" fontSize="13px" fontWeight="500" color="blue.600" borderRadius="8px" _hover={{ bg: "gray.50", color: "#4f46e5" }}>
                    Iniciar sesión
                  </MenuItem>
                )}
              </MenuList>
            </Menu>

          </HStack>
        </Container>
      </Box>

      {/* CONTENEDOR DE ANUNCIOS */}
      <Container maxW="720px" py={6} px={4}>
        {isInicio ? (
          <VStack align="stretch" spacing={6}>
            {anunciosOrdenados.length === 0 ? (
              <Box textAlign="center" py={16} color="gray.400">
                <Text fontSize="14px">No se encontraron anuncios activos.</Text>
              </Box>
            ) : (
              <VStack spacing={4} w="full">
                {anunciosOrdenados.map((anuncio) => (
                  <TarjetaAnuncios key={anuncio.id} anuncio={anuncio} />
                ))}
              </VStack>
            )} 
          </VStack>
        ) : (
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Text fontWeight="700" fontSize="18px" color="gray.900">
                {search !== "" ? `Resultados: "${search}"` : categorias.find((c) => c.id === activeCategory)?.label ?? "Anuncios"}
              </Text>
              <Text fontSize="12px" color="gray.400">
                {anunciosOrdenados.length} {anunciosOrdenados.length === 1 ? "anuncio" : "anuncios"}
              </Text>
            </HStack>
            {anunciosOrdenados.length === 0 ? (
              <Box textAlign="center" py={16} color="gray.400">
                <Text fontSize="14px">No hay anuncios aquí todavía.</Text>
                {search && <Button mt={4} size="sm" onClick={() => setSearch("")}>Borrar búsqueda</Button>}
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                {anunciosOrdenados.map((a) => (
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
