/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GetStaticPropsContext } from "next";
import Link from "next/link";

const OfflinePage = () => {
  return (
    <div className="bg-white">
      <main className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl py-16 sm:py-24">
          <div className="text-center">
            <p className="text-base font-semibold">Connection Lost</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              You are not connected to the internet right now.
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              We&apos;ll try to reconnect automatically. Sit Tight!.
            </p>
          </div>

          <div className="mt-12 flex flex-row justify-center">
            <Link
              href="/"
              className="text-base font-medium hover:text-gray-500"
            >
              Try again
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfflinePage;

export const getStaticProps = async (ctx: GetStaticPropsContext) => ({
  props: {
    messages: (await import(`../translations/${ctx.locale}.json`)).default,
  },
});
