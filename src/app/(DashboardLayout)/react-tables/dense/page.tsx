import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import DenseTable from "@/app/components/react-tables/dense/page";


export const metadata: Metadata = {
  title: "Dense Table ",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Dense Table ",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Dense Table " items={BCrumb} />
      <DenseTable />
    </>
  );
}

export default page;
