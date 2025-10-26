"use client";

import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative w-full h-[400px]">
      <Image
        src="/banner.jpg"
        alt="Ana Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white">
        <h1 className="text-4xl font-bold">Hakan Oto Yedek Parça</h1>
        <p className="text-lg mt-2">En kaliteli parçaları uygun fiyata!</p>
      </div>
    </div>
  );
};

export default Banner;
