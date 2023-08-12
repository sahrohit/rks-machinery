/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { withAxiom } from 'next-axiom';
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  i18n: {
    locales: ["en", "np"],
    defaultLocale: "en",
  },
};


export default withAxiom(config)
