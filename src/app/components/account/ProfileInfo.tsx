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

  // Gelen veriyi state'e yaz
  useEffect(() => {
    if (!profileData) return;

    setName(profileData.first_name ?? "");
    setSurname(profileData.last_name ?? "");
    setEmail(profileData.email ?? "");
    setPhone(profileData.phone ?? "");
  }, [profileData]);

  // Telefonu 05367378574 formatına zorunlu yap
  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // sadece rakamlar
    const regex = /^0[5][0-9]{9}$/;           // 05XXXXXXXXX

    setPhone(cleaned);
    setPhoneError(cleaned.length > 0 && !regex.test(cleaned));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (phoneError) {
      toast.error("Telefon numarasını doğru formatta giriniz. Örn: 05367378574");
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
      toast.error("Profil güncellenirken bir hata oluştu.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500">Profil bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div className="p-4 bg-white rounded-xl border border-red-100 shadow-sm">
        <p className="text-xs text-red-500">
          Profil bilgileri alınamadı.
        </p>
      </div>
    );
  }

  const initials =
    (name?.[0] ?? "") + (surname?.[0] ?? "");

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
      {/* Başlık + mini profil kartı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
            {initials.trim() || <FiUser className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {name || surname ? `${name} ${surname}` : "Profil Bilgilerim"}
            </h2>
            <p className="text-[11px] text-gray-500">
              Hesap bilgilerinizi görüntüleyin ve güncelleyin.
            </p>
          </div>
        </div>

        {email && (
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3 py-1">
            <FiMail className="w-3 h-3 text-gray-500" />
            <span className="text-[11px] text-gray-700 truncate max-w-[180px]">
              {email}
            </span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid gap-3 md:grid-cols-2">
          {/* Ad */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-700">
              Ad
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                <FiUser className="w-3 h-3" />
              </span>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white pl-7 pr-2 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Soyad */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-700">
              Soyad
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                <FiUser className="w-3 h-3" />
              </span>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white pl-7 pr-2 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-900"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Email + Telefon */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-700">
              E-posta
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                <FiMail className="w-3 h-3" />
              </span>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 bg-white pl-7 pr-2 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-700">
              Telefon (05XXXXXXXXX)
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                <FiPhone className="w-3 h-3" />
              </span>
              <input
                type="tel"
                maxLength={11}
                className={`w-full rounded-md bg-white pl-7 pr-2 py-2 text-[11px] focus:outline-none focus:ring-1 ${
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
              <p className="text-[10px] text-red-500 mt-1">
                Telefon formatı hatalı. Örnek: 05367378574
              </p>
            )}
          </div>
        </div>

        {/* Kaydet butonu */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center justify-center bg-gray-900 text-white py-2 px-4 rounded-md text-xs font-medium hover:bg-black transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Kaydediliyor..." : "Bilgileri Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
