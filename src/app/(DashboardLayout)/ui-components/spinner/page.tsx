import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultSpinner from "@/app/components/ui-components/Spinner/DefaultSpinner";
import ColorSpinner from "@/app/components/ui-components/Spinner/ColorSpinner";
import SizingSpinner from "@/app/components/ui-components/Spinner/SizingSpinner";
import AlignSpinner from "@/app/components/ui-components/Spinner/AlignSpinner";
import LoadButton from "@/app/components/ui-components/Spinner/LoadButton";
export const metadata: Metadata = {
  title: "Ui Spinner",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Spinner",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Spinner" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <DefaultSpinner />
        </div>
         {/* Color Spinner */}
         <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <ColorSpinner />
        </div>
        {/* Sizing Spinner */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <SizingSpinner />
        </div>
        {/* Align Spinner */}
        <div className="lg:col-span-6 col-span-12">
          <AlignSpinner />
        </div>
        {/* Load Button */}
        <div className="lg:col-span-6 col-span-12">
          <LoadButton />
        </div>
      </div>
    </>
  );
};

export default page;
