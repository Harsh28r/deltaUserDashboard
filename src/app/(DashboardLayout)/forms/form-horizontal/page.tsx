import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicLayout from "@/app/components/form-components/Form-Horizontal/BasicLayout";
import BasicWithIcon from "@/app/components/form-components/Form-Horizontal/BasicWithIcon";
import FormSeprator from "@/app/components/form-components/Form-Horizontal/FormSeprator";
import FormLableAlignment from "@/app/components/form-components/Form-Horizontal/FormLableAlignment";
import CollapsibalForm from "@/app/components/form-components/Form-Horizontal/CollapsibalForm";
import FormWithTabs from "@/app/components/form-components/Form-Horizontal/FormWithTabs";
export const metadata: Metadata = {
  title: "Form Horizontal",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Horizontal",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Form Horizontal" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="col-span-12">
          <BasicLayout />
        </div>
        <div className="col-span-12">
          <BasicWithIcon />
        </div>
        <div className="col-span-12">
          <FormSeprator />
        </div>
        <div className="col-span-12">
          <FormLableAlignment />
        </div>
        <div className="col-span-12">
          <CollapsibalForm />
        </div>
        <div className="col-span-12">
          <FormWithTabs />
        </div>
      </div>
    </>
  );
};

export default page;
