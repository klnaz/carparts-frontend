"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileInfo from "@components/account/ProfileInfo";
import AddressInfo from "@components/account/AddressInfo";
import PaymentInfo from "@components/account/PaymentInfo";
import AddAddressForm from "@components/account/AddAddressForm";
import AddPaymentForm from "@components/account/AddPaymentForm";
import AccountSidebar from "@components/account/AccountSidebar";

export default function MyAccount() {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [selected, setSelected] = useState("profile");
  const [showAddress, setShowAddress] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!token) router.push("/signin");
  }, [token, router]);

  if (!token) return null;

  const renderContent = () => {
    if (showAddress)
      return (
        <motion.div
          key="add-address"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          <AddAddressForm
            onAddressAdded={() => {
              setShowAddress(false);
              setSelected("address");
            }}
            onCancel={() => setShowAddress(false)}
          />
        </motion.div>
      );
    if (showPayment)
      return (
        <motion.div
          key="add-payment"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          <AddPaymentForm
            onPaymentAdded={() => {
              setShowPayment(false);
              setSelected("payment");
            }}
            onCancel={() => setShowPayment(false)}
          />
        </motion.div>
      );

    switch (selected) {
      case "profile":
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileInfo />
          </motion.div>
        );
      case "address":
        return (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AddressInfo onAddAddressClick={() => setShowAddress(true)} />
          </motion.div>
        );
      case "payment":
        return (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PaymentInfo onAddPaymentClick={() => setShowPayment(true)} />
          </motion.div>
        );
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8">
      {/* Premium Dashboard Container */}
      <div className="bg-white text-zinc-700 rounded-3xl border border-zinc-200 shadow-xl overflow-hidden p-6 md:p-10 relative">
        {/* Subtle red tint decor */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-100/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-100 pb-6 mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center justify-center md:justify-start gap-2">
              Hesap <span className="text-red-600">Paneli</span>
              <span className="w-2 h-2 rounded-full bg-red-650 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.3)]" />
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Profil bilgilerinizi, adreslerinizi ve kayıtlı ödeme yöntemlerinizi buradan yönetin.
            </p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-full text-xs font-semibold text-zinc-500 shadow-sm">
            Güvenli Oturum Etkin
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
            <AccountSidebar selectedItem={selected} onMenuItemClick={(item) => {
              setShowAddress(false);
              setShowPayment(false);
              setSelected(item);
            }} />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-zinc-200/80 shadow-sm min-h-[500px]">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
