import FavIcon from "@/assets/favicon.svg";
import Logo from "@/assets/logo.svg";
import LogoDark from "@/assets/logo-dark.svg";
import { useProfileValue } from "@/context/ProfileContext";
import { Button } from "@chakra-ui/button";
import { Spinner, Box, useColorModeValue } from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ClockIcon,
  LinkIcon,
  SelectorIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { useAppColorMode } from "../hooks/useColorMode";

export default function Shell(props: {
  centered?: boolean;
  large?: boolean;
  title?: string;
  heading?: ReactNode;
  subtitle?: ReactNode;
  CTA?: ReactNode;
  children: ReactNode;
  HeadingLeftIcon?: ReactNode;
  backPath?: string; // renders back button to specified path
  // use when content needs to expand with flex
  flexChildrenContainer?: boolean;
}) {
  const { pathname } = useLocation();
  const { profile } = useProfileValue();
  const profilePictureSrc = profile?.imageURI;
  const navBg = useColorModeValue("white", "whiteAlpha.50");
  const navItemCurrentBg = useColorModeValue("gray.50", "whiteAlpha.200");
  const { colorMode } = useAppColorMode();
  const logo = colorMode === "light" ? LogoDark : Logo;

  const navigation = [
    {
      name: "Session Types",
      href: "/session-types",
      icon: LinkIcon,
      current: pathname.startsWith("/session-types"),
    },
    {
      name: "Availability",
      href: "/availability",
      icon: ClockIcon,
      current: pathname.startsWith("/availability"),
    },
    // {
    //   name: "settings",
    //   href: "/settings/profile",
    //   icon: CogIcon,
    //   current: pathname.startsWith("/settings"),
    // },
  ];
  return (
    <Box className={classNames("flex h-screen overflow-hidden text-left")}>
      <div className="hidden md:flex lg:flex-shrink-0">
        <Box className="flex w-14 flex-col lg:w-56" bg={navBg}>
          <Box className="flex h-0 flex-1 flex-col border-r">
            <div className="flex flex-1 flex-col overflow-y-auto pt-3 pb-4 lg:pt-5">
              <Link to="/session-types" className="block px-2">
                <span className="inline lg:hidden">
                  <img
                    className="mx-auto"
                    alt="Sessions"
                    title="Session"
                    src={FavIcon}
                  />
                </span>
                <span className="hidden lg:inline">
                  <img
                    className="mx-auto"
                    alt="Sessions"
                    title="Session"
                    src={logo}
                  />
                </span>
              </Link>
              {
                <nav className="mt-2 flex-1 space-y-1 px-2 lg:mt-5">
                  {navigation.map((item) => (
                    <Fragment key={item.name}>
                      <Link to={item.href}>
                        <Box
                          bg={item.current ? navItemCurrentBg : ""}
                          opacity={item.current ? 1 : 0.5}
                          _hover={{ bg: navItemCurrentBg, opacity: 1 }}
                          className={classNames(
                            "group flex items-center rounded-sm px-2 py-2 my-2 text-sm font-medium"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-neutral-500"
                                : "text-neutral-400 group-hover:text-neutral-500",
                              "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                            )}
                            aria-hidden="true"
                          />
                          <span className="hidden lg:inline ml-2">
                            {item.name}
                          </span>
                        </Box>
                      </Link>
                    </Fragment>
                  ))}
                </nav>
              }
            </div>
            <div className="rounded-sm mb-2 pb-2 pl-3 pt-2 pr-2 hover:bg-gray-100 lg:mx-2 lg:pl-2">
              <div className="text-left">
                {profile && (
                  <Link to={"/profile"}>
                    <div
                      className={classNames(
                        "text-neutral-500 hover:text-neutral-900",
                        "group flex-1 flex-shrink-1 flex justify-center items-center py-2 my-2 text-sm font-medium"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {profilePictureSrc ? (
                          <img
                            className="h-6 w-6 rounded-full"
                            src={profilePictureSrc}
                          />
                        ) : (
                          <UserCircleIcon
                            className={classNames(
                              "text-neutral-400 group-hover:text-neutral-500",
                              "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="hidden lg:flex ml-2 flex-row items-center flex-grow">
                        <div className="items-center justify-center flex-grow">
                          <span className="text-sm block max-w-24 overflow-hidden truncate">
                            {profile.handle}
                          </span>
                        </div>
                        <SelectorIcon
                          className={classNames(
                            "text-neutral-400 group-hover:text-neutral-500",
                            "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </div>
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <main
          className={classNames(
            "relative z-0 flex-1 overflow-y-auto focus:outline-none",
            status === "authenticated" && "max-w-[1700px]",
            props.flexChildrenContainer && "flex flex-col"
          )}
        >
          {/* show top navigation for md and smaller (tablet and phones) */}

          <div
            className={classNames(
              props.centered && "mx-auto md:max-w-5xl",
              props.flexChildrenContainer && "flex flex-1 flex-col",
              "py-8"
            )}
          >
            {!!props.backPath && (
              <div className="mx-3 mb-8 sm:mx-8">
                <Button
                  onClick={() => {
                    //TODO: back
                  }}
                  leftIcon={<ArrowLeftIcon />}
                  color="secondary"
                >
                  Back
                </Button>
              </div>
            )}
            {props.heading && props.subtitle && (
              <div
                className={classNames(
                  "block min-h-[80px] justify-between px-4 sm:flex sm:px-6 md:px-8"
                )}
              >
                {props.HeadingLeftIcon && (
                  <div className="ltr:mr-4">{props.HeadingLeftIcon}</div>
                )}
                <div className="mb-8 w-full">
                  <h1 className="font-cal mb-1 text-xl font-bold capitalize tracking-wide text-gray-900">
                    {props.heading}
                  </h1>
                  <p className="min-h-10 text-sm text-neutral-500 ltr:mr-4 rtl:ml-4">
                    {props.subtitle}
                  </p>
                </div>
                {props.CTA && (
                  <div className="mb-4 flex-shrink-0">{props.CTA}</div>
                )}
              </div>
            )}
            <div
              className={classNames(
                "px-4 sm:px-6 md:px-8",
                props.flexChildrenContainer && "flex flex-1 flex-col"
              )}
            >
              {props.children}
            </div>
          </div>
        </main>
      </div>
      <div className="fixed right-3 bottom-3">
        <ColorModeSwitcher />
      </div>
    </Box>
  );
}
