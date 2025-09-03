
import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import ApexRadialChart from "@/app/components/charts/ApexRadialBarChart";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Radial Chart",
  description: "demo",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Radialbar",
  },
];
const RadialChart = () => {

  return (
    <>
      <BreadcrumbComp title="Chart Apex Radialbar" items={BCrumb} />
      <ApexRadialChart/>
    </>
  );
};

export default RadialChart;
