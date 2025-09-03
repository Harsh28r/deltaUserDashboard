import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultCard from "@/app/components/ui-components/Card/DefaultCard";
import CTACardButton from "@/app/components/ui-components/Card/CTACardButton";
import CardWithImage from "@/app/components/ui-components/Card/CardWithImage";
import CustomImageREnder from "@/app/components/ui-components/Card/CustomImageREnder";
import HorizontalCard from "@/app/components/ui-components/Card/HorizontalCard";
import UserProfileCard from "@/app/components/ui-components/Card/UserProfileCard";
import FormCard from "@/app/components/ui-components/Card/FormCard";
import EcommerceCard from "@/app/components/ui-components/Card/EcommerceCard";
import ActionCard from "@/app/components/ui-components/Card/ActionCard";
import CardWithList from "@/app/components/ui-components/Card/CardWithList";
import PricingCard from "@/app/components/ui-components/Card/PricingCard";
export const metadata: Metadata = {
  title: "Ui Cards",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Card",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Card" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 col-span-12">
          <DefaultCard />
        </div>
        {/* CTA Card Button */}
        <div className="lg:col-span-6 col-span-12">
          <CTACardButton />
        </div>
        {/* Card With Image */}
        <div className="lg:col-span-6 col-span-12">
          <CardWithImage />
        </div>
        {/* Custom Image Render */}
        <div className="lg:col-span-6 col-span-12">
          <CustomImageREnder />
        </div>
        {/* Horizontal Card */}
        <div className=" col-span-12">
          <HorizontalCard />
        </div>
        {/* User Profile Card */}
        <div className="lg:col-span-6 col-span-12">
          <UserProfileCard />
        </div>
        {/* Form Card */}
        <div className="lg:col-span-6 col-span-12">
          <FormCard />
        </div>
        {/* Card With List */}
        <div className="lg:col-span-6 col-span-12">
          <CardWithList />
        </div>
         {/* Pricing Card */}
         <div className="lg:col-span-6 col-span-12">
          <PricingCard />
        </div>
        {/* Ecommerce Card */}
        <div className="lg:col-span-6 col-span-12">
          <EcommerceCard />
        </div>
        {/* Action Card */}
        <div className="lg:col-span-6 col-span-12">
          <ActionCard />
        </div>
      </div>
    </>
  );
};

export default page;
