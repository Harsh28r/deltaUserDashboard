"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "flowbite";
import {Navbar } from "flowbite-react";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
import PagesMenu from "./Pagesmenu";
import DemosMenu from "./DemosMenu";
import MobileDrawer from "./MobileDrawer";
import FrontPageMenu from "./FrontPageMenu";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`top-0 z-50 ${
          isSticky
            ? "bg-white dark:bg-dark shadow-md fixed w-full"
            : "bg-white dark:bg-dark"
        }`}
      >
        <Navbar className="fluid py-6 !px-0">
          <FullLogo />
          <MobileDrawer/>
          <Navbar.Collapse className="xl:block hidden">
            <DemosMenu />
            <FrontPageMenu/>
            <PagesMenu />
            <Navbar.Link as={Link} href="#">
              Documentation
            </Navbar.Link>
            <Navbar.Link as={Link} href="https://support.wrappixel.com/">
              Support
            </Navbar.Link>
            <Navbar.Link
              as={Link}
              href="/auth/auth1/login"
              className="bg-primary text-white text-sm hover:text-white dark:hover:text-white hover:bg-primaryemphasis py-2 px-5"
            >
              Login
            </Navbar.Link>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
