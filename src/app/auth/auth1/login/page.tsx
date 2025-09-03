
import React from "react";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";

import AuthLogin from "../../authforms/AuthLogin";
import LeftSidebarPart from "../LeftSidebarPart";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Login",
  description: "User Login",
};

import Link from "next/link";
const Login = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div className="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-darkgray">
          <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-dark lg:block hidden relative overflow-hidden">
            <LeftSidebarPart />
          </div>
          <div className="xl:col-span-8 lg:col-span-8 col-span-12 sm:px-12 px-4">
            <div className="flex h-screen items-center px-3 lg:justify-start justify-center">
              <div className="max-w-[420px] w-full mx-auto">
                <Logo />
                <h3 className="text-2xl font-bold my-3">Sign In</h3>
                <p className="text-darklink text-sm font-medium">
                  User Dashboard
                </p>
                
                <AuthLogin />
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
