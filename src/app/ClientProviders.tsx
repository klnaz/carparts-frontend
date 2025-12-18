"use client";

import type React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import AuthBootstrap from "./AuthBootstrap";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}
