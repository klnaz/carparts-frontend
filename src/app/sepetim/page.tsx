"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "@/redux/slices/cartSlice";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const items = useSelector((state: RootState) => state.cart.items);
  const { token } = useSelector((state: RootState) => state.auth);

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return { totalItems, totalPrice };
  }, [items]);

  const handleQuantityChange = (id: string, value: string) => {
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return;
    dispatch(updateQuantity({ id, quantity: num }));
  };

  const handleDecrease = (id: string, current: number) => {
    if (current <= 1) return;
    dispatch(updateQuantity({ id, quantity: current - 1 }));
  };

  const handleIncrease = (id: string, current: number) => {
    dispatch(updateQuantity({ id, quantity: current + 1 }));
  };

  const handleClearCart = () => {
    if (!window.confirm("Sepetteki tüm ürünleri silmek istediğinize emin misiniz?")) return;
    dispatch(clearCart());
  };

  const handleContinue = () => {
    // Kullanıcı login değilse → signin'e yönlendir
    if (!token) {
      toast.info("Devam etmek için lütfen giriş yapın.");
      // Girişten sonra tekrar sepete dönebilmesi için redirect paramı
      router.push("/signin?redirect=/sepetim");
      return;
    }

    // Kullanıcı login ise → şimdilik sadece bilgi ver
    // İleride burayı /odeme veya /teslimat adımına yönlendirebilirsin
    toast.success("Devam ediliyor...");
    // Örneğin:
    // router.push("/odeme");
  };

  // 🧺 SEPET BOŞSA
  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <HiOutlineShoppingBag className="w-7 h-7 text-gray-500" />
          </div>
          <h1 className="text-lg font-semibold">Sepetiniz şu anda boş</h1>
          <p className="text-sm text-gray-500 max-w-md">
            Henüz sepetinize ürün eklemediniz. Ürünleri inceleyerek sepetinizi
            doldurabilir ve hızlıca sipariş oluşturabilirsiniz.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center justify-center bg-gray-900 text-white px-5 py-2 rounded-md text-xs font-medium hover:bg-black transition-colors"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  // 🧺 SEPET DOLUYSA
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold mb-2">Sepetim</h1>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* Sol taraf: Ürün listesi */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 items-center bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
            >
              {/* Ürün resmi */}
              <div className="w-20 h-20 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                    Görsel yok
                  </div>
                )}
              </div>

              {/* Ürün bilgileri */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Birim fiyat:{" "}
                  <span className="font-medium text-gray-800">
                    {item.price.toFixed(2)} ₺
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Ara toplam:{" "}
                  <span className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} ₺
                  </span>
                </p>
              </div>

              {/* Adet & silme */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrease(item.id, item.quantity)}
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    className="w-12 text-center border border-gray-300 rounded text-xs py-1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                  />
                  <button
                    onClick={() => handleIncrease(item.id, item.quantity)}
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700"
                >
                  <FiTrash2 className="w-3 h-3" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sağ taraf: Özet kutusu */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-4">
          <h2 className="text-sm font-semibold">Sipariş Özeti</h2>

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Toplam ürün adedi</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Ürün toplamı</span>
              <span className="font-medium">
                {totalPrice.toFixed(2)} ₺
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-800">
              Ödenecek toplam
            </span>
            <span className="text-base font-bold text-gray-900">
              {totalPrice.toFixed(2)} ₺
            </span>
          </div>

          {/* DEVAM ET BUTONU */}
          <button
            onClick={handleContinue}
            className="w-full bg-gray-900 text-white py-2 rounded-md text-xs font-medium hover:bg-black transition-colors"
          >
            Devam Et
          </button>

          {/* SEPETİ TEMİZLE */}
          <button
            onClick={handleClearCart}
            className="w-full mt-1 border border-gray-300 text-gray-700 py-2 rounded-md text-[11px] hover:bg-gray-50 transition-colors"
          >
            Sepeti Temizle
          </button>

          <p className="text-[10px] text-gray-500 mt-1">
            Devam et butonuna tıkladığınızda, kayıtlı adres ve ödeme
            bilgilerinizi kullanarak siparişinizi kolayca tamamlayabilirsiniz.
            Giriş yapmamış kullanıcılar önce giriş sayfasına yönlendirilir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
