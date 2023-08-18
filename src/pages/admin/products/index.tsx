import { useRouter } from "next/router";
import React from "react";

const ProductsPage = () => {
  const router = useRouter();

  return (
    <div>
      <pre>{JSON.stringify(router.pathname, null, 2)}</pre>
    </div>
  );
};

export default ProductsPage;
