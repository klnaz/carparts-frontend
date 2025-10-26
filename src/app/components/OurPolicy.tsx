import { Shield, Truck, Clock } from "lucide-react";

const OurPolicy = () => {
  const policies = [
    {
      icon: <Truck size={28} />,
      title: "Hızlı Teslimat",
      text: "Siparişiniz aynı gün kargoya verilir.",
    },
    {
      icon: <Shield size={28} />,
      title: "Güvenli Alışveriş",
      text: "Verileriniz %100 güvende.",
    },
    {
      icon: <Clock size={28} />,
      title: "7/24 Destek",
      text: "Her zaman buradayız.",
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-6 text-center mt-10">
      {policies.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="text-black">{item.icon}</div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
