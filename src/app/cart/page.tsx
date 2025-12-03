"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, updateQuantity, clearCart } from "@/redux/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (items.length === 0)
    return <div className="p-6 text-sm">Sepetiniz boş.</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Sepetim</h2>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border p-3 rounded-md"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.image}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-gray-600">{item.price} TL</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                dispatch(
                  updateQuantity({
                    id: item.id,
                    quantity: Number(e.target.value),
                  })
                )
              }
              min={1}
              className="w-12 border text-center rounded-md text-xs"
            />

            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="text-red-600 text-xs"
            >
              Sil
            </button>
          </div>
        </div>
      ))}

      {/* Toplam */}
      <div className="flex justify-between p-3 bg-gray-50 border rounded-md">
        <span className="font-medium">Toplam:</span>
        <span className="font-semibold">{total} TL</span>
      </div>

      {/* Sepeti Temizle */}
      <button
        onClick={() => dispatch(clearCart())}
        className="bg-red-600 text-white px-3 py-2 rounded-md text-xs"
      >
        Sepeti Temizle
      </button>
    </div>
  );
}
