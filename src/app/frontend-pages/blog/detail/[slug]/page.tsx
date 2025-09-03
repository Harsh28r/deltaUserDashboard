import React from "react";
import type { Metadata } from "next";
import FrontEndBreadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/FrontBreadcrumb";
import PurchaseTemp from "@/app/components/front-pages/homepage/PurchaseTemp";
import BlogDetailData from "@/app/components/apps/blog/detail";
import { BlogProvider } from "@/app/context/BlogContext";
export const metadata: Metadata = {
  title: "Front-Blog Details",
};
const page = () => {
  return (
    <>
      <FrontEndBreadcrumb title="Our most recent articles" link="Blog Details" />
      <div className="bg-lightgray dark:bg-darkgray">
        <div className="container-1218 mx-auto pb-12">
          <BlogProvider>
            <BlogDetailData />
          </BlogProvider>
        </div>
      </div>
      <PurchaseTemp />
    </>
  );
};

export default page;
