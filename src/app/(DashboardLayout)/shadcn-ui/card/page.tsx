import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import BasicCard from "@/app/components/shadcn-ui/Card/BasicCard";
import FormCard from "@/app/components/shadcn-ui/Card/FormCard";
import NotificationCard from "@/app/components/shadcn-ui/Card/NotificationCard";
import ChartCard from "@/app/components/shadcn-ui/Card/ChartCard";

export const metadata: Metadata = {
  title: "Ui Card",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Card",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Card" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BasicCard />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <FormCard />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <NotificationCard />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ChartCard/>
        </div>
      </div>
    </>
  );
};

export default page;
