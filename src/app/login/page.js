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

export default function Login() {
  const [token, setToken] = useState("");
  const [cargando, setCargando] = useState(false);
  
  const toast = useToast();
  const router = useRouter();

  const manejarLogin = (e) => {
    e.preventDefault();
    setCargando(true);

    // SIMULACIÓN: Simulamos la validación del token por 1.2 segundos
    setTimeout(() => {
      setCargando(false);
      
      if (token.trim() === "") {
        toast({
          title: "Token requerido",
          description: "Por favor, ingresa tu token de usuario para continuar.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Alerta de éxito al validar el token
      toast({
        title: "¡Token validado!",
        description: "Sesión iniciada correctamente en InfoLive.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
      router.push("/"); // Redirige automáticamente al Home principal
    }, 1200);
  };

  return (
    <Box minH="100vh" bg="#f8f9fc" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="400px" bg="white" p={8} borderRadius="24px" border="1px solid" borderColor="gray.100" shadow="sm">
        <VStack spacing={6} align="stretch">
          
          {/* Encabezado del Formulario */}
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
              Escanea tu código QR para registrarte y obtener tu credencial
            </Text>
          </VStack>

          {/* Formulario de Token */}
          <form onSubmit={manejarLogin}>
            <VStack spacing={5}>
              <FormControl id="user-token" isRequired>
                <FormLabel fontSize="13px" fontWeight="600" color="gray.700" textAlign="center" mb={2}>
                  Ingrese token de usuario
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Ej: IL-7492X"
                  borderRadius="10px"
                  fontSize="14px"
                  bg="gray.50"
                  textAlign="center" // Centra el texto del token para que se vea más ordenado
                  letterSpacing="1px"
                  fontWeight="600"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  _focus={{ borderColor: "#4f46e5", bg: "white" }}
                />
              </FormControl>

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
                Validar Acceso
              </Button>
            </VStack>
          </form>

          <Divider borderColor="gray.100" />

          {/* Enlace de retorno */}
          <Box textAlign="center">
            <Link href="/">
              <Text fontSize="12px" color="gray.400" _hover={{ color: "#4f46e5", textDecoration: "underline" }}>
                ← Volver al inicio
              </Text>
            </Link>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}