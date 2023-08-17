/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as gtag from "~/utils/gtag";
import Router from "next/router";
import NProgress from "nprogress";
import SEO from "next-seo.config";
import { DefaultSeo } from "next-seo";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Script from "next/script";
import { RootLayout } from "~/components/RootLayout";
import { Work_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp: AppType<{ session: Session | null; messages: any }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null; messages: any }>) => {
  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <NextUIProvider>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <SessionProvider session={session}>
          <DefaultSeo {...SEO} />
          <style jsx global>{`
            :root {
              --font-work-sans: ${workSans.style.fontFamily};
            }
          `}</style>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </SessionProvider>
      </NextUIProvider>
    </NextIntlClientProvider>
  );
};

export default api.withTRPC(MyApp);
