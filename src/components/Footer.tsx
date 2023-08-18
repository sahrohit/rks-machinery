/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { type SVGProps } from "react";
import { z } from "zod";
import { Container } from "~/components/layout/Container";
import { FadeIn } from "~/components/layout/FadeIn";
import { Logo } from "~/components/Logo";
import FOOTER from "~/config/footer";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

function Navigation() {
  return (
    <nav>
      <ul role="list" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {FOOTER.map((section) => (
          <li key={section.title}>
            <div className="font-display text-sm font-semibold tracking-wider text-neutral-950">
              {section.title}
            </div>
            <ul role="list" className="mt-4 text-sm text-neutral-700">
              {section.links.map((link) => (
                <li key={link.title} className="mt-4">
                  <Link
                    href={link.href}
                    className="transition hover:text-neutral-950"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 6" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3 10 .5v2H0v1h10v2L16 3Z"
      />
    </svg>
  );
}

type NewsLetterFormValues = {
  email: string;
};

const NewsLetterValidationSchema = z.object({
  email: z.string().email(),
});

function NewsletterForm() {
  const t = useTranslations("Footer");
  const { mutate } = api.newsletter.signUp.useMutation({
    onSuccess: () => {
      toast.success("You`ll hear from us very soon!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { register, handleSubmit } = useForm<NewsLetterFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(NewsLetterValidationSchema),
  });

  return (
    <form
      className="max-w-sm"
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
    >
      <h2 className="font-display text-sm font-semibold tracking-wider text-neutral-950">
        {t("newsletter-heading")}
      </h2>
      <p className="mt-4 text-sm text-neutral-700">
        {t("newsletter-subheading")}
      </p>
      <div className="relative mt-6">
        <Input
          {...register("email")}
          variant="bordered"
          type="email"
          label="Email"
        />
        <div className="absolute inset-y-1 right-1 flex justify-end">
          <Button
            type="submit"
            className="aspect-square h-full w-full rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
            isIconOnly
            aria-label="Like"
          >
            <ArrowIcon className="w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}

export function Footer() {
  return (
    <Container as="footer" className="mt-24 w-full sm:mt-32 lg:mt-40">
      <FadeIn>
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          <Navigation />
          <div className="flex lg:justify-end">
            <NewsletterForm />
          </div>
        </div>
        <div className="mb-20 mt-24 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-neutral-950/10 pt-12">
          <Link href="/" aria-label="Home">
            <Logo className="h-8" fillOnHover />
          </Link>
          <p className="text-sm text-neutral-700">
            © R K Shah Machinery Pvt. Ltd. {new Date().getFullYear()}
          </p>
        </div>
      </FadeIn>
    </Container>
  );
}
