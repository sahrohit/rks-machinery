import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

const ProductPage = () => {
  const router = useRouter();

  const { data, isLoading, error } = api.product.getProductBySlug.useQuery({
    slug: router.query.slug as string,
  });

  return (
    <div>
      {router.pathname}

      <p>{router.pathname.includes("/admin/products").toString()}</p>

      <pre>
        {JSON.stringify(
          {
            router: router,
            data: data,
            isLoading: isLoading,
            error: error,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default ProductPage;
