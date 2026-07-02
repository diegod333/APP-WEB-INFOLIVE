"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Input,
  Button,
  Textarea,
  Select,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSesion } from "@/context/SessionContext";

export default function PublicarPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [stock, setStock] = useState("disponible");
  
  // ESTADOS PARA LA FOTO REAL
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [nombreFoto, setNombreFoto] = useState("");
  
  const [cargando, setCargando] = useState(false);
  const { usuario, cargandoSesion } = useSesion();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setHoraInicio(hora);
  }, []);

  useEffect(() => {
    if (!cargandoSesion && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargandoSesion, router]);

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setPrecio("");
    setUbicacion("");
    setHoraFin("");
    setStock("disponible");
    setArchivoFoto(null);
    setNombreFoto("");
  };

  const alCambiarFoto = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoFoto(archivo);
      setNombreFoto(archivo.name);
    }
  };

  const guardarAnuncio = async () => {
    if (!titulo || !descripcion || !ubicacion || !horaInicio || !horaFin || !stock) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa los campos principales antes de publicar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCargando(true);
    let urlImagenFinal = "";

    if (archivoFoto) {
      try {
        const formData = new FormData();
        formData.append("image", archivoFoto);

        const API_KEY_IMGBB = "ea564bb2b637eb9e143211c3f1353204"; 

        const respuestaImgBB = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`, {
          method: "POST",
          body: formData,
        });

        const datosImgBB = await respuestaImgBB.json();
        
        if (datosImgBB.success) {
          urlImagenFinal = datosImgBB.data.url; 
        } else {
          console.error("Error al subir a ImgBB:", datosImgBB);
        }
      } catch (err) {
        console.error("Error en la conexión con ImgBB:", err);
      }
    }

    
    const precioLimpio = precio.replace("$", "").trim();

    const anuncio = {
      id: crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).substring(2, 10),
      titulo,
      descripcion,
      precio: precioLimpio,
      ubicacion,
      horario: `${horaInicio} - ${horaFin}`,
      stock,
      imagen: urlImagenFinal, 
      dueno_anuncio: usuario?.nombre || "Anónimo",
      categoria: "comida", 
      createdAt: new Date().toLocaleDateString("es-CL")
    };

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
        toast({ 
          title: `Anuncio publicado`,
          description: "¡Publicado correctamente en el sistema!",
          status: "success",
          duration: 1500,
        });
        limpiarFormulario();
        setTimeout(() => {
          router.push("/");
        }, 1600);
      } else {
        toast({ title: `Error`, description: data.message || "No se pudo publicar.", status: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error de red", description: "No se pudo conectar con el servidor.", status: "error" });
    } finally {
      setCargando(false);
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
      <Container maxW="600px" py={8}>
        <VStack align="stretch" spacing={4}>
          <Link href="/">
            <Text fontSize="13px" color="#4f46e5" cursor="pointer">← Volver</Text>
          </Link>

          <Text fontSize="24px" fontWeight="800" color="gray.900">Publicar anuncio</Text>

          <Input
            placeholder="Título del anuncio (Ej: Completos gigantes, Empanadas)"
            bg="white"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <Textarea
            placeholder="Descripción del producto o ingredientes..."
            bg="white"
            value={descripcion}
            onChange={(e) => { if (e.target.value.length <= 500) setDescripcion(e.target.value); }}
            resize="none"
            rows={3}
          />

          <Box bg="white" p={4} borderRadius="12px" border="1px solid #e5e7eb">
            <Text fontSize="14px" fontWeight="700" color="gray.800" mb={2}>
              Foto del producto (Opcional)
            </Text>
            <HStack>
              <Button
                as="label"
                htmlFor="foto-input"
                cursor="pointer"
                bg="gray.100"
                _hover={{ bg: "gray.200" }}
                fontSize="14px"
              >
                📸 Seleccionar Foto
              </Button>
              <input
                id="foto-input"
                type="file"
                accept="image/*"
                onChange={alCambiarFoto}
                style={{ display: "none" }}
              />
              <Text fontSize="13px" color="gray.600" isTruncated maxW="250px">
                {nombreFoto || "Ningún archivo seleccionado"}
              </Text>
            </HStack>
          </Box>

          <Input
            placeholder="Precio (Ej: 2500)"
            bg="white"
            type="text"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <Select
            placeholder="Ubicación"
            bg="white"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          >
            <option value="2000">Edificio 2000</option>
            <option value="3000">Edificio 3000</option>
            <option value="4000">Edificio 4000</option>
            <option value="6000">Edificio 6000</option>
            <option value="7000">Edificio 7000</option>
            <option value="8000">Edificio 8000</option>
            <option value="9000">Edificio 9000</option>
            <option value="10000">Edificio 10000</option>
            <option value="14000">Edificio 14000</option>
          </Select>

          <Box bg="white" p={4} borderRadius="12px" border="1px solid #e5e7eb">
            <VStack align="stretch" spacing={3}>
              <Text fontSize="14px" fontWeight="700" color="gray.800">Horario disponible</Text>
              <HStack>
                <Input placeholder="Hora inicio" bg="white" value={horaInicio} readOnly />
                <Input type="time" bg="white" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
              </HStack>
            </VStack>
          </Box>

          <Select
            placeholder="Stock"
            bg="white"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          >
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
          </Select>

          <Button
            onClick={guardarAnuncio}
            isLoading={cargando}
            loadingText="Publicando anuncio..."
            bg="#4f46e5"
            color="white"
            borderRadius="99px"
            fontWeight="700"
            _hover={{ bg: "#4338ca" }}
          >
            Guardar anuncio
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
