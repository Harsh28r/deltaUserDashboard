import React from "react";
import type { Metadata } from "next";
import FrontEndBreadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/FrontBreadcrumb";
import PurchaseTemp from "@/app/components/front-pages/homepage/PurchaseTemp";
import BlogPost from "@/app/components/front-pages/blog/BlogPost";
export const metadata: Metadata = {
  title: "Front-Blog",
};
const page = () => {
  return (
    <>
      <FrontEndBreadcrumb title="Latest blog & news" link="Blog Page" />
      <div className="bg-lightgray dark:bg-darkgray">
        <BlogPost />
      </div>
      <PurchaseTemp />
    </>
  );
};

export default page;
