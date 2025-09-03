import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultPopover from "@/app/components/ui-components/Popover/DefaultPopover";
import CompanyProfile from "@/app/components/ui-components/Popover/CompanyProfile";
import ControlledPopover from "@/app/components/ui-components/Popover/ControlledPopover";
import DisableArrow from "@/app/components/ui-components/Popover/DisableArrow";
import ImagePopover from "@/app/components/ui-components/Popover/ImagePopover";
import PasswordPopover from "@/app/components/ui-components/Popover/PasswordPopover";
import PlacementPopover from "@/app/components/ui-components/Popover/PlacementPopover";
import TriggerType from "@/app/components/ui-components/Popover/TriggerType";
export const metadata: Metadata = {
  title: "Ui Popover",
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
        {/* Default */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <DefaultPopover />
        </div>
        {/* Company Profile */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <CompanyProfile />
        </div>
        {/* Controlled Popover */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <ControlledPopover />
        </div>
        {/* Disable Arrow */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <DisableArrow />
        </div>
        {/* Image Popover */}
        <div className="lg:col-span-6 col-span-12">
          <ImagePopover />
        </div>
        {/* Password Popover */}
        <div className="lg:col-span-6 col-span-12">
          <PasswordPopover />
        </div>
        {/* Placement Popover */}
        <div className="lg:col-span-8 col-span-12">
          <PlacementPopover />
        </div>
        {/* Trigger Type */}
        <div className="lg:col-span-4 col-span-12">
          <TriggerType/>
        </div>
      </div>
    </>
  );
};

export default page;
