import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import BasicCollapse from "@/app/components/shadcn-ui/Collapsible/BasicCollapse";
import AdvanceCollapse from "@/app/components/shadcn-ui/Collapsible/AdvanceCollapse";

export const metadata: Metadata = {
  title: "Ui Collapsible",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Collapsible",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Collapsible" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Basic */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BasicCollapse />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <AdvanceCollapse />
        </div>
      </div>
    </>
  );
};

export default page;
