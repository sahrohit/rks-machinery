import { Container } from "~/components/layout/Container";
import { FadeIn, FadeInStagger } from "~/components/layout/FadeIn";
import StylizedImage from "./StylizedImage";
import labTools from "~/images/labtools.jpg";
import clsx from "clsx";
import { type ReactNode } from "react";
import { SectionIntro } from "~/components/shared/SectionIntro";
import { useTranslations } from "next-intl";

const Services = () => {
  const t = useTranslations("Services");

  return (
    <>
      <SectionIntro
        eyebrow={t("title")}
        title={t("heading")}
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>{t("sub-heading")}</p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
              <StylizedImage
                src={labTools}
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
            <ListItem title={t("service-1.heading")}>
              {t("service-1.content")}
            </ListItem>
            <ListItem title={t("service-2.heading")}>
              {t("service-2.content")}
            </ListItem>
            <ListItem title={t("service-3.heading")}>
              {t("service-3.content")}
            </ListItem>
            <ListItem title={t("service-4.heading")}>
              {t("service-4.content")}
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  );
};

export default Services;

export function List({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <FadeInStagger>
      <ul role="list" className={clsx("text-base text-neutral-600", className)}>
        {children}
      </ul>
    </FadeInStagger>
  );
}

export function ListItem({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <li className="group mt-10 first:mt-0">
      <FadeIn>
        <Border className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden">
          {title && (
            <strong className="font-semibold text-neutral-950">{`${title}. `}</strong>
          )}
          {children}
        </Border>
      </FadeIn>
    </li>
  );
}

interface BorderProps {
  className?: string;
  position?: "top" | "left";
  invert?: boolean;
  as?: React.ElementType;
  children?: ReactNode;
}

export function Border({
  className,
  position = "top",
  invert = false,
  as: Component = "div",
  ...props
}: BorderProps) {
  return (
    <Component
      className={clsx(
        className,
        "relative before:absolute after:absolute",
        invert
          ? "before:bg-white after:bg-white/10"
          : "before:bg-neutral-950 after:bg-neutral-950/10",
        position === "top" &&
          "before:left-0 before:top-0 before:h-px before:w-6 after:left-8 after:right-0 after:top-0 after:h-px",
        position === "left" &&
          "before:left-0 before:top-0 before:h-6 before:w-px after:bottom-0 after:left-0 after:top-8 after:w-px"
      )}
      {...props}
    />
  );
}
