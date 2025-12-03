"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  ApiUser,
} from "@/redux/api/userApi";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";

const ProfileInfo: React.FC = () => {
  const { data: profileData, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Kullanıcı 5215458474 gibi giriyor

  const [phoneError, setPhoneError] = useState(false);

  // Şifre alanları
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  // 🟦 DEBUG — Backend'ten gelen normalize edilmiş veriyi gör
  useEffect(() => {
    if (!profileData) return;

    console.log("🟦 DEBUG — profileData:", profileData);

    setName(profileData.first_name ?? "");
    setSurname(profileData.last_name ?? "");
    setEmail(profileData.email ?? "");

    // Telefonu gösterirken baştaki 0'ı at → kullanıcı 5XXXXXXXXX şeklinde görsün
    const rawPhone = profileData.phone ?? "";
    const normalizedPhone = rawPhone.replace(/^0/, ""); // 0536... -> 536...
    setPhone(normalizedPhone);
  }, [profileData]);

  // 📱 Telefonu 5215458474 formatına zorunlu yap (5XXXXXXXXX, 10 hane)
  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // sadece rakamlar
    const regex = /^[5][0-9]{9}$/; // 5XXXXXXXXX formatı (10 hane)

    setPhone(cleaned);
    setPhoneError(cleaned.length > 0 && !regex.test(cleaned));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (phoneError) {
      toast.error("Telefon numarasını doğru formatta giriniz (Örn: 5215458474).");
      return;
    }

    try {
      if (!profileData) return;

      // Backend'e gönderirken başına 0 ekle: 5215458474 -> 05215458474
      const phoneToSend =
        phone && phone.length === 10 && phone.startsWith("5")
          ? "0" + phone
          : phone;

      const payload: Partial<ApiUser> = {
        id: profileData.id,
        first_name: name,
        last_name: surname,
        email,
        phone: phoneToSend,
      };

      await updateProfile(payload).unwrap();
      toast.success("Profil başarıyla güncellendi.");
    } catch (err) {
      console.error("❌ Profil güncelleme hatası:", err);
      toast.error("Profil güncellenirken bir hata oluştu.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (!oldPassword || !newPassword || !newPasswordAgain) {
      toast.error("Lütfen tüm şifre alanlarını doldurun.");
      return;
    }

    if (newPassword !== newPasswordAgain) {
      toast.error("Yeni şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Yeni şifre en az 8 karakter olmalıdır.");
      return;
    }

    try {
      await changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }).unwrap();

      toast.success("Şifreniz başarıyla değiştirildi.");
      setOldPassword("");
      setNewPassword("");
      setNewPasswordAgain("");
    } catch (err) {
      console.error("❌ Şifre değiştirme hatası:", err);
      toast.error("Şifre değiştirilirken bir hata oluştu.");
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
    <div className="space-y-6">
      {/* PROFİL BİLGİLERİ KARTI */}
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
              <label className="block text-xs font-medium text-gray-700">
                Ad
              </label>
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
              <label className="block text-xs font-medium text-gray-700">
                Soyad
              </label>
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
              <label className="block text-xs font-medium text-gray-700">
                E-posta
              </label>
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
                Telefon (5XXXXXXXXX)
              </label>
              <div className="relative mt-1">
                <FiPhone className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  maxLength={10}
                  className={`w-full rounded-md border pl-8 px-2 py-2 text-xs focus:ring-1 ${
                    phoneError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-gray-900"
                  }`}
                  value={phone}
                  onChange={(e) => validatePhone(e.target.value)}
                  placeholder="5215458474"
                />
              </div>

              {phoneError && (
                <p className="text-[11px] text-red-500 mt-1">
                  Telefon formatı hatalı. Örnek: 5215458474
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

      {/* ŞİFRE DEĞİŞTİR KARTI */}
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">
            <FiLock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Şifre Değiştir</h3>
            <p className="text-[11px] text-gray-500">
              Mevcut şifrenizi ve yeni şifrenizi girerek hesabınızın güvenliğini
              artırın.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-gray-700">
                Mevcut Şifre
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-2 py-2 text-[11px] focus:ring-1 focus:ring-gray-900"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-gray-700">
                Yeni Şifre
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-2 py-2 text-[11px] focus:ring-1 focus:ring-gray-900"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-700">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-300 px-2 py-2 text-[11px] focus:ring-1 focus:ring-gray-900"
              value={newPasswordAgain}
              onChange={(e) => setNewPasswordAgain(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <p className="text-[10px] text-gray-500">
            Yeni şifreniz en az 8 karakter olmalı ve kolay tahmin edilemeyecek
            bir kombinasyon içermelidir.
          </p>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-md text-[11px] font-medium hover:bg-black disabled:opacity-50"
            >
              {isChangingPassword ? "Şifre Değiştiriliyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
