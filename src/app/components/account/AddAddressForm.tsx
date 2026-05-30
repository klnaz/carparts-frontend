"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateAddressMutation } from "@/redux/api/addressApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowLeft } from "lucide-react";

interface Province {
  id: number;
  name: string;
  districts: {
    id: number;
    name: string;
  }[];
}

interface Neighborhood {
  id: number;
  name: string;
}

interface AddAddressFormProps {
  onAddressAdded: () => void;
  onCancel: () => void;
}

const AddAddressForm = ({
  onAddressAdded,
  onCancel,
}: AddAddressFormProps) => {
  const [createAddress, { isLoading }] = useCreateAddressMutation();

  const [title, setTitle] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Select states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState("");

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingNeighborhoods, setIsLoadingNeighborhoods] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const res = await fetch("https://api.turkiyeapi.dev/v1/provinces");
        const result = await res.json();
        if (result.status === "OK" && Array.isArray(result.data)) {
          const sorted = [...result.data].sort((a, b) =>
            a.name.localeCompare(b.name, "tr")
          );
          setProvinces(sorted);
        } else {
          toast.error("İl listesi yüklenemedi.");
        }
      } catch (err) {
        console.error("Provinces fetch error:", err);
        toast.error("İl listesi alınırken bağlantı hatası oluştu.");
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Handle province change
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId("");
    setSelectedNeighborhoodId("");
    setDistricts([]);
    setNeighborhoods([]);

    const prov = provinces.find((p) => p.id.toString() === provinceId);
    if (prov && Array.isArray(prov.districts)) {
      const sorted = [...prov.districts].sort((a, b) =>
        a.name.localeCompare(b.name, "tr")
      );
      setDistricts(sorted);
    }
  };

  // Fetch neighborhoods when district is selected
  useEffect(() => {
    if (!selectedDistrictId) {
      setNeighborhoods([]);
      return;
    }

    const fetchNeighborhoods = async () => {
      setIsLoadingNeighborhoods(true);
      try {
        const res = await fetch(
          `https://api.turkiyeapi.dev/v1/districts/${selectedDistrictId}`
        );
        const result = await res.json();
        if (
          result.status === "OK" &&
          result.data &&
          Array.isArray(result.data.neighborhoods)
        ) {
          const sorted = [...result.data.neighborhoods].sort((a, b) =>
            a.name.localeCompare(b.name, "tr")
          );
          setNeighborhoods(sorted);
        } else {
          toast.error("Mahalle listesi yüklenemedi.");
        }
      } catch (err) {
        console.error("Neighborhoods fetch error:", err);
        toast.error("Mahalle listesi alınırken bağlantı hatası oluştu.");
      } finally {
        setIsLoadingNeighborhoods(false);
      }
    };
    fetchNeighborhoods();
  }, [selectedDistrictId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (!title) {
      toast.error("Lütfen adresiniz için bir başlık girin (örn: Evim, Ofis).");
      return;
    }
    if (!selectedProvinceId) {
      toast.error("Lütfen bir il seçin.");
      return;
    }
    if (!selectedDistrictId) {
      toast.error("Lütfen bir ilçe seçin.");
      return;
    }
    if (!selectedNeighborhoodId) {
      toast.error("Lütfen bir mahalle seçin.");
      return;
    }
    if (!addressDetail.trim()) {
      toast.error("Lütfen açık adresinizi yazın.");
      return;
    }

    const provName = provinces.find((p) => p.id.toString() === selectedProvinceId)?.name || "";
    const distName = districts.find((d) => d.id.toString() === selectedDistrictId)?.name || "";
    const neighName = neighborhoods.find((n) => n.id.toString() === selectedNeighborhoodId)?.name || "";

    const fullAddressLine1 = `${neighName} Mah. ${addressDetail.trim()}`;

    try {
      await createAddress({
        title,
        addressLine1: fullAddressLine1,
        addressLine2: addressLine2 || undefined,
        city: provName,
        state: distName,
        zipCode: zipCode || undefined,
        country: "Türkiye",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-805 hover:bg-zinc-105 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-left">
            <h2 className="text-lg font-bold text-zinc-900">Yeni Adres Ekle</h2>
            <p className="text-xs text-zinc-500">
              Türkiye geneline teslimat yapmaktayız. İl, ilçe ve mahalle seçerek adresinizi kaydedin.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Adres Başlığı */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-zinc-600">Adres Başlığı</label>
          <input
            type="text"
            placeholder="Örn: Ev Adresim, İş Yerim"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
            required
          />
        </div>

        {/* İl & İlçe Seçimi */}
        <div className="grid gap-5 md:grid-cols-2 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">İl (Şehir)</label>
            <select
              value={selectedProvinceId}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 cursor-pointer"
              disabled={isLoadingProvinces}
            >
              <option value="">{isLoadingProvinces ? "Yükleniyor..." : "İl Seçiniz"}</option>
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">İlçe</label>
            <select
              value={selectedDistrictId}
              onChange={(e) => {
                setSelectedDistrictId(e.target.value);
                setSelectedNeighborhoodId("");
              }}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 cursor-pointer"
              disabled={!selectedProvinceId}
            >
              <option value="">İlçe Seçiniz</option>
              {districts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mahalle Seçimi */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-zinc-600 flex items-center justify-between">
            <span>Mahalle</span>
            {isLoadingNeighborhoods && (
              <span className="text-[10px] text-red-650 animate-pulse">Mahalleler listeleniyor...</span>
            )}
          </label>
          <select
            value={selectedNeighborhoodId}
            onChange={(e) => setSelectedNeighborhoodId(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 cursor-pointer"
            disabled={!selectedDistrictId || isLoadingNeighborhoods}
          >
            <option value="">
              {isLoadingNeighborhoods ? "Mahalleler yükleniyor..." : "Mahalle Seçiniz"}
            </option>
            {neighborhoods.map((neigh) => (
              <option key={neigh.id} value={neigh.id}>
                {neigh.name}
              </option>
            ))}
          </select>
        </div>

        {/* Açık Adres (Sokak / Bina vb.) */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-zinc-600">
            Açık Adres (Sokak, Bina No, Daire)
          </label>
          <textarea
            placeholder="Örn: Barbaros Bulvarı, Yıldız Sk. No:14 Daire:3"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 min-h-[90px] resize-y"
            required
            disabled={!selectedNeighborhoodId}
          />
        </div>

        {/* Adres Detayı 2 & Posta Kodu */}
        <div className="grid gap-5 md:grid-cols-2 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-650">
              Adres Notu / Ek Detay (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: Zile basmayın vb."
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-650">Posta Kodu (Opsiyonel)</label>
            <input
              type="text"
              placeholder="Örn: 34349"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Ülke (Kilitli / Bilgilendirme) */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-zinc-600">Ülke</label>
          <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-500 flex items-center justify-between select-none">
            <span className="font-semibold text-zinc-750">Türkiye</span>
            <span className="text-[10px] text-zinc-400">Sadece Türkiye sınırları içerisinde teslimat yapılmaktadır.</span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 hover:shadow-red-300 transition-all duration-250 cursor-pointer disabled:opacity-50 select-none text-center"
          >
            {isLoading ? "Adres Ekleniyor..." : "Adres Bilgisini Kaydet"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer select-none text-center shadow-sm"
          >
            Vazgeç
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
