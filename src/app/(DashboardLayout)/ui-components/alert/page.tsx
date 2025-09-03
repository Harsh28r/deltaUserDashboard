import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultAlert from "@/app/components/ui-components/Alert/DefaultAlert";
import LightAlert from "@/app/components/ui-components/Alert/LightAlert";
import AlertWithIcon from "@/app/components/ui-components/Alert/AlertWithIcon";
import LightAlertWithIcon from "@/app/components/ui-components/Alert/LightAlertWithIcon";
import DismissibleAlert from "@/app/components/ui-components/Alert/DismissibleAlert";
import LightDismissibleAlert from "@/app/components/ui-components/Alert/LightDismissibleAlert";
import RoundedAlert from "@/app/components/ui-components/Alert/RoundedAlert";
import LightRoundeAlert from "@/app/components/ui-components/Alert/LightRoundeAlert";
import LightBorderAccent from "@/app/components/ui-components/Alert/LightBorderAccent";
import Additional from "@/app/components/ui-components/Alert/Additional";
import AllOptions from "@/app/components/ui-components/Alert/AllOptions";
export const metadata: Metadata = {
  title: "Ui Alert",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Alert",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Alert" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultAlert />
        </div>
        {/* Light Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightAlert />
        </div>
        {/* Alert With Icon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <AlertWithIcon />
        </div>
        {/* Light Alert With Icon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightAlertWithIcon />
        </div>
        {/* Dismissible Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DismissibleAlert />
        </div>
        {/* Light Dismissible Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightDismissibleAlert />
        </div>
        {/* Rounded Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <RoundedAlert />
        </div>
        {/* Light Rounded Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightRoundeAlert />
        </div>
        {/* Light Border Accent */}
        <div className="col-span-12">
          <LightBorderAccent />
        </div>
        {/* Additional Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <Additional />
        </div>
        {/* AllOptions Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <AllOptions />
        </div>
      </div>
    </>
  );
};

export default page;
