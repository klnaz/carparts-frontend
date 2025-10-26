// src/app/providers.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store"; // proje içinde store burada olmalı
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* ToastContainer burada global olarak yüklensin */}
      <ToastContainer position="top-right" newestOnTop />
      {children}
    </Provider>
  );
}
