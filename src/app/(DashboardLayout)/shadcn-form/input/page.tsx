import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import type { Metadata } from "next";
import SimpleInput from "@/app/components/shadcn-form/Input/SimpleInput";
import InputWithLabel from "@/app/components/shadcn-form/Input/InputWithLabel";
import Forminput from "@/app/components/shadcn-form/Input/Forminput";
import OtpInput from "@/app/components/shadcn-form/Input/OtpInput";
import DisabledInput from "@/app/components/shadcn-form/Input/DisabledInput";
import OtpInputSeprator from "@/app/components/shadcn-form/Input/OtpInputSeprator";
import ControlledOtpInput from "@/app/components/shadcn-form/Input/ControlledOtpInput";
import DefaultTextarea from "@/app/components/shadcn-form/Input/DefaultTextarea";
import TextareaWithText from "@/app/components/shadcn-form/Input/TextareaWithText";
import FormwithTextarea from "@/app/components/shadcn-form/Input/FormwithTextarea";

export const metadata: Metadata = {
  title: "Form Input",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Input",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Input" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SimpleInput />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <InputWithLabel />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
            <Forminput/>
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
            <DisabledInput/>
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
            <DefaultTextarea/>
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
            <TextareaWithText/>
        </div>
        <div className="col-span-12">
            <FormwithTextarea/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
            <OtpInput/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
            <OtpInputSeprator/>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
            <ControlledOtpInput/>
        </div>
      </div>
    </>
  );
};

export default page;
