import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultProgress from "@/app/components/ui-components/Progressbar/DefaultProgress";
import LabelProgress from "@/app/components/ui-components/Progressbar/LabelProgress";
import LabelPostionProgress from "@/app/components/ui-components/Progressbar/LabelPostionProgress";
import ProgressSize from "@/app/components/ui-components/Progressbar/ProgressSize";
import ProgressColor from "@/app/components/ui-components/Progressbar/ProgressColor";
export const metadata: Metadata = {
  title: "Ui Progressbar",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Progress Bar",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Progress Bar" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Progress */}
        <div className="col-span-12">
          <DefaultProgress />
        </div>
        {/* Label Progress */}
        <div className="col-span-12">
          <LabelProgress />
        </div>
        {/* Label Postion Progress */}
        <div className="col-span-12">
          <LabelPostionProgress />
        </div>
        {/* Progress Size */}
        <div className="col-span-12">
          <ProgressSize />
        </div>
        {/* Progress Colors */}
        <div className="col-span-12">
          <ProgressColor />
        </div>
      </div>
    </>
  );
};

export default page;
