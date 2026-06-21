"use client";

import { useEffect, useState } from "react";
import {
  Box, Container, VStack, HStack, Text, Input, Button, Select, Textarea,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSesion } from "@/context/SessionContext";

export default function MisAnunciosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const { usuario, cargandoSesion } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (!cargandoSesion && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargandoSesion, router]);

  const cargarAnuncios = async () => {
    if (!usuario) return;
    try {
      const res = await fetch("/api/anuncios");
      const data = await res.json();
      if (data.ok) {
        const propios = data.anuncios.filter((a) => a.dueno_anuncio === usuario.nombre);
        setAnuncios(propios);
      } else {
        alert(data.message || "Error al cargar anuncios");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al cargar anuncios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) cargarAnuncios();
  }, [usuario]);

  const cambiarCampo = (index, campo, valor) => {
    const copia = [...anuncios];
    copia[index] = { ...copia[index], [campo]: valor };
    setAnuncios(copia);
  };

  const guardarCambios = async (anuncio) => {
    try {
      const res = await fetch("/api/anuncios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anuncio),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Anuncio actualizado");
      } else {
        alert(data.message || "Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al actualizar");
    }
  };

  const eliminarAnuncio = async (anuncio) => {
    const confirmar = confirm("¿Seguro que quieres eliminar este anuncio?");
    if (!confirmar) return;

    try {
      const res = await fetch("/api/anuncios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowNumber: anuncio.rowNumber }),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Anuncio eliminado");
        setAnuncios(anuncios.filter((a) => a.id !== anuncio.id));
      } else {
        alert(data.message || "Error al eliminar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al eliminar");
    }
  };

  if (cargandoSesion || !usuario) {
    return (
      <Box minH="100vh" bg="#f8f9fc" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">Cargando...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="#f8f9fc">
      <Container maxW="700px" py={8}>
        <VStack align="stretch" spacing={4}>
          <Link href="/">
            <Text fontSize="13px" color="#4f46e5" cursor="pointer">← Volver</Text>
          </Link>

          <HStack justify="space-between" align="center">
            <Text fontSize="24px" fontWeight="800" color="gray.900">Mis anuncios</Text>
            <Box bg="#f0f0ff" borderRadius="8px" px={3} py={1}>
              <Text fontSize="12px" color="#4f46e5" fontWeight="600">{usuario.nombre}</Text>
            </Box>
          </HStack>

          {cargando ? (
            <Text color="gray.500">Cargando anuncios...</Text>
          ) : anuncios.length === 0 ? (
            <Box textAlign="center" py={12} color="gray.400">
              <Text fontSize="14px">No tienes anuncios publicados.</Text>
              <Link href="/publicar">
                <Button mt={4} size="sm" bg="#4f46e5" color="white" borderRadius="99px" _hover={{ bg: "#4338ca" }}>
                  Publicar ahora
                </Button>
              </Link>
            </Box>
          ) : (
            anuncios.map((anuncio, index) => (
              <Box key={anuncio.id} bg="white" p={4} borderRadius="16px" border="1px solid #e5e7eb">
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="12px" color="gray.400">ID: {anuncio.id}</Text>

                  <Input value={anuncio.titulo} onChange={(e) => cambiarCampo(index, "titulo", e.target.value)} />
                  <Textarea value={anuncio.descripcion} onChange={(e) => cambiarCampo(index, "descripcion", e.target.value)} />
                  <Input value={anuncio.precio} onChange={(e) => cambiarCampo(index, "precio", e.target.value)} />
                  <Input value={anuncio.ubicacion} onChange={(e) => cambiarCampo(index, "ubicacion", e.target.value)} />
                  <Input value={anuncio.horario} onChange={(e) => cambiarCampo(index, "horario", e.target.value)} />

                  <Select value={anuncio.stock} onChange={(e) => cambiarCampo(index, "stock", e.target.value)}>
                    <option value="disponible">Disponible</option>
                    <option value="agotado">Agotado</option>
                  </Select>

                  <Button bg="#4f46e5" color="white" borderRadius="99px" fontWeight="700" _hover={{ bg: "#4338ca" }} onClick={() => guardarCambios(anuncio)}>
                    Guardar cambios
                  </Button>
                  <Button bg="red.500" color="white" borderRadius="99px" fontWeight="700" _hover={{ bg: "red.600" }} onClick={() => eliminarAnuncio(anuncio)}>
                    Eliminar anuncio
                  </Button>
                </VStack>
              </Box>
            ))
          )}
        </VStack>
      </Container>
    </Box>
  );
}
