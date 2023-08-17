/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { Container } from "~/components/layout/Container";
import { FadeIn } from "~/components/layout/FadeIn";
import Clients from "~/components/pages/home/Clients";
import Services from "~/components/pages/home/Services";
import { Testimonial } from "~/components/shared/Testimonial";
import logoPhobiaDark from "~/images/clients/phobia/logo-dark.svg";

export default function Home() {
  const t = useTranslations("Home");
  const testimonial = useTranslations("Testimonial");

  return (
    <>
      <Head>
        <title>RK Shah Machinery</title>
      </Head>
      <Container className="mt-24 sm:mt-32 md:mt-56">
        <FadeIn className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
            {t("landing-heading")}
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            {t("landing-subheading")}
          </p>
        </FadeIn>
      </Container>
      <Clients />
      <Testimonial
        className="mt-24 sm:mt-32 lg:mt-40"
        client={{ name: "Phobia", logo: logoPhobiaDark }}
      >
        {testimonial("content")}
      </Testimonial>
      <Services />
    </>
  );
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => ({
  props: {
    messages: (await import(`../translations/${ctx.locale}.json`)).default,
  },
});
