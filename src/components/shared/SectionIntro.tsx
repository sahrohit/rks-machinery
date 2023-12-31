import clsx from "clsx";
import { type ReactNode } from "react";
import { type ContainerProps, Container } from "../layout/Container";
import { FadeIn } from "../layout/FadeIn";

interface SectionIntroProps extends ContainerProps {
  eyebrow?: string;
  title: string;
  smaller?: boolean;
  invert?: boolean;
  children?: ReactNode;
}

export function SectionIntro({
  eyebrow,
  title,
  children,
  smaller = false,
  invert = false,
  ...props
}: SectionIntroProps) {
  return (
    <Container {...props}>
      <FadeIn className="w-full">
        <h2>
          {eyebrow && (
            <>
              <span
                className={clsx(
                  "mb-6 block font-display text-base font-semibold",
                  invert ? "text-white" : "text-neutral-950"
                )}
              >
                {eyebrow}
              </span>
              <span className="sr-only"> - </span>
            </>
          )}
          <span
            className={clsx(
              "block font-display tracking-tight [text-wrap:balance]",
              smaller
                ? "text-2xl font-semibold"
                : "text-4xl font-medium sm:text-5xl",
              invert ? "text-white" : "text-neutral-950"
            )}
          >
            {title}
          </span>
        </h2>
        {children && (
          <div
            className={clsx(
              "mt-6 text-xl",
              invert ? "text-neutral-300" : "text-neutral-600"
            )}
          >
            {children}
          </div>
        )}
      </FadeIn>
    </Container>
  );
}
