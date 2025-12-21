"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  UpdateUserPayload,
} from "@/redux/api/userApi";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import PasswordRules from "./PasswordRules";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ProfileInfo: React.FC = () => {
  const { data: profileData, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [phoneError, setPhoneError] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  useEffect(() => {
    if (!profileData) return;

 setName(profileData.firstName ?? "");
setSurname(profileData.lastName ?? "");
setEmail(profileData.email ?? "");

const rawPhone = profileData.phoneNumber ?? "";
    const normalized = String(rawPhone).replace(/^0/, "");
    setPhone(normalized);
  }, [profileData]);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const regex = /^[5][0-9]{9}$/;

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
      const phoneToSend =
        phone && phone.startsWith("5") && phone.length === 10 ? "0" + phone : phone;

      const payload: UpdateUserPayload = {
        firstName: name || undefined,
        lastName: surname || undefined,
        email: email || undefined,
        phoneNumber: phoneToSend || undefined,
      };

      await updateProfile(payload).unwrap();
      toast.success("Profil başarıyla güncellendi.");
    } catch (err) {
      console.error("❌ Profil güncelleme hatası (raw):", err);
      const fbErr = err as FetchBaseQueryError;

      const data: any = fbErr?.data || {};
      const apiMessage =
        data.message || data.error || "Profil güncellenirken bir hata oluştu.";
      toast.error(apiMessage);
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

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Yeni şifre en az 8 karakter olmalı ve bir büyük, bir küçük harf, bir rakam ve bir özel karakter (@$!%*?&) içermelidir."
      );
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("Yeni şifre eski şifre ile aynı olmamalıdır.");
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();

      toast.success("Şifreniz başarıyla değiştirildi.");
      setOldPassword("");
      setNewPassword("");
      setNewPasswordAgain("");
    } catch (err) {
      console.error("❌ Şifre değiştirme hatası (raw):", err);
      const fbErr = err as FetchBaseQueryError;

      const data: any = fbErr?.data || {};
      const apiMessage =
        data.message ||
        data.error ||
        data?.details?.[0]?.message ||
        "Şifre değiştirilirken bir hata oluştu.";
      toast.error(apiMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl border shadow-sm text-xs">
        Profil bilgileri yükleniyor...
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div className="p-4 bg-white rounded-xl border shadow-sm text-red-500 text-xs">
        Profil bilgileri alınamadı.
      </div>
    );
  }

  const initials = (name?.[0] ?? "") + (surname?.[0] ?? "");

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
            {initials || <FiUser size={20} />}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Profil Bilgilerim</h2>
            <p className="text-[12px] text-gray-500">
              Hesap bilgilerinizi görüntüleyin ve güncelleyin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium">Ad</label>
              <div className="relative mt-1">
                <FiUser className="absolute left-2 top-2.5 text-gray-400" />
                <input
                  type="text"
                  className="w-full border rounded-md pl-8 py-2 text-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium">Soyad</label>
              <div className="relative mt-1">
                <FiUser className="absolute left-2 top-2.5 text-gray-400" />
                <input
                  type="text"
                  className="w-full border rounded-md pl-8 py-2 text-xs"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium">E-posta</label>
              <div className="relative mt-1">
                <FiMail className="absolute left-2 top-2.5 text-gray-400" />
                <input
                  type="email"
                  className="w-full border rounded-md pl-8 py-2 text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium">
                Telefon (5XXXXXXXXX)
              </label>
              <div className="relative mt-1">
                <FiPhone className="absolute left-2 top-2.5 text-gray-400" />
                <input
                  type="tel"
                  maxLength={10}
                  className={`w-full border rounded-md pl-8 py-2 text-xs ${
                    phoneError ? "border-red-500" : ""
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 bg-gray-900 text-white rounded-md text-xs disabled:opacity-50"
            >
              {isUpdating ? "Kaydediliyor..." : "Bilgileri Güncelle"}
            </button>
          </div>
        </form>
      </div>

      <div className="p-6 bg-white rounded-xl border shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
            <FiLock size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Şifre Değiştir</h3>
            <p className="text-[11px] text-gray-500">
              Mevcut şifrenizi ve yeni şifrenizi girin.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="block font-medium">Mevcut Şifre</label>
            <input
              type="password"
              className="w-full border rounded-md px-2 py-2 text-xs"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-medium">Yeni Şifre</label>
              <input
                type="password"
                className="w-full border rounded-md px-2 py-2 text-xs"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                className="w-full border rounded-md px-2 py-2 text-xs"
                value={newPasswordAgain}
                onChange={(e) => setNewPasswordAgain(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <PasswordRules password={newPassword} confirmPassword={newPasswordAgain} />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50"
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
