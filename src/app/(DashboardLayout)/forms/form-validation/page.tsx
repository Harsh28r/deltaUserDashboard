import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import InputValidationOne from "@/app/components/form-components/Form-Validation/InputValidationOne";
import InputValidationTwo from "@/app/components/form-components/Form-Validation/InputValidationTwo";
import OnLeaveValidation from "@/app/components/form-components/Form-Validation/OnLeaveValidation";
import SelectValidation from "@/app/components/form-components/Form-Validation/SelectValidation";
import RadioValidation from "@/app/components/form-components/Form-Validation/RadioValidation";
import CheckBoxValidation from "@/app/components/form-components/Form-Validation/CheckBoxValidation";
export const metadata: Metadata = {
  title: "Form Validation",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Validation",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Form Validation" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6 col-span-12">
          <InputValidationOne />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <InputValidationTwo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <OnLeaveValidation />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <SelectValidation />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <RadioValidation />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <CheckBoxValidation />
        </div>
      </div>
    </>
  );
};

export default page;
