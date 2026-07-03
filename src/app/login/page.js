"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Heading,
  useToast,
  HStack,
  Divider,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSesion } from "@/context/SessionContext";

export default function Login() {
  const [token, setToken] = useState("");
  const [nombre, setNombre] = useState("");
  const [necesitaNombre, setNecesitaNombre] = useState(false);
  const [cargando, setCargando] = useState(false);
  
  const toast = useToast();
  const router = useRouter();
  const { iniciarSesion } = useSesion();

  const validarCredencial = async (codigo, nombreAEnviar) => {
    const respuesta = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo,
        nombre: nombreAEnviar,
      }),
    });

    const contentType = respuesta.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("El servidor no devolvió un JSON válido. Revisa las variables de entorno.");
    }

    return { respuesta, resultado: await respuesta.json() };
  };

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (token.trim() === "") {
      setCargando(false);
      toast({
        title: "Token requerido",
        description: "Por favor, ingresa tu token de usuario.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (necesitaNombre && nombre.trim() === "") {
      setCargando(false);
      toast({
        title: "Nombre requerido",
        description: "Elige un nombre de usuario para continuar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const { respuesta, resultado } = await validarCredencial(
        token.trim(),
        necesitaNombre ? nombre.trim() : ""
      );

      setTimeout(() => {
        setCargando(false);

        // Primera vez: el código existe pero no tiene nombre asignado todavía
        if (resultado.necesitaNombre) {
          setNecesitaNombre(true);
          toast({
            title: "¡Es tu primera vez!",
            description: resultado.message || "Elige un nombre de usuario para continuar.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        if (!respuesta.ok || !resultado.ok) {
          toast({
            title: "Token inválido",
            description: resultado.message || "El código no coincide con ninguna credencial activa.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        
        iniciarSesion(resultado.usuario);

        toast({
          title: "¡Token validado!",
          description: `Sesión iniciada correctamente como ${resultado.usuario.nombre}.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
        router.push("/"); 
      }, 1200);

    } catch (error) {
      setCargando(false);
      console.error("Error capturado en login:", error);
      toast({
        title: "Error de servidor",
        description: "Hubo un problema al validar tu credencial. Inténtalo de nuevo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg="#f8f9fc" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="400px" bg="white" p={8} borderRadius="24px" border="1px solid" borderColor="gray.100" shadow="sm">
        <VStack spacing={6} align="stretch">
          
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
              {necesitaNombre
                ? "Elige un nombre de usuario para tu primera vez"
                : "Ingresa tu código asignado por nosotros!"}
            </Text>
          </VStack>

          <form onSubmit={manejarLogin}>
            <VStack spacing={5}>
              <FormControl id="user-token" isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="gray.700" textAlign="center" mb={2}>
                  Ingrese token de usuario
                </FormLabel>
                <Input
                  type="text"
                  placeholder="EJ: JZ41"
                  borderRadius="10px"
                  fontSize="14px"
                  bg="gray.50"
                  textAlign="center" 
                  letterSpacing="1px"
                  fontWeight="600"
                  value={token}
                  isDisabled={necesitaNombre}
                  onChange={(e) => setToken(e.target.value)}
                  _focus={{ borderColor: "#4f46e5", bg: "white" }}
                />
              </FormControl>

              {necesitaNombre && (
                <FormControl id="user-nombre" isRequired>
                  <FormLabel fontSize="13px" fontWeight="600" color="gray.700" textAlign="center" mb={2}>
                    ¿Cómo quieres que te llamemos?
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="EJ: Juan Rodríguez"
                    borderRadius="10px"
                    fontSize="14px"
                    bg="gray.50"
                    textAlign="center"
                    fontWeight="600"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    _focus={{ borderColor: "#4f46e5", bg: "white" }}
                    autoFocus
                  />
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
                _hover={{ bg: "#4338ca" }}
              >
                {necesitaNombre ? "Confirmar nombre y continuar" : "Validar Acceso"}
              </Button>

              {necesitaNombre && (
                <Text
                  fontSize="12px"
                  color="gray.400"
                  cursor="pointer"
                  _hover={{ color: "#4f46e5", textDecoration: "underline" }}
                  onClick={() => {
                    setNecesitaNombre(false);
                    setNombre("");
                  }}
                >
                  ← Usar otro código
                </Text>
              )}
            </VStack>
          </form>

          <Divider borderColor="gray.100" />

          <Box textAlign="center">
            <Link href="/">
              <Text fontSize="12px" color="gray.400" _hover={{ color: "#4f46e5", textDecoration: "underline" }}>
                ← Volver al inicio sin inicio de sesión
              </Text>
            </Link>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}