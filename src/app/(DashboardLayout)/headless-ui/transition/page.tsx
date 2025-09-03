import type { Metadata } from "next";
import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicTransition from "@/app/components/headless-ui/Transition/BasicTransition";
import EnterLeaveTransition from "@/app/components/headless-ui/Transition/EnterLeaveTransition";
import CoordinationTransition from "@/app/components/headless-ui/Transition/CoordinationTransition";
import ClickTransition from "@/app/components/headless-ui/Transition/ClickTransition";
import OnIntialAmmount from "@/app/components/headless-ui/Transition/OnIntialAmmount";

export const metadata: Metadata = {
  title: "HeadlessUI Transition",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Transition",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Transition" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 col-span-12">
          <BasicTransition />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <EnterLeaveTransition />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <CoordinationTransition />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <ClickTransition />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <OnIntialAmmount />
        </div>
      </div>
    </>
  );
};

export default page;
