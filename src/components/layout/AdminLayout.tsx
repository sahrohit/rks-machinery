import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  AiOutlineBars,
  AiOutlineCalendar,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineClose,
  AiOutlineBarChart,
} from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { RxActivityLog } from "react-icons/rx";
import clsx from "clsx";
import { Logo } from "../Logo";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import PageLoader from "../shared/PageLoader";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";

const navigation = [
  { name: "Overview", href: "/admin", icon: AiOutlineBarChart },
  { name: "Products", href: "/admin/products", icon: AiOutlineHome },
  { name: "Category", href: "/admin/category", icon: BiCategory },
  { name: "Team", href: "/admin/team", icon: AiOutlineUser },
  { name: "Newsletter", href: "/admin/newsletter", icon: AiOutlineCalendar },
  { name: "Activity Log", href: "/admin/activity", icon: RxActivityLog },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <PageLoader label="User Loading" />;
  }

  if (status === "unauthenticated") {
    void router.push("/api/auth/signin");
    return <PageLoader label="User Loading" />;
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <AiOutlineClose
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
                    <Link href="/" aria-label="Home">
                      <Logo
                        className="hidden h-8 sm:block"
                        invert={false}
                        filled={true}
                      />
                    </Link>
                    <nav className="mt-5 space-y-1 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            router.pathname.includes(item.href)
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={clsx(
                              router.pathname.includes(item.href)
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <UserProfile
                    name={session?.user.name ?? "Anonymous"}
                    image={
                      session?.user.image ??
                      `https://api.dicebear.com/6.x/avataaars-neutral/svg?seed=${session?.user.name}`
                    }
                  />
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0"></div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <Link href="/" aria-label="Home">
                  <Logo
                    className="hidden h-8 sm:block"
                    invert={false}
                    filled={true}
                  />
                </Link>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      router.pathname.includes(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        router.pathname.includes(item.href)
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <UserProfile
              name={session?.user.name ?? "Anonymous"}
              image={
                session?.user.image ??
                `https://api.dicebear.com/6.x/avataaars-neutral/svg?seed=${session?.user.name}`
              }
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <AiOutlineBars className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;

const UserProfile = ({ name, image }: { name: string; image: string }) => {
  const router = useRouter();

  return (
    <div className="flex flex-shrink-0 flex-col border-t border-gray-200 p-4">
      <a href="#" className="group block w-full flex-shrink-0">
        <div className="flex items-center">
          <div>
            <Image
              className="rounded-full"
              alt="Profile Picture"
              width={40}
              height={40}
              src={image}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {name}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              View profile
            </p>
          </div>
        </div>
      </a>
      <Button
        color="danger"
        className="my-4"
        onClick={() => {
          router
            .push("/")
            .then(() => void signOut())
            .catch((err) => console.log(err));
        }}
      >
        Logout
      </Button>
    </div>
  );
};
