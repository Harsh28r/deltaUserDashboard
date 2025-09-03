import React from "react";
import type { Metadata } from "next";
import FrontEndBreadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/FrontBreadcrumb";
import GalleryPortfolio from "@/app/components/front-pages/portfolio/GalleryPortfolio";
import PurchaseTemp from "@/app/components/front-pages/homepage/PurchaseTemp";
export const metadata: Metadata = {
  title: "Front-Portfolio",
};
const page = () => {
  return (
    <>
      <FrontEndBreadcrumb title="Explore Our Latest Works" link="Portfolio" />
      <GalleryPortfolio />
      <PurchaseTemp />
    </>
  );
};

export default page;
