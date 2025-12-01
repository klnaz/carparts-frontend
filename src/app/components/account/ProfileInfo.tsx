"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateUserMutation,
  ApiUser,
} from "@/redux/api/userApi";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";

const ProfileInfo: React.FC = () => {
  const { data: profileData, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [phoneError, setPhoneError] = useState(false);

  // 🟦 DEBUG — Backend'ten gelen normalize edilmiş veriyi gör
  useEffect(() => {
    if (!profileData) return;

    console.log("🟦 DEBUG — profileData:", profileData);

    setName(profileData.first_name ?? "");
    setSurname(profileData.last_name ?? "");
    setEmail(profileData.email ?? "");
    setPhone(profileData.phone ?? "");
  }, [profileData]);

  // 📱 Telefonu 05367378574 formatına zorunlu yap
  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // sadece rakamlar
    const regex = /^0[5][0-9]{9}$/; // 05XXXXXXXXX formatı

    setPhone(cleaned);
    setPhoneError(cleaned.length > 0 && !regex.test(cleaned));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (phoneError) {
      toast.error("Telefon numarasını doğru formatta giriniz (Örn: 05367378574).");
      return;
    }

    try {
      if (!profileData) return;

      const payload: Partial<ApiUser> = {
        id: profileData.id,
        first_name: name,
        last_name: surname,
        email,
        phone,
      };

      await updateProfile(payload).unwrap();
      toast.success("Profil başarıyla güncellendi.");
    } catch (err) {
      console.error("❌ Profil güncelleme hatası:", err);
      toast.error("Profil güncellenirken bir hata oluştu.");
    }
  };

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500">Profil bilgileri yükleniyor...</p>
      </div>
    );
  }

  // --- ERROR ---
  if (isError || !profileData) {
    return (
      <div className="p-4 bg-white rounded-xl border border-red-100 shadow-sm">
        <p className="text-xs text-red-500">Profil bilgileri alınamadı.</p>
      </div>
    );
  }

  const initials = (name?.[0] ?? "") + (surname?.[0] ?? "");

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
            {initials.trim() || <FiUser className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Profil Bilgilerim</h2>
            <p className="text-[12px] text-gray-500">
              Hesap bilgilerinizi görüntüleyin ve güncelleyin.
            </p>
          </div>
        </div>

        {email && (
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3 py-1">
            <FiMail className="w-4 h-4 text-gray-500" />
            <span className="text-[12px] text-gray-700 truncate max-w-[200px]">
              {email}
            </span>
          </div>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        {/* AD & SOYAD */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Ad */}
          <div>
            <label className="block text-xs font-medium text-gray-700">Ad</label>
            <div className="relative mt-1">
              <FiUser className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded-md border pl-8 px-2 py-2 text-xs border-gray-300 focus:ring-1 focus:ring-gray-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Soyad */}
          <div>
            <label className="block text-xs font-medium text-gray-700">Soyad</label>
            <div className="relative mt-1">
              <FiUser className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded-md border pl-8 px-2 py-2 text-xs border-gray-300 focus:ring-1 focus:ring-gray-900"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* E-POSTA & TELEFON */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700">E-posta</label>
            <div className="relative mt-1">
              <FiMail className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full rounded-md border pl-8 px-2 py-2 text-xs border-gray-300 focus:ring-1 focus:ring-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Telefon (05XXXXXXXXX)
            </label>
            <div className="relative mt-1">
              <FiPhone className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                maxLength={11}
                className={`w-full rounded-md border pl-8 px-2 py-2 text-xs focus:ring-1 ${
                  phoneError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-gray-900"
                }`}
                value={phone}
                onChange={(e) => validatePhone(e.target.value)}
                placeholder="05367378574"
              />
            </div>

            {phoneError && (
              <p className="text-[11px] text-red-500 mt-1">
                Telefon formatı hatalı. Örnek: 05367378574
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-gray-900 text-white px-5 py-2 rounded-md text-xs font-medium hover:bg-black disabled:opacity-50"
          >
            {isUpdating ? "Kaydediliyor..." : "Bilgileri Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
