"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLoginMutation, useRegisterMutation } from "@/redux/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { User as UserType } from "@/types/user"; // Projedeki User tipi

interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthResponse {
  accessToken: { token: string };
  user: ApiUser;
  message?: string;
}

interface ApiError {
  data?: { message?: string };
  error?: string;
}

const SignInAndUp: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const [currentState, setCurrentState] = useState<"Giriş Yap" | "Kayıt Ol">("Giriş Yap");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  useEffect(() => {
    if (token) router.push("/");
  }, [token, router]);

  const mapApiUserToUserType = (apiUser: ApiUser): UserType => ({
    id: apiUser.id,
    name: apiUser.first_name,
    surname: apiUser.last_name,
    email: apiUser.email,
  });

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss();

    try {
      if (currentState === "Giriş Yap") {
        const response = await login({ email: email.trim(), password }).unwrap();
        const data = response as AuthResponse;

        const user: UserType = mapApiUserToUserType(data.user);

        dispatch(setToken(data.accessToken.token));
        dispatch(setUser(user));
        toast.success(data.message || "Giriş başarılı!");
        router.push("/");
      } else {
        const response = await register({
          first_name: userFirstName.trim(),
          last_name: userLastName.trim(),
          email: email.trim(),
          password,
        }).unwrap();

        const data = response as AuthResponse;
        toast.success(data.message || "Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setCurrentState("Giriş Yap");
        setUserFirstName("");
        setUserLastName("");
        setEmail("");
        setPassword("");
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      const message = err.data?.message || err.error || "Bir hata oluştu. Lütfen tekrar deneyin.";
      toast.error(message);
      console.error("Auth error:", err);
    }
  };

  return (
    <form
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      onSubmit={onSubmitHandler}
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Kayıt Ol" && (
        <>
          <input
            className="w-full px-3 py-2 border border-gray-800"
            onChange={(e) => setUserFirstName(e.target.value)}
            value={userFirstName}
            type="text"
            placeholder="Ad"
            required
          />
          <input
            className="w-full px-3 py-2 border border-gray-800"
            onChange={(e) => setUserLastName(e.target.value)}
            value={userLastName}
            type="text"
            placeholder="Soyad"
            required
          />
        </>
      )}

      <input
        className="w-full px-3 py-2 border border-gray-800"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="E-mail"
        required
      />
      <input
        className="w-full px-3 py-2 border border-gray-800"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Şifre"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Şifremi Unuttum</p>
        <p
          className="cursor-pointer"
          onClick={() => {
            setCurrentState(currentState === "Giriş Yap" ? "Kayıt Ol" : "Giriş Yap");
            setUserFirstName("");
            setUserLastName("");
            setEmail("");
            setPassword("");
            toast.dismiss();
          }}
        >
          {currentState === "Giriş Yap" ? "Kayıt Ol" : "Giriş Yap"}
        </p>
      </div>

      <button
        className="bg-black text-white font-light px-8 py-2 mt-4"
        type="submit"
        disabled={isLoggingIn || isRegistering}
      >
        {isLoggingIn || isRegistering
          ? "Yükleniyor..."
          : currentState === "Giriş Yap"
          ? "Giriş Yap"
          : "Kayıt Ol"}
      </button>
    </form>
  );
};

export default SignInAndUp;
