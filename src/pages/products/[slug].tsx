/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import PageIntro from "~/components/shared/PageIntro";
import { api } from "~/utils/api";

const features = [
  { name: "Origin", description: "Designed by Good Goods, Inc." },
  {
    name: "Material",
    description:
      "Solid walnut base with rare earth magnets and powder coated steel card cover",
  },
  { name: "Dimensions", description: '6.25" x 3.55" x 1.15"' },
  { name: "Finish", description: "Hand sanded and finished with natural oil" },
  { name: "Includes", description: "Wood card tray and 3 refill packs" },
  {
    name: "Considerations",
    description:
      "Made from natural materials. Grain and color vary with each item.",
  },
];

const ProductPage = () => {
  const router = useRouter();

  const { data, isLoading, error } = api.product.getProductBySlug.useQuery({
    slug: router.query.slug as string,
  });

  if (isLoading || !data) return <p>Loading...</p>;

  return (
    <>
      <PageIntro
        eyebrow={data.category?.name ?? ""}
        title={data?.name ?? ""}
        centered
      >
        <p>
          {data?.price === -1 ? `Contact us for pricing` : `रू ${data?.price}`}
        </p>
      </PageIntro>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
            <div>
              <div className="border-b border-gray-200 pb-10">
                <h2 className="font-medium text-gray-500">{data.desc}</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Features
                </p>
              </div>

              <dl className="mt-10 space-y-10">
                {data.features.map((feature) => (
                  <div key={feature.title}>
                    <dt className="text-sm font-medium text-gray-900">
                      {feature.title}
                    </dt>
                    <dd className="mt-3 text-sm text-gray-500">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/product-feature-09-main-detail.jpg"
                  alt="Black kettle with long pour spot and angled body on marble counter next to coffee mug and pour-over system."
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:gap-8">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/product-feature-09-detail-01.jpg"
                    alt="Detail of temperature setting button on kettle bass with digital degree readout."
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/product-feature-09-detail-02.jpg"
                    alt="Kettle spout pouring boiling water into coffee grounds in pour-over mug."
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            <img
              src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
              alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
              className="rounded-lg bg-gray-100"
            />
            <img
              src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-02.jpg"
              alt="Top down view of walnut card tray with embedded magnets and card groove."
              className="rounded-lg bg-gray-100"
            />
            <img
              src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-03.jpg"
              alt="Side of walnut card tray with card groove and recessed card area."
              className="rounded-lg bg-gray-100"
            />
            <img
              src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-04.jpg"
              alt="Walnut card tray filled with cards and card angled in dedicated groove."
              className="rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Technical Specifications
            </h2>
            <p className="mt-4 text-gray-500">
              The walnut wood card tray is precision milled to perfectly fit a
              stack of Focus cards. The powder coated steel divider separates
              active cards from new ones, or can be used to archive important
              task lists.
            </p>

            <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="border-t border-gray-200 pt-4"
                >
                  <dt className="font-medium text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;

export const getStaticProps = async (ctx: GetStaticPropsContext) => ({
  props: {
    messages: (await import(`../../translations/${ctx.locale}.json`)).default,
  },
});

export const getStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});
