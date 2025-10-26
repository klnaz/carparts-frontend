"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreateAddressMutation } from "@/redux/api/addressApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface AddAddressFormProps {
  onAddressAdded: () => void;
  onCancel: () => void;
}

const AddAddressForm = ({
  onAddressAdded,
  onCancel,
}: AddAddressFormProps): JSX.Element => {
  const [createAddress, { isLoading }] = useCreateAddressMutation();

  const [title, setTitle] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();
    try {
      await createAddress({
        title,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
      }).unwrap();
      toast.success("Adres başarıyla eklendi.");
      onAddressAdded();
    } catch (err: unknown) {
      const fetchError = err as FetchBaseQueryError;
      toast.error(
        "status" in fetchError
          ? (fetchError.data as { message?: string })?.message ||
              "Adres eklenirken bir hata oluştu."
          : "Adres eklenirken bir hata oluştu."
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Adres Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Adres Satırı 1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Adres Satırı 2 (Opsiyonel)"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Şehir"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Eyalet / İl"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Posta Kodu"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Ülke"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-black text-white text-xs py-2 px-4 rounded-md hover:bg-black transition-colors duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Ekleniyor..." : "Adres Ekle"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 text-xs py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
