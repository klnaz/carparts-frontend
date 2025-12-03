"use client";

import React from "react";
import { toast } from "react-toastify";
import {
  useGetPaymentMethodsQuery,
  useDeletePaymentMethodMutation,
  type PaymentMethod,
} from "@/redux/api/paymentApi";
import { FiCreditCard, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface PaymentInfoProps {
  onAddPaymentClick: () => void;
}

// Backend ne döndürürse döndürsün, her durumda PaymentMethod[] döndür
const normalizePaymentData = (data: any): PaymentMethod[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.methods)) return data.methods;
  if (Array.isArray(data?.paymentMethods)) return data.paymentMethods;
  return [];
};

const PaymentInfo = ({ onAddPaymentClick }: PaymentInfoProps) => {
  const {
    data: rawPaymentData,
    isLoading,
    isError,
    error,
  } = useGetPaymentMethodsQuery();

  const [deletePaymentMethod, { isLoading: isDeleting }] =
    useDeletePaymentMethodMutation();

  // 🔐 Her koşulda array (TS de mutlu, runtime da)
  const paymentData: PaymentMethod[] = normalizePaymentData(
    rawPaymentData as any
  );

  const handleDeletePayment = async (id: string) => {
    if (
      !window.confirm(
        "Bu ödeme yöntemini silmek istediğinize emin misiniz?"
      )
    )
      return;

    try {
      await deletePaymentMethod(id).unwrap();
      toast.success("Ödeme yöntemi başarıyla silindi.");
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ??
        err?.error ??
        "Ödeme yöntemi silinirken bir hata oluştu.";
      toast.error(apiMessage);
      console.error("Delete payment error:", err);
    }
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500">Ödeme yöntemleri yükleniyor...</p>
      </div>
    );
  }

  // ERROR
  if (isError) {
    const apiMessage =
      typeof error === "object" &&
      error &&
      "data" in error &&
      (error as any).data?.message;

    return (
      <div className="p-4 bg-white rounded-xl border border-red-100 shadow-sm">
        <p className="text-xs text-red-500">
          {apiMessage ?? "Ödeme yöntemleri alınırken bir hata oluştu."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
      {/* Başlık */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Ödeme Bilgilerim</h2>
          <p className="text-[11px] text-gray-500">
            Kayıtlı kartlarınızı görüntüleyin, birincil kartınızı seçin ve
            isterseniz kartlarınızı silebilirsiniz.
          </p>
        </div>
        <FiCreditCard className="w-5 h-5 text-gray-400 hidden sm:block" />
      </div>

      {/* Kayıtlı kart yoksa */}
      {paymentData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-xs space-y-3">
          <p className="text-gray-700 font-medium">
            Henüz kayıtlı bir kartınız yok.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>
              Kart eklerken <strong>kart tipi</strong> (Visa, MasterCard vb.),
              <strong> kart sahibi adı</strong>, <strong>kart numarası</strong>{" "}
              ve <strong>son kullanma tarihi</strong> bilgilerini doğru
              girdiğinizden emin olun.
            </li>
            <li>
              Güvenlik için kart numaranızın tamamı değil, sadece{" "}
              <strong>son 4 hanesi</strong> saklanır.
            </li>
            <li>
              Bir kartı <strong>birincil kart</strong> olarak işaretlerseniz,
              ödeme adımlarında varsayılan kart olarak gelecektir.
            </li>
          </ul>
          <button
            onClick={onAddPaymentClick}
            className="mt-2 inline-flex items-center justify-center rounded-md border border-gray-900 px-4 py-2 text-xs font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
          >
            Yeni Ödeme Yöntemi Ekle
          </button>
        </div>
      ) : (
        <>
          {/* Kayıtlı ödeme yöntemleri listesi */}
          <div className="space-y-3">
            {paymentData.map((method) => (
              <div
                key={method.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-200 rounded-lg p-3 text-xs bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <FiCreditCard className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    {/* Üst satır: Kart tipi + son 4 hane */}
                    <p className="font-semibold text-gray-900">
                      {method.cardType || "Kart"} •••• {method.cardNumberLast4}
                    </p>

                    {/* Alt satır: SKT + Kart sahibi */}
                    <p className="text-[11px] text-gray-600">
                      Son kullanma:{" "}
                      <span className="font-medium">
                        {method.expiryMonth}/{method.expiryYear}
                      </span>{" "}
                      • Kart Sahibi:{" "}
                      <span className="font-medium">
                        {method.cardholderName}
                      </span>
                    </p>

                    {/* Birincil kart etiketi */}
                    <div className="flex items-center gap-2 mt-1">
                      {method.isPrimary ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] text-green-700 border border-green-100">
                          <FiCheckCircle className="w-3 h-3" />
                          Birincil kart
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 border border-gray-200">
                          <FiXCircle className="w-3 h-3" />
                          İkincil kart
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sil butonu */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeletePayment(method.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="w-3 h-3" />
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Alt bilgi + yeni kart ekle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
            <p className="text-[11px] text-gray-500">
              Yeni bir kart eklerken, kart bilgilerinizin doğru olduğundan emin
              olun. Hatalı girilen kart numarası veya son kullanma tarihi
              ödeme adımında sorun yaşamanıza neden olabilir.
            </p>
            <button
              onClick={onAddPaymentClick}
              className="inline-flex items-center justify-center bg-gray-900 text-white py-2 px-4 rounded-md text-xs font-medium hover:bg-black transition-colors"
            >
              Yeni Ödeme Yöntemi Ekle
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentInfo;
