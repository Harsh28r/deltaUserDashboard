import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <div className="bg-white dark:bg-dark">
        <div className="container">
          <div className="pt-20 pb-10 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <div>
              <p className="text-darklink">
                All rights reserved by MaterialM.<br></br>
                Designed & Developed by{" "}
                <Link
                  href="https://www.wrappixel.com/"
                  target="_blank"
                  className="text-ld font-medium underline underline-offset-4 decoration-primary text-primary-ld"
                >
                  {" "}
                  Wrappixel
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
