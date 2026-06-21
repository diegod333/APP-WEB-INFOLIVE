"use client";

import { useState } from "react";
import {
  Box, Button, Container, FormControl, FormLabel, Input,
  VStack, Text, Heading, useToast, HStack, Divider,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSesion } from "@/context/SessionContext";

export default function Login() {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [mostrarNombre, setMostrarNombre] = useState(false);
  const [cargando, setCargando] = useState(false);

  const toast = useToast();
  const router = useRouter();
  const { iniciarSesion } = useSesion();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, nombre: mostrarNombre ? nombre : "" }),
      });

      const data = await res.json();

      // Primera vez: el Sheet no tiene nombre, hay que pedirlo
      if (data.necesitaNombre) {
        setMostrarNombre(true);
        toast({
          title: "¡Código válido!",
          description: "Es tu primera vez. Elige un nombre de usuario.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setCargando(false);
        return;
      }

      if (data.ok) {
        iniciarSesion(data.usuario);
        toast({
          title: `¡Bienvenido, ${data.usuario.nombre}!`,
          description: "Sesión iniciada correctamente en InfoLive.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        router.push("/");
      } else {
        toast({
          title: "Acceso denegado",
          description: data.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Intenta de nuevo.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box minH="100vh" bg="#f8f9fc" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="400px" bg="white" p={8} borderRadius="24px" border="1px solid" borderColor="gray.100" shadow="sm">
        <VStack spacing={6} align="stretch">

          {/* Encabezado */}
          <VStack spacing={1} align="center" textAlign="center">
            <HStack spacing={2} mb={1}>
              <Box w="24px" h="24px" borderRadius="6px" bg="#4f46e5" display="flex" alignItems="center" justifyContent="center">
                <Text color="white" fontWeight="800" fontSize="10px">IL</Text>
              </Box>
              <Text fontWeight="800" fontSize="16px" color="#4f46e5">InfoLive</Text>
            </HStack>
            <Heading as="h1" size="md" fontWeight="800" color="gray.900">
              Acceso Institucional
            </Heading>
            <Text fontSize="13px" color="gray.500">
              {mostrarNombre
                ? "Elige el nombre que aparecerá en tus anuncios."
                : "Ingresa el código que te entregamos para acceder."}
            </Text>
          </VStack>

          {/* Formulario */}
          <form onSubmit={manejarLogin}>
            <VStack spacing={4}>

              {/* Código — siempre visible */}
              <FormControl id="codigo" isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="gray.700" mb={1} textAlign="center">
                  Código de acceso
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Ej: AB12"
                  borderRadius="10px"
                  fontSize="22px"
                  bg="gray.50"
                  textAlign="center"
                  letterSpacing="6px"
                  fontWeight="700"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  _focus={{ borderColor: "#4f46e5", bg: "white" }}
                  maxLength={10}
                  isReadOnly={mostrarNombre} // ya no se puede cambiar el código una vez validado
                  opacity={mostrarNombre ? 0.5 : 1}
                />
              </FormControl>

              {/* Nombre — solo aparece la primera vez */}
              {mostrarNombre && (
                <FormControl id="nombre" isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="gray.700" mb={1}>
                    Tu nombre de usuario
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Ej: Pedro García"
                    borderRadius="10px"
                    fontSize="14px"
                    bg="gray.50"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    _focus={{ borderColor: "#4f46e5", bg: "white" }}
                    autoFocus
                  />
                  <Text fontSize="11px" color="gray.400" mt={1}>
                    Este nombre aparecerá en tus anuncios y no podrá cambiarse.
                  </Text>
                </FormControl>
              )}

              <Button
                type="submit"
                width="full"
                bg="#4f46e5"
                color="white"
                borderRadius="12px"
                size="md"
                fontSize="14px"
                fontWeight="600"
                isLoading={cargando}
                loadingText="Validando..."
                _hover={{ bg: "#4338ca" }}
              >
                {mostrarNombre ? "Confirmar nombre y entrar" : "Entrar a InfoLive"}
              </Button>

            </VStack>
          </form>
          <Box textAlign="center">
            <Link href="/">
              <Text fontSize="12px" color="gray.400" _hover={{ color: "#4f46e5", textDecoration: "underline" }}>
                ← Volver al inicio sin sesión
              </Text>
            </Link>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}
