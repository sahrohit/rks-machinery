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

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) => {
  return (
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
        <Component {...pageProps} />
      </SessionProvider>
    </NextUIProvider>
  );
};

export default api.withTRPC(MyApp);
