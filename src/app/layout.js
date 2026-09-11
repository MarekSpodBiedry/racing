import "./globals.css";

export const metadata = {
  title: "MatGeo Racing",
  description:
    "Przeglądarkowa gra wyścigowa 2D w Next.js i Matter.js.",
};

/**
 * Główny layout wspólny dla wszystkich tras aplikacji.
 *
 * @param {{ children: React.ReactNode }} props - Zawartość aktualnie otwartej trasy.
 * @returns {React.JSX.Element} Szkielet dokumentu HTML z ustawionym językiem i stylami globalnymi.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
