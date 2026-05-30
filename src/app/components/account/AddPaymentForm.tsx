"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreatePaymentMethodMutation } from "@/redux/api/paymentApi";
import { ArrowLeft, CreditCard, ShieldAlert } from "lucide-react";

interface AddPaymentFormProps {
  onPaymentAdded: () => void;
  onCancel: () => void;
}

const AddPaymentForm = ({
  onPaymentAdded,
  onCancel,
}: AddPaymentFormProps) => {
  const [createPaymentMethod, { isLoading }] = useCreatePaymentMethodMutation();

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("Visa");
  const [isPrimary, setIsPrimary] = useState(false);

  // Format card number: Add spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }

    // Auto-detect card brand basic heuristic
    if (value.startsWith("4")) {
      setCardType("Visa");
    } else if (
      value.startsWith("51") ||
      value.startsWith("52") ||
      value.startsWith("53") ||
      value.startsWith("54") ||
      value.startsWith("55")
    ) {
      setCardType("MasterCard");
    } else if (value.startsWith("34") || value.startsWith("37")) {
      setCardType("Amex");
    } else if (value.startsWith("9792")) {
      setCardType("Troy");
    }
  };

  const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val === "" || (parseInt(val, 10) >= 1 && parseInt(val, 10) <= 12)) {
      setExpiryMonth(val.substring(0, 2));
    }
  };

  const handleExpiryYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setExpiryYear(val.substring(0, 4));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCvv(val.substring(0, 4));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length < 16) {
      toast.error("Lütfen 16 haneli kart numarasını girin.");
      return;
    }
    if (!cardholderName.trim()) {
      toast.error("Lütfen kart sahibinin adını girin.");
      return;
    }
    if (!expiryMonth || expiryMonth.length < 2) {
      toast.error("Lütfen geçerli bir son kullanma ayı girin (Örn: 08).");
      return;
    }
    if (!expiryYear || expiryYear.length < 4) {
      toast.error("Lütfen geçerli bir son kullanma yılı girin (Örn: 2028).");
      return;
    }
    if (!cvv || cvv.length < 3) {
      toast.error("Lütfen geçerli bir CVV kodu girin.");
      return;
    }

    try {
      await createPaymentMethod({
        cardholderName: cardholderName.trim(),
        cardNumber: cleanCardNumber,
        expiryMonth,
        expiryYear: parseInt(expiryYear, 10),
        cvv,
        cardType,
        isPrimary,
      }).unwrap();

      toast.success("Ödeme yöntemi başarıyla eklendi.");
      onPaymentAdded();
    } catch (error: unknown) {
      console.error("Error adding payment method: ", error);
      let errorMessage = "Ödeme yöntemi eklenirken bir hata oluştu.";
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        errorMessage = error.data.message;
      }
      toast.error(errorMessage);
    }
  };

  // Card details formatted display
  const displayCardNumber = cardNumber || "••••  ••••  ••••  ••••";
  const displayHolderName = cardholderName || "KART SAHİBİ ADI";
  const displayExpiry = expiryMonth || expiryYear
    ? `${expiryMonth || "AA"}/${expiryYear ? expiryYear.toString().slice(-2) : "YY"}`
    : "AA/YY";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3 text-left">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Yeni Kart Ekle</h2>
            <p className="text-xs text-zinc-500">
              Kredi veya banka kartınızı ekleyerek hızlı ve güvenli ödeme yapabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-5 items-start">
        {/* Dynamic Card Preview */}
        <div className="md:col-span-2 flex flex-col items-center">
          <p className="text-xs font-semibold text-zinc-500 mb-3 select-none">Kart Önizleme</p>
          <div
            className="relative w-full max-w-[320px] aspect-[1.586/1] rounded-2xl p-5 shadow-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, #7f1d1d 0%, #09090b 100%)",
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Top: Chip & Brand */}
            <div className="flex justify-between items-start">
              <div className="w-10 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-transparent" />
                <div className="w-full h-[1px] bg-amber-500/20 absolute top-1/2 left-0" />
                <div className="h-full w-[1px] bg-amber-500/20 absolute left-1/3 top-0" />
                <div className="h-full w-[1px] bg-amber-500/20 absolute left-2/3 top-0" />
              </div>
              <span className="text-sm font-black italic tracking-wider text-white opacity-90">
                {cardType}
              </span>
            </div>

            {/* Middle: Number */}
            <div className="my-2">
              <p className="text-sm font-mono tracking-widest text-white/90 truncate text-left">
                {displayCardNumber}
              </p>
            </div>

            {/* Bottom: Holder & Expiry */}
            <div className="flex justify-between items-end">
              <div className="text-left max-w-[170px]">
                <p className="text-[8px] uppercase tracking-wider text-zinc-400 font-bold">
                  Kart Sahibi
                </p>
                <p className="text-[10px] font-bold text-white uppercase truncate">
                  {displayHolderName}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[8px] uppercase tracking-wider text-zinc-400 font-bold">
                  Son Kul.
                </p>
                <p className="text-[10px] font-mono font-bold text-white">
                  {displayExpiry}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2.5 text-[10px] text-zinc-500 bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 rounded-xl max-w-[320px] text-left shadow-sm">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>Kart bilgileriniz AES-256 algoritmasıyla şifrelenir. CVV/Şifreniz asla kaydedilmez.</span>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
          {/* Cardholder Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-600">Kart Sahibi Adı Soyadı</label>
            <input
              type="text"
              placeholder="Kartın ön yüzündeki isim"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200"
              required
            />
          </div>

          {/* Card Number */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-600">Kart Numarası</label>
            <div className="relative">
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 font-mono tracking-wider"
                required
              />
              <CreditCard className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Expiry & CVV grid */}
          <div className="grid grid-cols-3 gap-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">S.K. Ay (AA)</label>
              <input
                type="text"
                placeholder="Örn: 08"
                maxLength={2}
                value={expiryMonth}
                onChange={handleExpiryMonthChange}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 text-center font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">S.K. Yıl (YYYY)</label>
              <input
                type="text"
                placeholder="Örn: 2028"
                maxLength={4}
                value={expiryYear}
                onChange={handleExpiryYearChange}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 text-center font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Güvenlik (CVV)</label>
              <input
                type="password"
                placeholder="CVV"
                maxLength={4}
                value={cvv}
                onChange={handleCvvChange}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200 shadow-sm transition-all duration-200 text-center font-mono"
                required
              />
            </div>
          </div>

          {/* Card Type Choice */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-600">Kart Markası</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-805 focus:outline-none focus:bg-white focus:border-red-500 cursor-pointer shadow-sm"
            >
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="Amex">American Express (Amex)</option>
              <option value="Troy">Troy</option>
            </select>
          </div>

          {/* Set as Primary Checkbox */}
          <div className="flex items-center gap-3 pt-2 text-left">
            <input
              type="checkbox"
              id="isPrimaryCard"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-red-650 focus:ring-red-500/20 focus:ring-offset-white cursor-pointer"
            />
            <label
              htmlFor="isPrimaryCard"
              className="text-xs text-zinc-500 select-none cursor-pointer"
            >
              Bu kartı varsayılan ödeme yöntemi olarak belirle
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 hover:shadow-red-300 transition-all duration-250 cursor-pointer disabled:opacity-50 select-none text-center"
            >
              {isLoading ? "Kart Kaydediliyor..." : "Kartı Kaydet"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer select-none text-center shadow-sm"
            >
              Vazgeç
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentForm;
