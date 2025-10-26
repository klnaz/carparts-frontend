"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    toast.success("Abonelik başarılı! Teşekkür ederiz.");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-2">Bültenimize Katılın</h2>
      <p className="text-gray-600 text-sm mb-4">
        Yeni ürünlerden ve kampanyalardan ilk siz haberdar olun!
      </p>
      <form onSubmit={handleSubscribe} className="flex w-full max-w-md">
        <input
          type="email"
          placeholder="E-mail adresiniz"
          className="flex-grow border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 rounded-r-md hover:bg-gray-800"
        >
          Gönder
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
