import clsx from "clsx";
import { useTranslations } from "next-intl";
import OFFICES from "~/config/office";

interface OfficeProps {
  name: string;
  invert?: boolean;
  children?: React.ReactNode;
}

function Office({ name, children, invert = false }: OfficeProps) {
  return (
    <address
      className={clsx(
        "text-sm not-italic",
        invert ? "text-neutral-300" : "text-neutral-600"
      )}
    >
      <strong className={invert ? "text-white" : "text-neutral-950"}>
        {name}
      </strong>
      <br />
      {children}
    </address>
  );
}

export function Offices({ invert = false, ...props }) {
  const t = useTranslations("Address");

  return (
    <ul role="list" {...props}>
      {OFFICES.map((office) => (
        <li key={t(office.title)}>
          <Office name={t(office.title)} invert={invert}>
            {t(office.addressline1)}
            <br />
            {t(office.addressline2)}
          </Office>
        </li>
      ))}
    </ul>
  );
}
