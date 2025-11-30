"use client";

import React from "react";
import BestSellers from "@components/BestSeller";
import Deals from "@components/Deals";

export default function HomePage() {
  return (
    <div className="mt-8">
      <Deals />
      <BestSellers />
    </div>
  );
}
