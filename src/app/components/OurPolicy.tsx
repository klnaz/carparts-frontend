"use client";

import {
  ShieldCheck,
  CreditCard,
  Truck,
  RefreshCcw,
  Headphones,
} from "lucide-react";

const OurPolicy = () => {
  const policies = [
    {
      icon: <ShieldCheck size={32} />,
      title: "Güvenli Alışveriş",
      text: "256 Bit SSL Sertifikası ile koruma altında.",
    },
    {
      icon: <CreditCard size={32} />,
      title: "Kolay Ödeme",
      text: "Kredi kartı veya banka kartı ile güvenli ödeme.",
    },
    {
      icon: <Truck size={32} />,
      title: "Aynı Gün Kargo",
      text: "12:00'a kadar verilen siparişler aynı gün kargoda.",
    },
    {
      icon: <RefreshCcw size={32} />,
      title: "Kolay İade ve Değişim",
      text: "7 gün içinde kolay iade ve değişim imkanı.",
    },
    {
      icon: <Headphones size={32} />,
      title: "Müşteri Hizmetleri",
      text: "Her zaman size yardımcı olmaktan mutluluk duyarız.",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center py-16 mt-10 bg-gray-50 rounded-2xl">
      {policies.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 text-gray-700 hover:scale-105 transition-transform duration-300"
        >
          <div className="text-black mb-3">{item.icon}</div>
          <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
          <p className="text-xs md:text-sm text-gray-500">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
