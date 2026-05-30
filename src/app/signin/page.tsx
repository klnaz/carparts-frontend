"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLoginMutation, useRegisterMutation } from "@/redux/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { User as UserType } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Settings, Mail, Lock, User, ArrowRight } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";



interface SignInAndUpProps {
  initialState?: "Giriş Yap" | "Kayıt Ol";
}

const SignInAndUp: React.FC<SignInAndUpProps> = ({ initialState }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const [currentState, setCurrentState] = useState<"Giriş Yap" | "Kayıt Ol">(initialState || "Giriş Yap");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  useEffect(() => {
    if (token) router.push("/");
  }, [token, router]);

  const mapApiUserToUserType = (apiUser: any): UserType => ({
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    phoneNumber: apiUser.phoneNumber || null,
    role: apiUser.role,
  });

  const extractToken = (data: any): string | null => {
    return (
      data?.accessToken?.token || // { accessToken: { token: "" }}
      data?.accessToken ||        // { accessToken: "" }
      data?.token ||              // { token: "" }
      data?.jwt ||                // { jwt: "" }
      null
    );
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss();

    try {
      if (currentState === "Giriş Yap") {
        const rawResponse = await login({ email: email.trim(), password });
        const response = rawResponse?.data;
        if (!response?.success) {
          throw new Error(response?.message || "Bir hata oluştu.");
        }

        const token = extractToken(response.data);
        if (!token) {
          throw new Error("API token bilgisi alınamadı.");
        }

        const user: UserType = mapApiUserToUserType(response.data.user);

        dispatch(setToken(token));
        dispatch(setUser(user));

        toast.success(`Hoş geldiniz, ${user.firstName} ${user.lastName}! Başarıyla giriş yaptınız. 🚗✨`);
        router.push("/");
      } else {
        const rawResponse = await register({
          firstName: userFirstName.trim(),
          lastName: userLastName.trim(),
          email: email.trim(),
          password,
        });

        const response = rawResponse?.data;
        if (!response?.success) {
          throw new Error(response?.message || "Kayıt sırasında bir hata oluştu.");
        }
        
        toast.success(response.message || "Kayıt başarılı! Şimdi giriş yapabilirsiniz.");

        setCurrentState("Giriş Yap");
        setUserFirstName("");
        setUserLastName("");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Bir hata oluştu. Lütfen tekrar deneyin.";

      toast.error(message);
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-zinc-50/50">
      {/* Three.js 3D Dotted Surface Waves Background */}
      <DottedSurface className="opacity-[0.45]" />

      {/* Dynamic Animated Mesh Gradients in Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200/20 rounded-full blur-3xl -z-20 pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-200/60 rounded-full blur-3xl -z-20 pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />



      {/* Main Authentication Card */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-10 shadow-xl shadow-zinc-150/40 relative overflow-hidden z-10"
      >
        {/* Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-650 to-red-750" />

        {/* Premium Emblem with Interactive Spinning Gears & Floating Car */}
        <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm overflow-hidden group select-none">
          {/* Subtle rotating gear in background of logo */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-3 -right-3 text-red-500/5 group-hover:text-red-500/10 transition-colors pointer-events-none"
          >
            <Settings className="w-16 h-16" />
          </motion.div>
          
          {/* Main Gear behind car */}
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute text-zinc-100 group-hover:text-red-500/10 transition-colors pointer-events-none"
          >
            <Settings className="w-12 h-12" />
          </motion.div>
          
          {/* Floating Car Emblem */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="z-10 text-red-650"
          >
            <Car className="w-10 h-10" />
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">
            OTO PARÇA
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Yedek parça ve oto aksesuar dünyasına hoş geldiniz
          </p>
        </div>

        {/* Switch tabs with custom sliding pill background selection */}
        <div className="flex bg-zinc-50 p-1.5 rounded-2xl border border-zinc-200/85 w-full mb-8 relative select-none">
          <button
            type="button"
            onClick={() => {
              setCurrentState("Giriş Yap");
              setUserFirstName("");
              setUserLastName("");
              setEmail("");
              setPassword("");
              toast.dismiss();
            }}
            className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 relative z-10 cursor-pointer select-none text-zinc-650"
          >
            <span className={currentState === "Giriş Yap" ? "text-zinc-900 font-extrabold" : "text-zinc-500 hover:text-zinc-800"}>
              Giriş Yap
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentState("Kayıt Ol");
              setUserFirstName("");
              setUserLastName("");
              setEmail("");
              setPassword("");
              toast.dismiss();
            }}
            className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 relative z-10 cursor-pointer select-none text-zinc-650"
          >
            <span className={currentState === "Kayıt Ol" ? "text-zinc-900 font-extrabold" : "text-zinc-500 hover:text-zinc-800"}>
              Kayıt Ol
            </span>
          </button>
          
          {/* Capsule Pill Sliding Indicator */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="absolute inset-y-1.5 bg-white shadow-sm border border-zinc-150 rounded-xl"
            style={{
              width: "calc(50% - 6px)",
              left: currentState === "Giriş Yap" ? "6px" : "calc(50%)",
            }}
          />
        </div>

        {/* Form Container with fade and slide transitions */}
        <form onSubmit={onSubmitHandler} className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentState}
              initial={{ opacity: 0, x: currentState === "Giriş Yap" ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentState === "Giriş Yap" ? 15 : -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-4"
            >
              {currentState === "Kayıt Ol" && (
                <div className="grid grid-cols-2 gap-4 w-full text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ad</label>
                    <div className="relative">
                      <input
                        className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
                        onChange={(e) => setUserFirstName(e.target.value)}
                        value={userFirstName}
                        type="text"
                        placeholder="Adınız"
                        required
                      />
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Soyad</label>
                    <div className="relative">
                      <input
                        className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
                        onChange={(e) => setUserLastName(e.target.value)}
                        value={userLastName}
                        type="text"
                        placeholder="Soyadınız"
                        required
                      />
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 w-full text-left">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">E-Posta Adresi</label>
                <div className="relative">
                  <input
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="ornek@e-posta.com"
                    required
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5 w-full text-left">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Şifre</label>
                <div className="relative">
                  <input
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sub-actions */}
          <div className="w-full flex justify-between items-center text-xs pt-1 text-zinc-500 select-none">
            <span className="hover:text-red-600 cursor-pointer transition-colors">Şifremi Unuttum</span>
            <span
              className="hover:text-red-650 cursor-pointer font-semibold transition-colors"
              onClick={() => {
                setCurrentState(currentState === "Giriş Yap" ? "Kayıt Ol" : "Giriş Yap");
                setUserFirstName("");
                setUserLastName("");
                setEmail("");
                setPassword("");
                toast.dismiss();
              }}
            >
              {currentState === "Giriş Yap" ? "Yeni Hesap Oluştur" : "Zaten üye misiniz?"}
            </span>
          </div>

          {/* Animated Submit button */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-xl text-xs shadow-md shadow-red-200 hover:shadow-red-300 transition-all duration-200 cursor-pointer disabled:opacity-50 select-none text-center mt-4 flex items-center justify-center gap-2"
            type="submit"
            disabled={isLoggingIn || isRegistering}
          >
            {isLoggingIn || isRegistering ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {currentState === "Giriş Yap" ? "Giriş Yap" : "Kayıt Ol"}
                <ArrowRight className="w-4 h-4 text-white/90" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignInAndUp;
