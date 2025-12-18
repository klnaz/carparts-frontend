import type React from "react";
import "./globals.css";

import Navbar from "@components/Navbar";
import SubNavbar from "@components/SubNavbar";
import Footer from "@components/Footer";
import OurPolicy from "./components/OurPolicy";
import ClientProviders from "./ClientProviders";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={montserrat.className}>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <ClientProviders>
          <ToastContainer position="top-center" autoClose={3000} />

          <Navbar />
          <SubNavbar />

          <main className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-6">
            {children}
          </main>

          <OurPolicy />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
