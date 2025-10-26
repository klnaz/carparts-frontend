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
}: AddPaymentFormProps): JSX.Element => {
  const [createPaymentMethod, { isLoading }] = useCreatePaymentMethodMutation();

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();
    try {
      await createPaymentMethod({
        cardholderName,
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardType,
      }).unwrap();
      toast.success("Ödeme yöntemi başarıyla eklendi.");
      onPaymentAdded();
    } catch (error: any) {
      console.error("Error adding payment method: ", error);
      toast.error(error.data?.message || "Ödeme yöntemi eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Ödeme Yöntemi Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* input alanları aynı */}
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
