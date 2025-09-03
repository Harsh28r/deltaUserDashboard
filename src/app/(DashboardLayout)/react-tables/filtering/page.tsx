import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import FilteringTable from "@/app/components/react-tables/filtering/page";

export const metadata: Metadata = {
  title: "Filter Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Filter Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Filter Table " items={BCrumb} />

      <FilteringTable />
    </>
  );
}

export default page;
