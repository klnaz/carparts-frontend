"use client";
import React from "react";
import { toast } from "react-toastify";
import {
  useGetPaymentMethodsQuery,
  useDeletePaymentMethodMutation,
} from "@/redux/api/paymentApi";
import type { PaymentMethod } from "@/redux/api/paymentApi";

interface PaymentInfoProps {
  onAddPaymentClick: () => void;
}

const PaymentInfo = ({ onAddPaymentClick }: PaymentInfoProps) => {
  const {
    data: rawPaymentData,
    isLoading,
    isError,
    error,
  } = useGetPaymentMethodsQuery();

  const [deletePaymentMethod] = useDeletePaymentMethodMutation();

  // ⭐ GÜVENLİ DÖNÜŞÜM → BACKEND NASIL DÖNERSE DÖNSÜN ARRAY'E ÇEVİRİYORUZ
  const paymentData: PaymentMethod[] = Array.isArray(rawPaymentData)
    ? rawPaymentData
    : Array.isArray(rawPaymentData?.methods)
    ? rawPaymentData.methods
    : Array.isArray(rawPaymentData?.data)
    ? rawPaymentData.data
    : [];

  const handleDeletePayment = async (id: string) => {
    if (!window.confirm("Bu ödeme yöntemini silmek istediğinize emin misiniz?")) return;

    try {
      await deletePaymentMethod(id).unwrap();
      toast.success("Ödeme yöntemi başarıyla silindi.");
    } catch (err: unknown) {
      if (typeof err === "object" && err && "data" in err) {
        const apiError = err as { data?: { message?: string } };
        toast.error(apiError.data?.message ?? "Ödeme yöntemi silinirken bir hata oluştu.");
      } else {
        toast.error("Ödeme yöntemi silinirken bir hata oluştu.");
      }
    }
  };

  if (isLoading) return <p className="text-xs">Ödeme yöntemleri yükleniyor...</p>;

  if (isError) {
    const message =
      typeof error === "object" &&
      error &&
      "data" in error &&
      (error as { data?: { message?: string } }).data?.message;

    return (
      <p className="text-xs text-red-500">
        {message ?? "Ödeme yöntemleri alınırken bir hata oluştu."}
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Ödeme Bilgilerim</h2>

      {paymentData.length === 0 ? (
        <p className="text-gray-600 text-xs mb-4">
          Henüz kayıtlı bir kartınız yok.
        </p>
      ) : (
        <div className="space-y-4 text-xs mb-4">
          {paymentData.map((method: PaymentMethod) => (
            <div
              key={method.id}
              className="border border-gray-200 p-4 rounded-md shadow-sm"
            >
              <p className="font-medium">{method.name}</p>
              <p>{method.description || "Açıklama yok"}</p>
              <p>{method.isActive ? "Aktif" : "Pasif"}</p>

              <button
                onClick={() => handleDeletePayment(method.id)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onAddPaymentClick}
        className="bg-black text-white text-xs py-2 px-4 rounded-md hover:bg-black transition-colors duration-200"
      >
        Ödeme Yöntemi Ekle
      </button>
    </div>
  );
};

export default PaymentInfo;
