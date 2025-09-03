import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import type { Metadata } from "next";
import DefaultRadio from "@/app/components/shadcn-form/Radio/DefaultRadio";
import FormRadio from "@/app/components/shadcn-form/Radio/FormRadio";

export const metadata: Metadata = {
  title: "Radio",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Radio",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Radio" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultRadio />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <FormRadio />
        </div>
      </div>
    </>
  );
};

export default page;
