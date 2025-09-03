import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultNav from "@/app/components/ui-components/Navbar/DefaultNav";
import CTANav from "@/app/components/ui-components/Navbar/CTANav";
import NavWithDropdown from "@/app/components/ui-components/Navbar/NavWithDropdown";
export const metadata: Metadata = {
  title: "Ui Navbar",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Navbar",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Navbar" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Navbar*/}
        <div className="col-span-12">
          <DefaultNav />
        </div>
        {/* CTA Navbar */}
        <div className="col-span-12">
          <CTANav />
        </div>
         {/* Nav With Dropdown */}
         <div className="col-span-12">
          <NavWithDropdown />
        </div>
      </div>
    </>
  );
};

export default page;
