import type { Metadata } from "next";
import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import BasicDialog from "@/app/components/headless-ui/Dialog/BasicDialog";
import DialogWithBackdrop from "@/app/components/headless-ui/Dialog/DialogWithBackdrop";
import ScrollableDialog from "@/app/components/headless-ui/Dialog/ScrollableDialog";
import TranstionDialog from "@/app/components/headless-ui/Dialog/TranstionDialog";
import FramerAnimationDialog from "@/app/components/headless-ui/Dialog/FramerAnimationDialog";

export const metadata: Metadata = {
  title: "HeadlessUI Dialog",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Dialog",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Dialog" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <BasicDialog />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DialogWithBackdrop />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <ScrollableDialog />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <TranstionDialog />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <FramerAnimationDialog />
        </div>
      </div>
    </>
  );
};

export default page;
