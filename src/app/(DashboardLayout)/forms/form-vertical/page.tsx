import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicLayout from "@/app/components/form-components/Form-Vertical/BasicLayout";
import BasicWithIcon from "@/app/components/form-components/Form-Vertical/BasicWithIcon";
import MulticolFormSeprator from "@/app/components/form-components/Form-Vertical/MulticolFormSeprator";
import CollapsibleSection from "@/app/components/form-components/Form-Vertical/CollapsibleSection";
import FormWithTabs from "@/app/components/form-components/Form-Vertical/FormWithTabs";
export const metadata: Metadata = {
  title: "Form Vertical",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Vertical",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Form Vertical" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6 col-span-12">
          <BasicLayout />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <BasicWithIcon />
        </div>
        <div className="col-span-12">
          <MulticolFormSeprator />
        </div>
        <div className="col-span-12">
          <CollapsibleSection/>
        </div>
        <div className="col-span-12">
          <FormWithTabs/>
        </div>
      </div>
    </>
  );
};

export default page;
