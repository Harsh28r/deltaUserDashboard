import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import TitleToast from "@/app/components/shadcn-ui/Toast/TitleToast";
import ActionToast from "@/app/components/shadcn-ui/Toast/ActionToast";
import DestructiveToast from "@/app/components/shadcn-ui/Toast/DestructiveToast";
import PrimaryToast from "@/app/components/shadcn-ui/Toast/PrimaryToast";
import SecondaryToast from "@/app/components/shadcn-ui/Toast/SecondaryToast";
import WarningToast from "@/app/components/shadcn-ui/Toast/WarningToast";

export const metadata: Metadata = {
  title: "Ui Toast",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Toast",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Toast" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
            <TitleToast/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
            <ActionToast/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
            <DestructiveToast/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <PrimaryToast/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <SecondaryToast/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <WarningToast/>
        </div>
      </div>
    </>
  );
};

export default page;
