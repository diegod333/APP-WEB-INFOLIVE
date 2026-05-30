import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "InfoLive",
  description: "Tablón de anuncios para informática",
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