import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import Default from "@/app/components/ui-components/Breadcrumb/Default";
import BackgroundBread from "@/app/components/ui-components/Breadcrumb/BackgroundBread";
export const metadata: Metadata = {
  title: "Ui Breadcrumb",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Breadcrumb",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Breadcrumb" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default  */}
        <div className="col-span-12">
          <Default />
        </div>
        {/* background color  */}
        <div className="col-span-12">
          <BackgroundBread />
        </div>
      </div>
    </>
  );
};

export default page;
