import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultSidebar from "@/app/components/ui-components/Sidebar/DefaultSidebar";
import MultilevelDropdown from "@/app/components/ui-components/Sidebar/MultilevelDropdown";
import CustomDropdownIcon from "@/app/components/ui-components/Sidebar/CustomDropdownIcon";
import ContentSeparator from "@/app/components/ui-components/Sidebar/ContentSeparator";
import SidebarWithButton from "@/app/components/ui-components/Sidebar/SidebarWithButton";
import SidebarWithLogo from "@/app/components/ui-components/Sidebar/SidebarWithLogo";
export const metadata: Metadata = {
  title: "Ui Sidebar",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sidebar",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Sidebar" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DefaultSidebar />
        </div>
        {/* Multilevel Dropdown */}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <MultilevelDropdown />
        </div>
        {/* Custom Dropdown Icon*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <CustomDropdownIcon />
        </div>
        {/* Content Separator*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <ContentSeparator />
        </div>
        {/* Sidebar With Button*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <SidebarWithButton />
        </div>
        {/* Sidebar With Logo*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <SidebarWithLogo />
        </div>
      </div>
    </>
  );
};

export default page;
