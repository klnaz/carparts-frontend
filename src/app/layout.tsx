// src/app/layout.tsx
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubNavbar from "@components/SubNavbar";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";

import { Montserrat } from "next/font/google";
import OurPolicy from "./components/OurPolicy";

// Montserrat fontunu yükle
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={montserrat.className}>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Provider store={store}>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            pauseOnHover
            draggable
          />

          <Navbar />
          <SubNavbar />
          <main className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-6">
            {children}
          </main>
                    <OurPolicy />

          <Footer />
        </Provider>
      </body>
    </html>
  );
}
