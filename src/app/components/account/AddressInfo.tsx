"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from "@/redux/api/addressApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FiMapPin, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

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

interface AddressInfoProps {
  onAddAddressClick: () => void;
}

const AddressInfo = ({ onAddAddressClick }: AddressInfoProps) => {
  const { data, isLoading, isError, error, refetch } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const [addresses, setAddresses] = useState<Address[]>([]);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Address> | null>(null);

  // ⭐ BACKEND'DEN NE GELİRSE GELSİN DOĞRU ŞEKİLDE PARSE EDİYOR
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

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setEditForm({ ...address });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange = (field: keyof Address, value: string) => {
    setEditForm((prev) =>
      prev ? { ...prev, [field]: value } : { [field]: value } as Partial<Address>
    );
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm) return;

    try {
      await updateAddress({
        addressId: editingId,
        body: {
          title: editForm.title,
          addressLine1: editForm.addressLine1,
          addressLine2: editForm.addressLine2,
          city: editForm.city,
          state: editForm.state,
          zipCode: editForm.zipCode,
          country: editForm.country,
        },
      }).unwrap();

      toast.success("Adres başarıyla güncellendi.");
      setEditingId(null);
      setEditForm(null);
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
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500">Adresler yükleniyor...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-white rounded-xl border border-red-100 shadow-sm">
        <p className="text-xs text-red-500">
          {(error as FetchBaseQueryError).data
            ? ((error as FetchBaseQueryError).data as { message?: string })?.message
            : "Adresler yüklenirken bir hata oluştu."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
      {/* Başlık */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gray-900 text-white">
            <FiMapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Adres Bilgilerim</h2>
            <p className="text-[11px] text-gray-500">
              Sipariş teslimatında kullanacağınız adresleri yönetin.
            </p>
          </div>
        </div>

        <button
          onClick={onAddAddressClick}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white text-xs px-3 py-2 hover:bg-black transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Yeni Adres Ekle
        </button>
      </div>

      {/* Adresler */}
      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 flex flex-col items-center justify-center text-center gap-2">
          <FiMapPin className="w-6 h-6 text-gray-400" />
          <p className="text-xs text-gray-600 mb-1">Henüz kayıtlı adresiniz yok.</p>
          <button
            onClick={onAddAddressClick}
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white text-xs px-3 py-2 hover:bg-black transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Adres Ekle
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => {
            const isEditing = editingId === address.id;

            return (
              <div
                key={address.id}
                className="group relative rounded-lg border border-gray-200 bg-gray-50/80 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-150"
              >
                {/* Normal Görünüm */}
                {!isEditing && (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <FiMapPin className="w-4 h-4 text-gray-500" />
                          {address.title || "Adres"}
                        </p>
                        <p className="text-[11px] text-gray-700">
                          {address.addressLine1}
                          {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                        </p>
                        <p className="text-[11px] text-gray-700">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-[11px] text-gray-500">{address.country}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(address)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        <FiEdit2 className="w-3 h-3" />
                        Düzenle
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Sil
                      </button>
                    </div>
                  </>
                )}

                {/* Edit Modu */}
                {isEditing && editForm && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <input
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-800"
                        placeholder="Adres başlığı"
                        value={editForm.title ?? ""}
                        onChange={(e) => handleEditChange("title", e.target.value)}
                      />
                      <input
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-800"
                        placeholder="Adres satırı 1"
                        value={editForm.addressLine1 ?? ""}
                        onChange={(e) =>
                          handleEditChange("addressLine1", e.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-800"
                        placeholder="Adres satırı 2 (opsiyonel)"
                        value={editForm.addressLine2 ?? ""}
                        onChange={(e) =>
                          handleEditChange("addressLine2", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-800"
                          placeholder="Şehir"
                          value={editForm.city ?? ""}
                          onChange={(e) =>
                            handleEditChange("city", e.target.value)
                          }
                        />
                        <input
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-800"
                          placeholder="İl / Eyalet"
                          value={editForm.state ?? ""}
                          onChange={(e) =>
                            handleEditChange("state", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-800"
                          placeholder="Posta Kodu"
                          value={editForm.zipCode ?? ""}
                          onChange={(e) =>
                            handleEditChange("zipCode", e.target.value)
                          }
                        />
                        <input
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-800"
                          placeholder="Ülke"
                          value={editForm.country ?? ""}
                          onChange={(e) =>
                            handleEditChange("country", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={handleSaveEdit}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-900 text-white px-3 py-1.5 text-[11px] font-medium hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Kaydediliyor..." : "Kaydet"}
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 hover:text-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
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
