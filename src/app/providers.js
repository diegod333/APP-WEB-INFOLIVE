"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "@/context/SessionContext";

export function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}