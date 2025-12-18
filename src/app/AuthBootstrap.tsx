"use client";

import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import { hydrateAuth, setUser } from "@/redux/slices/authSlice";
import { useGetUserProfileQuery } from "@/redux/api/userApi";
import type { User } from "@/types/user";

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { token, hydrated } = useSelector((state: RootState) => state.auth);

  // 1️⃣ localStorage → redux hydrate
  useEffect(() => {
    if (hydrated) return;

    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let storedUser: User | null = null;
    if (typeof window !== "undefined") {
      try {
        storedUser = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        storedUser = null;
      }
    }

    dispatch(
      hydrateAuth({
        token: storedToken,
        user: storedUser && storedUser.email ? storedUser : null,
      })
    );
  }, [dispatch, hydrated]);

  // 2️⃣ token varsa profili çek
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  // DEBUG
  useEffect(() => {
    console.log("🟢 PROFILE DATA:", profileData);
  }, [profileData]);

  // 3️⃣ API → redux user
  useEffect(() => {
    if (!profileData) return;

    const normalizedUser: User = {
      id: profileData.id,
      role: profileData.role,
      email: profileData.email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phoneNumber: profileData.phoneNumber ?? null,
    };

    if (!normalizedUser.email) return;
    dispatch(setUser(normalizedUser));
  }, [dispatch, profileData]);

  if (!hydrated) return null;

  return <>{children}</>;
};

export default AuthBootstrap;
