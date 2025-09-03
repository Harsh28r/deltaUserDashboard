import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultTabs from "@/app/components/ui-components/Tabs/DefaultTabs";
import UnderlineTabs from "@/app/components/ui-components/Tabs/UnderlineTabs";
import TabsWithPill from "@/app/components/ui-components/Tabs/TabsWithPill";
import FullWidthTabs from "@/app/components/ui-components/Tabs/FullWidthTabs";
import StateTabs from "@/app/components/ui-components/Tabs/StateTabs";
export const metadata: Metadata = {
  title: "Ui Tabs",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tabs",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Tabs" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="col-span-12">
          <DefaultTabs />
        </div>
        {/* Underline Tabs */}
        <div className="col-span-12">
          <UnderlineTabs />
        </div>
         {/* Tabs With Pill */}
         <div className="col-span-12">
          <TabsWithPill />
        </div>
        {/* Full Width Tabs */}
        <div className="col-span-12">
          <FullWidthTabs />
        </div>
        {/* State Tabs */}
        <div className="col-span-12">
          <StateTabs />
        </div>
      </div>
    </>
  );
};

export default page;
