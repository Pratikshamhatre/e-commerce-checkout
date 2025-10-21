import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const inter = Inter({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["greek"],
});

export const metadata: Metadata = {
  title: "E-commerce",
  description: "E-commerce checkout page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
