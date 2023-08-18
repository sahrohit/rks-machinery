import { useRouter } from "next/router";
import React from "react";

const ProductPage = () => {
  const router = useRouter();

  return (
    <div>
      {router.pathname}

      <p>{router.pathname.includes("/admin/products").toString()}</p>
    </div>
  );
};

export default ProductPage;
