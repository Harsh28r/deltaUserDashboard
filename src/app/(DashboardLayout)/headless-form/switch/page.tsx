import type { Metadata } from "next";
import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicSwitches from "@/app/components/headless-form/Switch/BasicSwitches";
import DefaultOnSwitches from "@/app/components/headless-form/Switch/DefaultOnSwitches";
import DisabledSwitches from "@/app/components/headless-form/Switch/DisabledSwitches";
import WithLabelSwitch from "@/app/components/headless-form/Switch/WithLabelSwitch";
import WithTransitionsSwitch from "@/app/components/headless-form/Switch/WithTransitions";
import RenderSwitches from "@/app/components/headless-form/Switch/RenderSwitches";

export const metadata: Metadata = {
  title: "Headless Form Switch",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Switch",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Switch" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <BasicSwitches />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DefaultOnSwitches />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DisabledSwitches />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <WithLabelSwitch />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <WithTransitionsSwitch />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <RenderSwitches />
        </div>
      </div>
    </>
  );
};

export default page;
