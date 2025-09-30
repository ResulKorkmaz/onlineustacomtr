import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OnlineUsta - İhtiyacınız olan ustayı bulun",
    template: "%s | OnlineUsta",
  },
  description: "İlan oluşturun, teklifleri görün, güvenilir ustalarla çalışın",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
