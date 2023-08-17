/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import { Container } from "~/components/layout/Container";
import { Footer } from "~/components/Footer";
import { GridPattern } from "~/components/GridPattern";
import { Logo, Logomark } from "~/components/Logo";
import { Offices } from "~/components/Offices";
import { SocialMedia } from "~/components/SocialMedia";
import LocaleSwitcher from "~/components/ui/LocaleSwitcher";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";

interface RootLayoutProps {
  logoHovered: boolean | null;
  setLogoHovered: (hovered: boolean) => void | null;
}

const RootLayoutContext = createContext<RootLayoutProps>({
  logoHovered: null,
  setLogoHovered: () => null,
});

function Header({
  panelId,
  invert = false,
  icon: Icon,
  expanded,
  onToggle,
  toggleRef,
}: any) {
  const t = useTranslations("Navbar");
  const { logoHovered, setLogoHovered } = useContext(RootLayoutContext);

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Home"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <Logomark
            className="h-8 sm:hidden"
            invert={invert}
            filled={Boolean(logoHovered)}
          />
          <Logo
            className="hidden h-8 sm:block"
            invert={invert}
            filled={Boolean(logoHovered)}
          />
        </Link>
        <div className="flex items-center gap-x-8">
          <Button
            href="/test"
            as={NextLink}
            className="bg-neutral-950 text-white hover:bg-neutral-800"
          >
            {t("contact-us")}
          </Button>
          <LocaleSwitcher />
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded.toString()}
            aria-controls={panelId}
            className={clsx(
              "group -m-2.5 rounded-full p-2.5 transition",
              invert ? "hover:bg-white/10" : "hover:bg-neutral-950/10"
            )}
            aria-label="Toggle navigation"
          >
            <Icon
              className={clsx(
                "h-6 w-6",
                invert
                  ? "fill-white group-hover:fill-neutral-200"
                  : "fill-neutral-950 group-hover:fill-neutral-700"
              )}
            />
          </button>
        </div>
      </div>
    </Container>
  );
}

function NavigationRow({ children }: { children: ReactNode }) {
  return (
    <div className="even:mt-px sm:bg-neutral-950">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
      </Container>
    </div>
  );
}

interface NavigationItemProps {
  href: string;
  children: ReactNode;
}

function NavigationItem({ href, children }: NavigationItemProps) {
  return (
    <Link
      href={href}
      className="group relative isolate -mx-6 bg-neutral-950 px-6 py-10 even:mt-px sm:mx-0 sm:px-0 sm:py-16 sm:odd:pr-16 sm:even:mt-0 sm:even:border-l sm:even:border-neutral-800 sm:even:pl-16"
    >
      {children}
      <span className="absolute inset-y-0 -z-10 w-screen bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
    </Link>
  );
}

function Navigation() {
  const t = useTranslations("Navbar");

  return (
    <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/work">{t("our-work")}</NavigationItem>
        <NavigationItem href="/about">{t("about-us")}</NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem href="/process">{t("our-process")}</NavigationItem>
        <NavigationItem href="/blog">{t("blog")}</NavigationItem>
      </NavigationRow>
    </nav>
  );
}

function RootLayoutInner({ children }: { children: ReactNode }) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const openRef = useRef<any>();
  const closeRef = useRef<any>();
  const navRef = useRef<any>();
  const shouldReduceMotion = useReducedMotion();

  const t = useTranslations("Navbar");

  useEffect(() => {
    function onClick(event: any) {
      if (event.target.closest("a")?.href === window.location.href) {
        setExpanded(false);
      }
    }

    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <MotionConfig transition={shouldReduceMotion ? { duration: 0 } : undefined}>
      <header>
        <div
          className="absolute left-0 right-0 top-2 z-40 pt-14"
          aria-hidden={expanded ? "true" : undefined}
          // inert={expanded ? "" : undefined}
        >
          <Header
            panelId={panelId}
            icon={AiOutlineMenu}
            toggleRef={openRef}
            expanded={expanded}
            onToggle={() => {
              setExpanded((expanded) => !expanded);
              window.setTimeout(() =>
                closeRef.current?.focus({ preventScroll: true })
              );
            }}
          />
        </div>

        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? "auto" : "0.5rem" }}
          className="relative z-50 overflow-hidden bg-neutral-950 pt-2"
          aria-hidden={expanded ? undefined : "true"}
          // inert={expanded ? undefined : ""}
        >
          <motion.div layout className="bg-neutral-800">
            <div ref={navRef} className="bg-neutral-950 pb-16 pt-14">
              <Header
                invert
                panelId={panelId}
                icon={AiOutlineClose}
                toggleRef={closeRef}
                expanded={expanded}
                onToggle={() => {
                  setExpanded((expanded) => !expanded);
                  window.setTimeout(() =>
                    openRef.current?.focus({ preventScroll: true })
                  );
                }}
              />
            </div>
            <Navigation />
            <div className="relative bg-neutral-950 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-neutral-800">
              <Container>
                <div className="grid grid-cols-1 gap-y-10 pb-16 pt-10 sm:grid-cols-2 sm:pt-16">
                  <div>
                    <h2 className="font-display text-base font-semibold text-white">
                      {t("our-offices")}
                    </h2>
                    <Offices
                      invert
                      className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2"
                    />
                  </div>
                  <div className="sm:border-l sm:border-transparent sm:pl-16">
                    <h2 className="font-display text-base font-semibold text-white">
                      {t("follow-us")}
                    </h2>
                    <SocialMedia className="mt-6" invert />
                  </div>
                </div>
              </Container>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex flex-auto overflow-hidden bg-white pt-14"
      >
        <motion.div
          layout
          className="relative isolate flex w-full flex-col pt-9"
        >
          <GridPattern
            className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-neutral-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
            yOffset={-96}
            interactive
          />

          <main className="w-full flex-auto">{children}</main>

          <Footer />
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}

export function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <RootLayoutContext.Provider value={{ logoHovered, setLogoHovered }}>
      <RootLayoutInner key={pathname}>{children}</RootLayoutInner>
    </RootLayoutContext.Provider>
  );
}
