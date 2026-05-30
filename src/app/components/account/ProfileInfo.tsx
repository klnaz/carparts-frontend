"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  UpdateUserPayload,
} from "@/redux/api/userApi";
import { User, Mail, Phone, Lock } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-500">Profil bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-red-650 text-red-700 font-semibold">Profil bilgileri alınamadı.</p>
        <p className="text-xs text-zinc-500 mt-1">Lütfen daha sonra tekrar deneyiniz.</p>
      </div>
    );
  }

  const initials = (name?.[0] ?? "") + (surname?.[0] ?? "");

  return (
    <div className="space-y-8">
      {/* Profil Güncelleme */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
          <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-lg shadow-sm uppercase">
            {initials || <User size={24} />}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-zinc-900">Profil Bilgilerim</h2>
            <p className="text-xs text-zinc-550">
              Hesap bilgilerinizi buradan güncel tutabilirsiniz.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Ad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Soyadınız"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="email"
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="E-posta adresiniz"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Telefon (Başında sıfır olmadan)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="tel"
                  maxLength={10}
                  className={`w-full bg-white border rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200 ${
                    phoneError ? "border-red-500" : "border-zinc-200"
                  }`}
                  value={phone}
                  onChange={(e) => validatePhone(e.target.value)}
                  placeholder="5XXXXXXXXX"
                />
              </div>
              {phoneError && (
                <p className="text-[10px] text-red-500 font-medium">
                  Telefon formatı hatalı. Örnek: 5215458474
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 hover:shadow-red-300 transition-all duration-200 disabled:opacity-50 select-none cursor-pointer"
            >
              {isUpdating ? "Güncelleniyor..." : "Profil Bilgilerini Güncelle"}
            </button>
          </div>
        </form>
      </div>

      {/* Şifre Değiştirme */}
      <div className="space-y-6 pt-6 border-t border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-550 flex items-center justify-center">
            <Lock size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-md font-bold text-zinc-900">Şifre Değiştir</h3>
            <p className="text-xs text-zinc-550">
              Hesap güvenliğiniz için periyodik olarak şifrenizi yenileyin.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-750">Mevcut Şifre</label>
            <input
              type="password"
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-750">Yeni Şifre</label>
              <input
                type="password"
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-750">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200"
                value={newPasswordAgain}
                onChange={(e) => setNewPasswordAgain(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-zinc-650 shadow-sm">
            <PasswordRules password={newPassword} confirmPassword={newPasswordAgain} />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-250 rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-50 select-none cursor-pointer shadow-sm"
            >
              {isChangingPassword ? "Şifre Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
