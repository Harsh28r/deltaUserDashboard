import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import StickyBanner from "@/app/components/ui-components/Banner/StickyBanner";
import BottomBanner from "@/app/components/ui-components/Banner/BottomBanner";
import CTABanner from "@/app/components/ui-components/Banner/CTABanner";
import NewsletterBanner from "@/app/components/ui-components/Banner/NewsletterBanner";
import InformationalBanner from "@/app/components/ui-components/Banner/InformationalBanner";
export const metadata: Metadata = {
  title: "Ui Banner",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Banner",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Banner" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Sticky Banner */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <StickyBanner/>
        </div>
        {/* Bottom Banner */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BottomBanner/>
        </div>
        {/* CTA Banner */}
        <div className="col-span-12">
          <CTABanner/>
        </div>
        {/* Newsletter Banner */}
        <div className="col-span-12">
          <NewsletterBanner/>
        </div>
         {/* Informational Banner */}
         <div className="col-span-12">
          <InformationalBanner/>
        </div>
      </div>
    </>
  );
};

export default page;
