"use client";

import React from "react";
import { toast } from "react-toastify";
import {
  useGetPaymentMethodsQuery,
  useDeletePaymentMethodMutation,
  type PaymentMethod,
} from "@/redux/api/paymentApi";
import { CreditCard, Trash2, CheckCircle2, ShieldCheck, Plus } from "lucide-react";

interface PaymentInfoProps {
  onAddPaymentClick: () => void;
}

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-400">Ödeme yöntemleri yükleniyor...</p>
      </div>
    );
  }

  if (isError) {
    const apiMessage =
      typeof error === "object" &&
      error &&
      "data" in error &&
      (error as any).data?.message;

    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-900">
        <p className="text-sm text-red-650 font-bold">Ödeme yöntemleri alınırken bir hata oluştu.</p>
        <p className="text-xs text-zinc-500 mt-1.5">
          {apiMessage ?? "Lütfen daha sonra tekrar deneyiniz."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-650 flex items-center justify-center shadow-sm">
            <CreditCard className="w-5 h-5 text-red-650" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Ödeme Bilgilerim</h2>
            <p className="text-xs text-zinc-500">
              Kayıtlı banka / kredi kartlarınızı yönetin ve varsayılan kartınızı seçin.
            </p>
          </div>
        </div>

        <button
          onClick={onAddPaymentClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-3 shadow-md shadow-red-200 hover:shadow-red-300 active:translate-y-0.5 transition-all duration-200 cursor-pointer select-none"
        >
          <Plus className="w-4 h-4" />
          Yeni Kart Ekle
        </button>
      </div>

      {/* Credit cards mockup display */}
      {paymentData.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 text-xs space-y-4 text-left shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-zinc-800 text-sm">Kart Güvenliği &amp; Bilgilendirme</span>
          </div>
          <ul className="list-disc list-inside text-zinc-600 space-y-2 leading-relaxed">
            <li>
              Ödeme altyapımız PCI-DSS standartları ile tam uyumlu olup, kart bilgileriniz güvenle saklanır.
            </li>
            <li>
              Güvenliğiniz için kartınızın tamamı değil, sadece <strong>son 4 hanesi</strong> görüntülenebilir.
            </li>
            <li>
              Varsayılan olarak işaretlenen <strong>birincil kartınız</strong>, hızlı ödeme adımlarında doğrudan seçili gelecektir.
            </li>
          </ul>
          <button
            onClick={onAddPaymentClick}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-700 shadow-sm transition-all select-none cursor-pointer"
          >
            Ödeme Yöntemi Ekle
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {paymentData.map((method) => {
            const isPrimary = method.isPrimary;
            const cardBrand = (method.cardType || "visa").toLowerCase();
            const isMastercard = cardBrand.includes("master") || cardBrand.includes("mc");
            const isAmex = cardBrand.includes("amex") || cardBrand.includes("american");

            return (
              <div
                key={method.id}
                className="group relative flex flex-col justify-between rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-[210px] overflow-hidden select-none border border-white/10"
                style={{
                  background: isPrimary
                    ? "linear-gradient(135deg, #7f1d1d 0%, #18181b 100%)"
                    : "linear-gradient(135deg, #27272a 0%, #09090b 100%)",
                }}
              >
                {/* Holographic glowing lines decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-10 pointer-events-none" />
                
                {/* Top: Chip & Card Brand */}
                <div className="flex items-start justify-between">
                  {/* Card Chip Mockup */}
                  <div className="w-10 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-transparent" />
                    <div className="w-full h-[1px] bg-amber-500/20 absolute top-1/2 left-0" />
                    <div className="h-full w-[1px] bg-amber-500/20 absolute left-1/3 top-0" />
                    <div className="h-full w-[1px] bg-amber-500/20 absolute left-2/3 top-0" />
                  </div>

                  {/* Dynamic Brand Logo Text */}
                  <div className="text-right">
                    <span className="text-sm font-black italic tracking-wider text-white opacity-90 select-none">
                      {isMastercard ? "MasterCard" : isAmex ? "Amex" : "Visa"}
                    </span>
                  </div>
                </div>

                {/* Middle: Number Mask */}
                <div className="my-3 text-left">
                  <p className="text-lg font-mono tracking-widest text-white/90">
                    ••••  ••••  ••••  <span className="font-bold text-white">{method.cardNumberLast4}</span>
                  </p>
                </div>

                {/* Bottom: Holder & Expiry & Delete */}
                <div className="flex items-end justify-between">
                  <div className="space-y-0.5 text-left">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                      Kart Sahibi
                    </p>
                    <p className="text-[11px] font-bold text-white uppercase truncate max-w-[140px]">
                      {method.cardholderName}
                    </p>
                  </div>

                  <div className="space-y-0.5 text-center">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                      Son Kul.
                    </p>
                    <p className="text-[11px] font-mono font-bold text-white">
                      {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>

                  {/* Primary Card Badge / Actions */}
                  <div className="flex flex-col items-end gap-2">
                    {isPrimary ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Varsayılan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-zinc-800 px-2 py-0.5 text-[9px] text-zinc-400 font-bold select-none">
                        İkincil
                      </span>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(method.id)}
                      disabled={isDeleting}
                      className="text-red-400 hover:text-red-300 transition-colors p-1.5 bg-black/45 hover:bg-black/75 border border-zinc-800 rounded-lg cursor-pointer"
                      title="Kartı Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer disclaimer */}
      {paymentData.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-zinc-150">
          <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xl text-left">
            Yeni bir kart tanımladıktan sonra ödeme ekranında tek tıkla kullanabilirsiniz. Kart silme işlemleri geri alınamaz. Alışverişlerinizde 256-bit SSL şifreleme ve 3D Secure güvencesi sunulmaktadır.
          </p>
          <button
            onClick={onAddPaymentClick}
            className="inline-flex items-center justify-center bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm select-none cursor-pointer"
          >
            Ödeme Yöntemi Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;
