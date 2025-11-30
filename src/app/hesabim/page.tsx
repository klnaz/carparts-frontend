"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import Title from '@components/Title'; // artık çalışacak
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
        <AddAddressForm
          onAddressAdded={() => {
            setShowAddress(false);
            setSelected("address");
          }}
          onCancel={() => setShowAddress(false)}
        />
      );
    if (showPayment)
      return (
        <AddPaymentForm
          onPaymentAdded={() => {
            setShowPayment(false);
            setSelected("payment");
          }}
          onCancel={() => setShowPayment(false)}
        />
      );

    switch (selected) {
      case "profile":
        return <ProfileInfo />;
      case "address":
        return <AddressInfo onAddAddressClick={() => setShowAddress(true)} />;
      case "payment":
        return <PaymentInfo onAddPaymentClick={() => setShowPayment(true)} />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-xl text-center pt-8 border-t">
        <Title text="Hesabım" />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <AccountSidebar selectedItem={selected} onMenuItemClick={setSelected} />
        </div>
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
