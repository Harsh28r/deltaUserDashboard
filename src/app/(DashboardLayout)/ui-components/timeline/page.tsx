import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultTimeline from "@/app/components/ui-components/Timeline/DefaultTimeline";
import VerticalTimeline from "@/app/components/ui-components/Timeline/VerticalTimeline";
import HorizontalTimeline from "@/app/components/ui-components/Timeline/HorizontalTimeline";
export const metadata: Metadata = {
  title: "Ui Timeline",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Timeline",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Timeline" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className=" col-span-12">
          <DefaultTimeline />
        </div>
         {/* Vertical Timeline */}
         <div className=" col-span-12">
          <VerticalTimeline />
        </div>
         {/* Horizontal Timeline */}
         <div className=" col-span-12">
          <HorizontalTimeline />
        </div>
      </div>
    </>
  );
};

export default page;
