import Link from "next/link";
import clsx from "clsx";
import SOCIALS from "~/config/social";

interface SocialMediaProps {
  className?: string;
  invert?: boolean;
}

export function SocialMedia({ className, invert = false }: SocialMediaProps) {
  return (
    <ul
      role="list"
      className={clsx(
        "flex gap-x-10",
        invert ? "text-white" : "text-neutral-950",
        className
      )}
    >
      {SOCIALS.map((socialMediaProfile) => (
        <li key={socialMediaProfile.title}>
          <Link
            href={socialMediaProfile.href}
            aria-label={socialMediaProfile.title}
            className={clsx(
              "transition",
              invert ? "hover:text-neutral-200" : "hover:text-neutral-700"
            )}
          >
            <socialMediaProfile.icon className="h-6 w-6 fill-current" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
