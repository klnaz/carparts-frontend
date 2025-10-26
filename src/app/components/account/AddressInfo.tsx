"use client";
import React from "react";
import { toast } from "react-toastify";
import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
} from "@/redux/api/addressApi";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface AddressInfoProps {
  onAddAddressClick: () => void;
}

const AddressInfo = ({ onAddAddressClick }: AddressInfoProps) => {
  const { data: addressesData, isLoading, isError, error } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Bu adresi silmek istediğinizden emin misiniz?")) {
      try {
        await deleteAddress(addressId).unwrap();
        toast.success("Adres başarıyla silindi.");
      } catch (err: unknown) {
        const fetchError = err as FetchBaseQueryError;
        toast.error(
          'status' in fetchError
            ? (fetchError.data as { message?: string })?.message || 'Adres silinirken bir hata oluştu.'
            : 'Adres silinirken bir hata oluştu.'
        );
      }
    }
  };

  if (isLoading) return <p className="text-xs">Adresler yükleniyor...</p>;
  if (isError)
    return (
      <p className="text-xs text-red-500">
        {(error as FetchBaseQueryError).data ? ((error as FetchBaseQueryError).data as { message?: string })?.message : "Adresler yüklenirken bir hata oluştu."}
      </p>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Adres Bilgilerim</h2>
      {addressesData?.length === 0 ? (
        <p className="text-gray-600 text-xs mb-4">Henüz adresiniz yok.</p>
      ) : (
        <div className="space-y-4 text-xs mb-4">
          {addressesData?.map((address) => (
            <div key={address.id} className="border border-gray-200 p-4 rounded-md shadow-sm">
              <p className="font-medium">{address.title}</p>
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onAddAddressClick}
        className="bg-black text-white text-xs py-2 px-4 rounded-md hover:bg-black transition-colors duration-200"
      >
        Adres Ekle
      </button>
    </div>
  );
};

export default AddressInfo;
