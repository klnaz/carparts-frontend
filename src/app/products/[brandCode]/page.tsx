// src/app/products/[brandCode]/page.tsx

import React from 'react';

// This component will receive params from the dynamic route
const ProductDetailPage = ({ params }: { params: { brandCode: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Detail Page</h1>
      <p className="text-lg">
        Details for product with brand code: 
        <span className="font-semibold text-red-600 ml-2">{params.brandCode}</span>
      </p>
      {/* Later, you can fetch and display full product details here */}
    </div>
  );
};

export default ProductDetailPage;
