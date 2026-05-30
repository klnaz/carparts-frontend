"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from "@/redux/api/addressApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MapPin, Edit2, Trash2, Plus, Building2 } from "lucide-react";

export interface Address {
  id: string;
  title: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

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

interface AddressInfoProps {
  onAddAddressClick: () => void;
}

const AddressInfo = ({ onAddAddressClick }: AddressInfoProps) => {
  const { data, isLoading, isError, error, refetch } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);

  // Edit form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAddressDetail, setEditAddressDetail] = useState("");
  const [editAddressLine2, setEditAddressLine2] = useState("");
  const [editZipCode, setEditZipCode] = useState("");

  const [editSelectedProvinceId, setEditSelectedProvinceId] = useState("");
  const [editSelectedDistrictId, setEditSelectedDistrictId] = useState("");
  const [editSelectedNeighborhoodId, setEditSelectedNeighborhoodId] = useState("");

  const [editDistricts, setEditDistricts] = useState<{ id: number; name: string }[]>([]);
  const [editNeighborhoods, setEditNeighborhoods] = useState<Neighborhood[]>([]);
  
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingNeighborhoods, setIsLoadingNeighborhoods] = useState(false);

  // Load provinces list on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const res = await fetch("https://api.turkiyeapi.dev/v1/provinces");
        const result = await res.json();
        if (result.status === "OK" && Array.isArray(result.data)) {
          const sorted = [...result.data].sort((a, b) =>
            a.name.localeCompare(b.name, "tr")
          );
          setProvinces(sorted);
        }
      } catch (err) {
        console.error("Provinces fetch error:", err);
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Parse backend data correctly
  useEffect(() => {
    if (!data) return;

    if (Array.isArray(data)) {
      setAddresses(data);
    } else if (Array.isArray((data as any).addresses)) {
      setAddresses((data as any).addresses);
    } else {
      setAddresses([]);
    }
  }, [data]);

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Bu adresi silmek istediğinizden emin misiniz?")) return;

    try {
      await deleteAddress(addressId).unwrap();
      toast.success("Adres başarıyla silindi.");
      refetch();
    } catch (err: unknown) {
      const fetchError = err as FetchBaseQueryError;
      toast.error(
        "status" in fetchError
          ? (fetchError.data as { message?: string })?.message ||
              "Adres silinirken bir hata oluştu."
          : "Adres silinirken bir hata oluştu."
      );
    }
  };

  const startEdit = async (address: Address) => {
    setEditingId(address.id);
    setEditTitle(address.title || "");
    setEditAddressLine2(address.addressLine2 || "");
    setEditZipCode(address.zipCode || "");

    let provId = "";
    let distId = "";
    let neighId = "";
    let detail = address.addressLine1;

    // Find province by name
    const matchedProv = provinces.find(
      (p) => p.name.toLocaleLowerCase("tr") === address.city.toLocaleLowerCase("tr")
    );

    if (matchedProv) {
      provId = matchedProv.id.toString();
      const sortedDists = [...matchedProv.districts].sort((a, b) =>
        a.name.localeCompare(b.name, "tr")
      );
      setEditDistricts(sortedDists);

      // Find district by name
      const matchedDist = matchedProv.districts.find(
        (d) => d.name.toLocaleLowerCase("tr") === address.state.toLocaleLowerCase("tr")
      );

      if (matchedDist) {
        distId = matchedDist.id.toString();
        setIsLoadingNeighborhoods(true);

        try {
          const res = await fetch(`https://api.turkiyeapi.dev/v1/districts/${distId}`);
          const result = await res.json();
          if (
            result.status === "OK" &&
            result.data &&
            Array.isArray(result.data.neighborhoods)
          ) {
            const sortedNeighs = [...result.data.neighborhoods].sort((a, b) =>
              a.name.localeCompare(b.name, "tr")
            );
            setEditNeighborhoods(sortedNeighs);

            // Attempt to find matching neighborhood at start of addressLine1
            const matchedNeigh = sortedNeighs.find((n) => {
              const prefix1 = `${n.name} Mah.`;
              return address.addressLine1.startsWith(prefix1) || address.addressLine1.startsWith(n.name);
            });

            if (matchedNeigh) {
              neighId = matchedNeigh.id.toString();
              const prefix1 = `${matchedNeigh.name} Mah. `;
              const prefix2 = `${matchedNeigh.name} `;
              if (address.addressLine1.startsWith(prefix1)) {
                detail = address.addressLine1.slice(prefix1.length);
              } else if (address.addressLine1.startsWith(prefix2)) {
                detail = address.addressLine1.slice(prefix2.length);
              }
            }
          }
        } catch (err) {
          console.error("Neighborhoods parse error:", err);
        } finally {
          setIsLoadingNeighborhoods(false);
        }
      }
    }

    setEditSelectedProvinceId(provId);
    setEditSelectedDistrictId(distId);
    setEditSelectedNeighborhoodId(neighId);
    setEditAddressDetail(detail);
  };

  const handleProvinceChange = (provinceId: string) => {
    setEditSelectedProvinceId(provinceId);
    setEditSelectedDistrictId("");
    setEditSelectedNeighborhoodId("");
    setEditDistricts([]);
    setEditNeighborhoods([]);

    const prov = provinces.find((p) => p.id.toString() === provinceId);
    if (prov && Array.isArray(prov.districts)) {
      const sorted = [...prov.districts].sort((a, b) =>
        a.name.localeCompare(b.name, "tr")
      );
      setEditDistricts(sorted);
    }
  };

  // Fetch edit neighborhoods when district changes
  useEffect(() => {
    if (!editSelectedDistrictId) {
      setEditNeighborhoods([]);
      return;
    }

    const fetchEditNeighborhoods = async () => {
      setIsLoadingNeighborhoods(true);
      try {
        const res = await fetch(
          `https://api.turkiyeapi.dev/v1/districts/${editSelectedDistrictId}`
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
          setEditNeighborhoods(sorted);
        }
      } catch (err) {
        console.error("Neighborhoods load error:", err);
      } finally {
        setIsLoadingNeighborhoods(false);
      }
    };
    fetchEditNeighborhoods();
  }, [editSelectedDistrictId]);

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    if (!editTitle) {
      toast.error("Lütfen bir başlık girin.");
      return;
    }
    if (!editSelectedProvinceId) {
      toast.error("Lütfen bir il seçin.");
      return;
    }
    if (!editSelectedDistrictId) {
      toast.error("Lütfen bir ilçe seçin.");
      return;
    }
    if (!editSelectedNeighborhoodId) {
      toast.error("Lütfen bir mahalle seçin.");
      return;
    }
    if (!editAddressDetail.trim()) {
      toast.error("Lütfen açık adres bilgisini doldurun.");
      return;
    }

    const provName = provinces.find((p) => p.id.toString() === editSelectedProvinceId)?.name || "";
    const distName = editDistricts.find((d) => d.id.toString() === editSelectedDistrictId)?.name || "";
    const neighName = editNeighborhoods.find((n) => n.id.toString() === editSelectedNeighborhoodId)?.name || "";

    const fullAddressLine1 = `${neighName} Mah. ${editAddressDetail.trim()}`;

    try {
      await updateAddress({
        addressId: editingId,
        body: {
          title: editTitle,
          addressLine1: fullAddressLine1,
          addressLine2: editAddressLine2 || undefined,
          city: provName,
          state: distName,
          zipCode: editZipCode || undefined,
          country: "Türkiye",
        },
      }).unwrap();

      toast.success("Adres başarıyla güncellendi.");
      setEditingId(null);
      refetch();
    } catch (err: unknown) {
      const fetchError = err as FetchBaseQueryError;
      toast.error(
        "status" in fetchError
          ? (fetchError.data as { message?: string })?.message ||
              "Adres güncellenirken bir hata oluştu."
          : "Adres güncellenirken bir hata oluştu."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-400">Adresler yükleniyor...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-900">
        <p className="text-sm text-red-650 font-bold">Adresler yüklenirken bir hata oluştu.</p>
        <p className="text-xs text-zinc-500 mt-1.5">
          {(error as FetchBaseQueryError).data
            ? ((error as FetchBaseQueryError).data as { message?: string })?.message
            : "Lütfen daha sonra tekrar deneyiniz."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-650 flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-red-650" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Adres Bilgilerim</h2>
            <p className="text-xs text-zinc-500">
              Sipariş teslimatı için kayıtlı adreslerinizi buradan yönetin.
            </p>
          </div>
        </div>

        <button
          onClick={onAddAddressClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-3 shadow-md shadow-red-200 hover:shadow-red-300 transition-all duration-200 cursor-pointer select-none"
        >
          <Plus className="w-4 h-4" />
          Yeni Adres Ekle
        </button>
      </div>

      {/* Address cards list */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-400 shadow-sm">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-zinc-800">Kayıtlı Adres Bulunmamaktadır</p>
            <p className="text-xs text-zinc-500">Henüz bir kargo teslimat adresi tanımlamadınız.</p>
          </div>
          <button
            onClick={onAddAddressClick}
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold px-4 py-2.5 border border-zinc-200 shadow-sm transition-all select-none cursor-pointer"
          >
            <Plus className="w-4 h-4 text-red-600" />
            Adres Ekle
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => {
            const isEditing = editingId === address.id;

            return (
              <div
                key={address.id}
                className={`relative rounded-2xl border p-5 shadow-sm transition-all duration-300 flex flex-col justify-between ${
                  isEditing
                    ? "border-red-500 bg-white col-span-1 md:col-span-2 shadow-lg"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
                }`}
              >
                {/* Normal view mode */}
                {!isEditing && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-red-600" />
                          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                            {address.title || "Adres"}
                          </h3>
                        </div>
                        <span className="text-[10px] bg-zinc-50 px-2.5 py-1 rounded-full text-zinc-500 font-semibold border border-zinc-200 select-none">
                          {address.country || "Türkiye"}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-700 text-left">
                        <p className="font-semibold text-zinc-850 leading-relaxed">
                          {address.addressLine1}
                        </p>
                        {address.addressLine2 && (
                          <p className="text-zinc-400 text-[11px] italic">
                            Not: {address.addressLine2}
                          </p>
                        )}
                        <p className="text-zinc-600 font-medium">
                          {address.state} / {address.city}
                        </p>
                        {address.zipCode && (
                          <p className="text-zinc-450 text-[10px] font-mono">
                            PK: {address.zipCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(address)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-[11px] font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer shadow-sm select-none"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-zinc-450" />
                        Düzenle
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-500 transition-colors select-none cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Sil
                      </button>
                    </div>
                  </>
                )}

                {/* Edit inline view mode */}
                {isEditing && (
                  <div className="space-y-5">
                    <div className="pb-2 border-b border-zinc-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">
                        Adresi Düzenle
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-medium">Kayıtlı Adres Düzenleniyor</span>
                    </div>

                    <div className="space-y-4 text-left">
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-zinc-600">Adres Başlığı</label>
                        <input
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm"
                          placeholder="Adres başlığı (örn: Ev)"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>

                      {/* Province & District dropdowns */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-zinc-600">İl</label>
                          <select
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm cursor-pointer"
                            value={editSelectedProvinceId}
                            onChange={(e) => handleProvinceChange(e.target.value)}
                            disabled={isLoadingProvinces}
                          >
                            <option value="">{isLoadingProvinces ? "Yükleniyor..." : "İl Seçin"}</option>
                            {provinces.map((prov) => (
                              <option key={prov.id} value={prov.id}>
                                {prov.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-zinc-600">İlçe</label>
                          <select
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm cursor-pointer"
                            value={editSelectedDistrictId}
                            onChange={(e) => {
                              setEditSelectedDistrictId(e.target.value);
                              setEditSelectedNeighborhoodId("");
                            }}
                            disabled={!editSelectedProvinceId}
                          >
                            <option value="">İlçe Seçin</option>
                            {editDistricts.map((dist) => (
                              <option key={dist.id} value={dist.id}>
                                {dist.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Neighborhood dropdown */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-zinc-600 flex items-center justify-between">
                          <span>Mahalle</span>
                          {isLoadingNeighborhoods && (
                            <span className="text-[9px] text-red-650 animate-pulse">Yükleniyor...</span>
                          )}
                        </label>
                        <select
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm cursor-pointer"
                          value={editSelectedNeighborhoodId}
                          onChange={(e) => setEditSelectedNeighborhoodId(e.target.value)}
                          disabled={!editSelectedDistrictId || isLoadingNeighborhoods}
                        >
                          <option value="">
                            {isLoadingNeighborhoods ? "Mahalleler yükleniyor..." : "Mahalle Seçin"}
                          </option>
                          {editNeighborhoods.map((neigh) => (
                            <option key={neigh.id} value={neigh.id}>
                              {neigh.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Address detail */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-zinc-600">Açık Adres (Sokak, Bina No, Daire)</label>
                        <textarea
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm min-h-[60px] resize-y"
                          placeholder="Açık adres detayları"
                          value={editAddressDetail}
                          onChange={(e) => setEditAddressDetail(e.target.value)}
                          disabled={!editSelectedNeighborhoodId}
                        />
                      </div>

                      {/* Address detail 2 & ZipCode */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-zinc-650">Not / Ek Detay (Opsiyonel)</label>
                          <input
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm"
                            placeholder="Zile basmayın vb."
                            value={editAddressLine2}
                            onChange={(e) => setEditAddressLine2(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-zinc-650">Posta Kodu (Opsiyonel)</label>
                          <input
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm"
                            placeholder="34000"
                            value={editZipCode}
                            onChange={(e) => setEditZipCode(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={handleSaveEdit}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-[11px] font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed select-none cursor-pointer shadow-md shadow-red-200"
                      >
                        {isUpdating ? "Güncelleniyor..." : "Kaydet"}
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-500 px-4 py-2.5 text-[11px] font-bold transition-colors select-none cursor-pointer shadow-sm"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddressInfo;
