import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "InfoLive",
  description: "¡Comida para Informática!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}