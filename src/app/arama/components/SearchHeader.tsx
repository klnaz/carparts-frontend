export default function SearchHeader({ q, total }: { q: string; total: number }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold text-gray-900">Arama Sonuçları</h1>
      <p className="text-sm text-gray-500">
        {q ? `“${q}” için ${total} ürün bulundu.` : `${total} ürün listeleniyor.`}
      </p>
    </div>
  );
}
