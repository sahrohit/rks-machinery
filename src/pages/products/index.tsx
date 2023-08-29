/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { type IProduct } from "~/components/admin/ProductForm";
import { Container } from "~/components/layout/Container";
import ProductCard, {
  ProductCardSkeleton,
} from "~/components/product/ProductCard";
import { SectionIntro } from "~/components/shared/SectionIntro";
import { api } from "~/utils/api";

const ProductsPage = () => {
  const { data, isLoading } = api.product.getProducts.useQuery();

  const router = useRouter();

  const t = useTranslations("Products");

  return (
    <Container>
      <SectionIntro
        title={t("heading")}
        className="my-8 text-center sm:my-12 lg:my-16"
      >
        <p>{t("sub-heading")}</p>
      </SectionIntro>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
        {isLoading || !data
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <ProductCardSkeleton key={`product-skeleton-${index + 1}`} />
              ))
          : data?.map((product) => (
              <ProductCard
                key={product.id}
                product={product as unknown as IProduct}
              />
            ))}
      </div>
    </Container>
  );
};

export default ProductsPage;

export const getStaticProps = async (ctx: GetStaticPropsContext) => ({
  props: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../../translations/${ctx.locale}.json`)).default,
  },
});
