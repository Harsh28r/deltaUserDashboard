import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import type { Metadata } from "next";
import DefaultSelect from "@/app/components/shadcn-form/Select/DefaultSelect";
import ScrollableSelect from "@/app/components/shadcn-form/Select/ScrollableSelect";
import FormSelect from "@/app/components/shadcn-form/Select/FormSelect";

export const metadata: Metadata = {
  title: "Form Select",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Select",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Select" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DefaultSelect />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <ScrollableSelect />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <FormSelect />
        </div>
      </div>
    </>
  );
};

export default page;
