import SOCIALS from "./social";

const FOOTER = [
  {
    title: "Work",
    links: [
      { title: "FamilyFund", href: "/work/family-fund" },
      { title: "Unseal", href: "/work/unseal" },
      { title: "Phobia", href: "/work/phobia" },
      {
        title: (
          <>
            See all <span aria-hidden="true">&rarr;</span>
          </>
        ),
        href: "/work",
      },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Process", href: "/process" },
      { title: "Blog", href: "/blog" },
      { title: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: SOCIALS,
  },
];

export default FOOTER;
