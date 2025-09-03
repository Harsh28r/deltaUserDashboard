import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultModal from "@/app/components/ui-components/Modals/DefaultModal";
import PopupModal from "@/app/components/ui-components/Modals/PopupModal";
import FormModal from "@/app/components/ui-components/Modals/FormModal";
import SizingModal from "@/app/components/ui-components/Modals/SizingModal";
import PlacementModal from "@/app/components/ui-components/Modals/PlacementModal";
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Modals",
  },
];
export const metadata: Metadata = {
  title: "Ui Modals",
};
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Modals" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <DefaultModal />
        </div>
        {/* Popup Modal */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <PopupModal />
        </div>
        {/* Form Modal */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <FormModal />
        </div>
        {/* Sizing Modal */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SizingModal />
        </div>
        {/* Placement Modal */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <PlacementModal />
        </div>
      </div>
    </>
  );
};

export default page;
