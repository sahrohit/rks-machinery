import Image from "next/image";
import type { IProduct } from "../admin/ProductForm";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative">
      <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
        <div className="relative h-full w-full">
          <Image
            fill
            src={product.images[0]!.url}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <h3 className="mt-4 text-sm text-gray-700">
        <a href={`/products/${product.slug}`}>
          <span className="absolute inset-0" />
          {product.name}
        </a>
      </h3>
      <p className="mt-1 text-sm text-gray-500">{product.categoryId}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">
        रू {product.price}
      </p>
    </div>
  );
};

export default ProductCard;

export const ProductCardSkeleton = () => {
  return (
    <div className="group relative">
      <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
        <div className="relative h-full w-full">
          <div className="h-full w-full animate-pulse bg-gray-300 object-cover object-center" />
        </div>
      </div>
      <h3 className="mt-4 text-sm text-gray-700">
        <span className="absolute inset-0" />
        <div className="h-4 w-1/2 animate-pulse bg-gray-300" />
      </h3>
      <div className="mt-1 text-sm text-gray-500">
        <div className="h-4 w-1/4 animate-pulse bg-gray-300" />
      </div>
      <div className="mt-1 text-sm font-medium text-gray-900">
        <div className="h-4 w-1/4 animate-pulse bg-gray-300" />
      </div>
    </div>
  );
};
