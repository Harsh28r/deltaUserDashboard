import FrontEndBreadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/FrontBreadcrumb";
import { Packages } from "@/app/components/front-pages/homepage/Packages";
import { PaymentOptions } from "@/app/components/front-pages/homepage/Payments";
import PurchaseTemp from "@/app/components/front-pages/homepage/PurchaseTemp";
import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Front-Pricing",
};

const Pricing = () => {
  return (
    <>
      <FrontEndBreadcrumb title="Choose Your Plan" link="Pricing Page" />
       
      <Packages />
      <div className="sm:pb-14 pb-8">
        <PaymentOptions />
      </div>
      <PurchaseTemp />
    </>
  );
};

export default Pricing;
