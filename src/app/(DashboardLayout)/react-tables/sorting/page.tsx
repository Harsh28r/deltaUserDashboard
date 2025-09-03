import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import SortingTable from "@/app/components/react-tables/sorting/page";


export const metadata: Metadata = {
  title: "Sorting Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sorting Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Sorting Table" items={BCrumb} />
      <SortingTable />
    </>
  );
}

export default page;
