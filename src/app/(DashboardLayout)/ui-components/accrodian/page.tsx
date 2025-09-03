import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicAccordion from "@/app/components/ui-components/Accordian/BasicAccordion";
import FlushAccordian from "@/app/components/ui-components/Accordian/FlushAccordion";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ui Accordion",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Accordion",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Accordion" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Basic */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BasicAccordion />
        </div>
        {/* Flush */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <FlushAccordian />
        </div>
      </div>
    </>
  );
};

export default page;
