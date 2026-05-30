"use client";

import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";

const navItems = [
  {
    section: "Principal",
    items: [{ id: "inicio", label: "Inicio" }],
  },
  {
    section: "Anuncios",
    items: [
      { id: "academico", label: "Académico" },
      { id: "comida", label: "Comida" },
      { id: "eventos", label: "Eventos" },
      { id: "juegos", label: "Juegos" },
      { id: "convenios", label: "Convenios" },
    ],
  },
  {
    section: "Mi cuenta",
    items: [
      { id: "guardados", label: "Guardados" },
      { id: "notificaciones", label: "Notificaciones" },
    ],
  },
];

export default function MenuLateral({
  isOpen,
  onClose,
  activeCategory,
  setActiveCategory,
}) {
  const handleSelect = (id) => {
    setActiveCategory(id);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay bg="blackAlpha.300" />

      <DrawerContent maxW="260px" bg="white" shadow="xl">
        <DrawerCloseButton top={4} right={4} color="gray.400" />

        <DrawerBody px={3} py={5}>
          <VStack align="stretch" spacing={0}>
            <HStack spacing={3} px={2} mb={5}>
              <Box
                w="32px"
                h="32px"
                borderRadius="8px"
                bg="#4f46e5"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="800" fontSize="14px">
                  IL
                </Text>
              </Box>

              <VStack align="start" spacing={0}>
                <Text fontWeight="700" fontSize="15px" color="gray.900">
                  InfoLive
                </Text>
                <Text fontSize="10px" color="gray.400">
                  INFORMÁTICA UACH
                </Text>
              </VStack>
            </HStack>

            {navItems.map((section) => (
              <Box key={section.section} mb={4}>
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="0.07em"
                  px={3}
                  mb={1}
                >
                  {section.section}
                </Text>

                {section.items.map((item) => {
                  const isActive = activeCategory === item.id;

                  return (
                    <HStack
                      key={item.id}
                      px={3}
                      py={2}
                      borderRadius="10px"
                      spacing={2}
                      bg={isActive ? "#eef2ff" : "transparent"}
                      cursor="pointer"
                      _hover={{ bg: isActive ? "#eef2ff" : "gray.50" }}
                      onClick={() => handleSelect(item.id)}
                      transition="background 0.12s"
                    >
                      <Text
                        flex="1"
                        fontSize="13px"
                        fontWeight={isActive ? "600" : "500"}
                        color={isActive ? "#4f46e5" : "gray.700"}
                      >
                        {item.label}
                      </Text>
                    </HStack>
                  );
                })}
              </Box>
            ))}

            <Divider my={2} />

            <HStack px={3} py={2} spacing={3}>
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

              <VStack align="start" spacing={0}>
                <Text fontSize="13px" fontWeight="600" color="gray.800">
                  Juan Reyes
                </Text>
                <Text fontSize="11px" color="gray.400">
                  Informática 3°
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}