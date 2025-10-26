"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetUserProfileQuery, useUpdateUserMutation } from "@/redux/api/userApi";
import { User as UserType } from "@/types/user";

interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const ProfileInfo: React.FC = () => {
  const { data: profileData, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  // API user -> UserType mapleme
  const mapApiUserToUserType = (apiUser: ApiUser): UserType => ({
    id: apiUser.id,
    name: apiUser.first_name,
    surname: apiUser.last_name,
    email: apiUser.email,
  });

useEffect(() => {
  if (profileData && 'first_name' in profileData && 'last_name' in profileData) {
    const user: UserType = mapApiUserToUserType(profileData as ApiUser);
    setName(user.name);
    setSurname(user.surname);
    setEmail(user.email);
  }
}, [profileData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();
    try {
      if (!profileData) return;

      // UserType -> ApiUser dönüşümü
      const apiUser: ApiUser = {
        id: profileData.id,
        first_name: name,
        last_name: surname,
        email,
      };

      await updateProfile(apiUser).unwrap(); // artık ApiUser tipinde
      toast.success("Profil başarıyla güncellendi.");
    } catch (err) {
      toast.error("Profil güncellenirken bir hata oluştu.");
      console.error(err);
    }
  };

  if (isLoading) return <p className="text-xs">Profil bilgileri yükleniyor...</p>;
  if (isError) return <p className="text-xs text-red-500">Profil bilgileri alınamadı.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Profil Bilgilerim</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block mb-1 text-gray-700">Ad</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Soyad</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">E-posta</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-black transition-colors duration-200 disabled:opacity-50"
        >
          {isUpdating ? "Güncelleniyor..." : "Bilgileri Güncelle"}
        </button>
      </form>
    </div>
  );
};

export default ProfileInfo;
