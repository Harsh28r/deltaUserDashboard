import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultDrawer from "@/app/components/ui-components/Drawer/DefaultDrawer";
import DrawerNavigation from "@/app/components/ui-components/Drawer/DrawerNavigation";
import ContactDrawer from "@/app/components/ui-components/Drawer/ContactDrawer";
import FormDrawer from "@/app/components/ui-components/Drawer/FormDrawer";
import CustomBackDrop from "@/app/components/ui-components/Drawer/CustomBackDrop";
import SwipableDrawer from "@/app/components/ui-components/Drawer/SwipableDrawer";
import LeftDrawer from "@/app/components/ui-components/Drawer/LeftDrawer";
import RightDrawer from "@/app/components/ui-components/Drawer/RightDrawer";
import TopDrawer from "@/app/components/ui-components/Drawer/TopDrawer";
import BottomDrawer from "@/app/components/ui-components/Drawer/BottomDrawer";
export const metadata: Metadata = {
  title: "Ui Drawer",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Drawer",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Drawer" items={BCrumb} />

      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <DefaultDrawer />
        </div>
        {/* Drawer Navigation */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <DrawerNavigation />
        </div>
        {/* Contact Form Drawer */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <ContactDrawer />
        </div>
        {/* Form Drawer */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <FormDrawer />
        </div>
        {/* Custom BackDrop */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <CustomBackDrop />
        </div>
        {/* Swipable Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <SwipableDrawer />
        </div>
        {/* Left Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <LeftDrawer />
        </div>
        {/* Right Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <RightDrawer />
        </div>
        {/* Top Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <TopDrawer />
        </div>
        {/* Bottom Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <BottomDrawer />
        </div>
      </div>
    </>
  );
};

export default page;
