import React from "react";
import type { Metadata } from "next";
import ContactMap from "@/app/components/front-pages/contactus/ContactMap";
import ContactForm from "@/app/components/front-pages/contactus/ContactForm";
import PurchaseTemp from "@/app/components/front-pages/homepage/PurchaseTemp";
import FrontEndBreadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/FrontBreadcrumb";

export const metadata: Metadata = {
  title: "Front-Contact Us",
};
const page = () => {
  return (
    <>
      <div className="bg-lightgray dark:bg-darkgray">
        <FrontEndBreadcrumb
          title="We’d love to hear from you"
          link="Contact Us"
        />
        <div className="lg:pb-24 pb-12">
          <ContactMap />
          <ContactForm />
        </div>
        <PurchaseTemp />
      </div>
    </>
  );
};

export default page;
