import type { Metadata } from "next";
import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicPopover from "@/app/components/headless-ui/Popover/BasicPopover";
import GroupingPopover from "@/app/components/headless-ui/Popover/GroupingPopover";
import PopoverWidth from "@/app/components/headless-ui/Popover/PopoverWidth";
import PopoverPositioning from "@/app/components/headless-ui/Popover/PopoverPositioning";
import PopoverBackdrops from "@/app/components/headless-ui/Popover/PopoverBackdrop";
import PopoverTransition from "@/app/components/headless-ui/Popover/PopoverTransition";
import FramerMotionPopover from "@/app/components/headless-ui/Popover/FramerMotionPopover";
import ClosingPopoverManual from "@/app/components/headless-ui/Popover/ClosingPopoverManual";
import RenderAsElement from "@/app/components/headless-ui/Popover/RenderAsElement";

export const metadata: Metadata = {
  title: "HeadlessUI Popover",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Popover",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Popover" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <BasicPopover />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <GroupingPopover />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <PopoverWidth />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <PopoverPositioning />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <PopoverBackdrops />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <PopoverTransition />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <FramerMotionPopover />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <ClosingPopoverManual />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <RenderAsElement />
        </div>
      </div>
    </>
  );
};

export default page;
