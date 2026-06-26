"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [usuario, setUsuario] = useState(null); // { codigo, nombre }
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("infolive_sesion");
      if (guardado) {
        setUsuario(JSON.parse(guardado));
      }
    } catch {
      // Si hay error con localStorage, ignorar
    } finally {
      setCargandoSesion(false);
    }
  }, []);

  const iniciarSesion = (datos) => {
    setUsuario(datos);
    localStorage.setItem("infolive_sesion", JSON.stringify(datos));
  };

 const cerrarSesion = async () => {
  const usuarioActual = usuario;

  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: usuarioActual?.nombre || "Desconocido",
        accion: "LOGOUT",
        detalle: "Cierre de sesión",
      }),
    });
  } catch (error) {
    console.error("Error registrando logout:", error);
  } finally {
    setUsuario(null);
    localStorage.removeItem("infolive_sesion");
  }
};
  return (
    <SessionContext.Provider value={{ usuario, cargandoSesion, iniciarSesion, cerrarSesion }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SessionContext);
}
