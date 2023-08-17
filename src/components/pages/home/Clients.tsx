import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import { Container } from "~/components/layout/Container";
import { FadeIn, FadeInStagger } from "~/components/layout/FadeIn";
import logoBrightPath from "~/images/clients/bright-path/logo-light.svg";
import logoFamilyFund from "~/images/clients/family-fund/logo-light.svg";
import logoGreenLife from "~/images/clients/green-life/logo-light.svg";
import logoHomeWork from "~/images/clients/home-work/logo-light.svg";
import logoMailSmirk from "~/images/clients/mail-smirk/logo-light.svg";
import logoNorthAdventures from "~/images/clients/north-adventures/logo-light.svg";
import logoPhobiaLight from "~/images/clients/phobia/logo-light.svg";
import logoUnseal from "~/images/clients/unseal/logo-light.svg";

const CLIENTS = [
  {
    client: "Phobia",
    logo: logoPhobiaLight as StaticImageData,
  },
  {
    client: "Family Fund",
    logo: logoFamilyFund as StaticImageData,
  },
  {
    client: "Unseal",
    logo: logoUnseal as StaticImageData,
  },
  {
    client: "Mail Smirk",
    logo: logoMailSmirk as StaticImageData,
  },
  {
    client: "Home Work",
    logo: logoHomeWork as StaticImageData,
  },
  {
    client: "Green Life",
    logo: logoGreenLife as StaticImageData,
  },
  {
    client: "Bright Path",
    logo: logoBrightPath as StaticImageData,
  },
  {
    client: "North Adventures",
    logo: logoNorthAdventures as StaticImageData,
  },
];

const Clients = () => {
  const t = useTranslations("Home");

  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-20 sm:mt-32 sm:py-32 lg:mt-56">
      <Container>
        <FadeIn className="flex items-center gap-x-8">
          <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
            {t("client-heading")}
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul
            role="list"
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
          >
            {CLIENTS.map(({ client, logo }) => (
              <li key={client}>
                <FadeIn>
                  <Image src={logo} alt={client} unoptimized />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  );
};

export default Clients;
