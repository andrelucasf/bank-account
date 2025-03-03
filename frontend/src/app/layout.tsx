import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "Bank Account App",
  description: "Gerenciamento de conta bancária",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
