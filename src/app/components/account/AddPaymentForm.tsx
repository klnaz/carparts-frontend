"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreatePaymentMethodMutation } from "@/redux/api/paymentApi";

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
  const [cardType, setCardType] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();
    try {
      await createPaymentMethod({
        cardholderName,
        cardNumber,
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
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data && typeof error.data.message === 'string') {
        errorMessage = error.data.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Ödeme Yöntemi Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Card Type"
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Expiry Month"
          value={expiryMonth}
          onChange={(e) => setExpiryMonth(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="Expiry Year"
          value={expiryYear}
          onChange={(e) => setExpiryYear(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrimary"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPrimary" className="text-xs">Set as primary</label>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-black text-white text-xs py-2 px-4 rounded-md hover:bg-black transition-colors duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Ekleniyor..." : "Ödeme Yöntemi Ekle"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 text-xs py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentForm;
