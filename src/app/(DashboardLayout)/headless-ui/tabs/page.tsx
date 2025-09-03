import type { Metadata } from "next";
import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicTabs from "@/app/components/headless-ui/Tabs/BasicTabs";
import VerticalTabs from "@/app/components/headless-ui/Tabs/VerticalTabs";
import DisableTab from "@/app/components/headless-ui/Tabs/DisableTab";
import MannuallActiveTab from "@/app/components/headless-ui/Tabs/MannuallActiveTab";
import SpecifiedTab from "@/app/components/headless-ui/Tabs/SpecifiedTab";
import ListingForChangeTab from "@/app/components/headless-ui/Tabs/ListingForChangeTab";
import ControllTabSelect from "@/app/components/headless-ui/Tabs/ControllTabSelect";
import RenderAsElementTab from "@/app/components/headless-ui/Tabs/RenderAsElementTab";

export const metadata: Metadata = {
  title: "HeadlessUI Tabs",
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
        <div className="lg:col-span-6 col-span-12">
          <BasicTabs />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <VerticalTabs />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <DisableTab />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <MannuallActiveTab />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <SpecifiedTab />
        </div>
        <div className="lg:col-span-6 col-span-12">
            <ListingForChangeTab/>
        </div>
        <div className="lg:col-span-6 col-span-12">
            <ControllTabSelect/>
        </div>
        <div className="lg:col-span-6 col-span-12">
            <RenderAsElementTab/>
        </div>
      </div>
    </>
  );
};

export default page;
