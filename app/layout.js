import "./globals.css";

export const metadata = {
  title: "MatGeo Racing",
  description:
    "Przeglądarkowa gra wyścigowa 2D w Next.js i Matter.js.",
};

/**
 * Root layout for every route in the application.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
