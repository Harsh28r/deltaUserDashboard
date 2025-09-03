import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import BasicCombobox from "@/app/components/shadcn-ui/Combobox/BasicCombobox";
import PopoverCombobox from "@/app/components/shadcn-ui/Combobox/PopoverCombobox";
import DropdownCombobox from "@/app/components/shadcn-ui/Combobox/DropdownCombobox";
import FormCombo from "@/app/components/shadcn-ui/Combobox/FormCombo";


export const metadata: Metadata = {
  title: "Ui Combobox",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Combobox",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Combobox" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <BasicCombobox />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <PopoverCombobox />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DropdownCombobox />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <FormCombo/>
        </div>
      </div>
    </>
  );
};

export default page;
