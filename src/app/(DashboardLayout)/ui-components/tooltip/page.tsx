import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import TooltipStyle from "@/app/components/ui-components/Tooltip/TooltipStyle";
import TooltipTrigger from "@/app/components/ui-components/Tooltip/TooltipTrigger";
import DisableTooltip from "@/app/components/ui-components/Tooltip/DisableTooltip";
import AnimatioTooltip from "@/app/components/ui-components/Tooltip/AnimatioTooltip";
import TooltipPlacement from "@/app/components/ui-components/Tooltip/TooltipPlacement";

export const metadata: Metadata = {
  title: "Ui Tooltip",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tooltips",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Tooltips" items={BCrumb} />

      <div className="grid grid-cols-12 gap-30">
        {/* Tooltip Style */}
        <div className="lg:col-span-4 col-span-12">
          <TooltipStyle />
        </div>
        {/* Tooltip Trigger */}
        <div className="lg:col-span-4 col-span-12">
          <TooltipTrigger/>
        </div>
        {/* Tooltip Disable Icon */}
        <div className="lg:col-span-4 col-span-12">
          <DisableTooltip/>
        </div>
        {/* Animatio Tooltip */}
        <div className="col-span-12">
          <AnimatioTooltip/>
        </div>
         {/* Tooltip Placement */}
         <div className="col-span-12">
          <TooltipPlacement/>
        </div>
      </div>
    </>
  );
};

export default page;
