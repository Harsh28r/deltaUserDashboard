import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import BasicTable from "@/app/components/shadcn-table/Basic/BasicTable";
import TitleCard from "@/app/components/shared/TitleBorderCard";

export const metadata: Metadata = {
  title: "Basic Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Shadcn Basic Table" items={BCrumb} />
      <TitleCard title="Basic Table">
        <div className="grid grid-cols-12 gap-7">
          <div className="col-span-12">
            <BasicTable />
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default page;
