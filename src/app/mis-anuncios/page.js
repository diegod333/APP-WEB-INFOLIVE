"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  Select,
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";

const EMAIL_USUARIO = "correoprueba@uach.cl";

export default function MisAnunciosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarAnuncios = async () => {
    try {
      const res = await fetch("/api/anuncios");
      const data = await res.json();

      if (data.ok) {
        console.log("EMAIL_USUARIO:", EMAIL_USUARIO);
        console.log("ANUNCIOS:", data.anuncios);
        const propios = data.anuncios.filter(
          (a) => a.dueno_anuncio === EMAIL_USUARIO
        );

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
    cargarAnuncios();
  }, []);

  const cambiarCampo = (index, campo, valor) => {
    const copia = [...anuncios];
    copia[index] = {
      ...copia[index],
      [campo]: valor,
    };
    setAnuncios(copia);
  };

  const guardarCambios = async (anuncio) => {
    try {
      const res = await fetch("/api/anuncios", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rowNumber: anuncio.rowNumber,
      }),
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




  return (
    <Box minH="100vh" bg="#f8f9fc">
      <Container maxW="700px" py={8}>
        <VStack align="stretch" spacing={4}>
          <Link href="/">
            <Text fontSize="13px" color="#4f46e5" cursor="pointer">
              ← Volver
            </Text>
          </Link>

          <Text fontSize="24px" fontWeight="800" color="gray.900">
            Mis anuncios
          </Text>

          {cargando ? (
            <Text color="gray.500">Cargando anuncios...</Text>
          ) : anuncios.length === 0 ? (
            <Text color="gray.500">No tienes anuncios publicados.</Text>
          ) : (
            anuncios.map((anuncio, index) => (
              <Box
                key={anuncio.id}
                bg="white"
                p={4}
                borderRadius="16px"
                border="1px solid #e5e7eb"
              >
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="12px" color="gray.400">
                    ID: {anuncio.id}
                  </Text>

                  <Input
                    value={anuncio.titulo}
                    onChange={(e) =>
                      cambiarCampo(index, "titulo", e.target.value)
                    }
                  />

                  <Textarea
                    value={anuncio.descripcion}
                    onChange={(e) =>
                      cambiarCampo(index, "descripcion", e.target.value)
                    }
                  />

                  <Input
                    value={anuncio.precio}
                    onChange={(e) =>
                      cambiarCampo(index, "precio", e.target.value)
                    }
                  />

                  <Input
                    value={anuncio.ubicacion}
                    onChange={(e) =>
                      cambiarCampo(index, "ubicacion", e.target.value)
                    }
                  />

                  <Input
                    value={anuncio.dias}
                    onChange={(e) =>
                      cambiarCampo(index, "dias", e.target.value)
                    }
                  />

                  <Input
                    value={anuncio.horario}
                    onChange={(e) =>
                      cambiarCampo(index, "horario", e.target.value)
                    }
                  />

                  <Select
                    value={anuncio.stock}
                    onChange={(e) =>
                      cambiarCampo(index, "stock", e.target.value)
                    }
                  >
                    <option value="disponible">Disponible</option>
                    <option value="agotado">Agotado</option>
                  </Select>

                  <Button
                    bg="#4f46e5"
                    color="white"
                    borderRadius="99px"
                    fontWeight="700"
                    _hover={{ bg: "#4338ca" }}
                    onClick={() => guardarCambios(anuncio)}
                  >
                    Guardar cambios
                  </Button>

                  <Button
                    bg="red.500"
                    color="white"
                    borderRadius="99px"
                    fontWeight="700"
                    _hover={{ bg: "red.600" }}
                    onClick={() => eliminarAnuncio(anuncio)}
                  >
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
