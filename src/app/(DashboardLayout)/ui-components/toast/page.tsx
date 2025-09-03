import React from "react";

import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultToast from "@/app/components/ui-components/Toast/DefaultToast";
import TostWithButton from "@/app/components/ui-components/Toast/TostWithIButton";
import InteractiveToast from "@/app/components/ui-components/Toast/InteractiveToast";
import ToastColors from "@/app/components/ui-components/Toast/ToastColors";
import FeedbackToast from "@/app/components/ui-components/Toast/FeedbackToast";
import DismissalToast from "@/app/components/ui-components/Toast/DismissalToast";
export const metadata: Metadata = {
  title: "Ui Toast",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Toast",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Toast" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="md:col-span-6 col-span-12">
          <DefaultToast />
        </div>
        {/* Toast With Button */}
        <div className="md:col-span-6 col-span-12">
          <TostWithButton />
        </div>
        {/* Interactive Toast */}
        <div className="md:col-span-6 col-span-12">
          <InteractiveToast />
        </div>
        {/* ToastColors */}
        <div className="md:col-span-6 col-span-12">
          <ToastColors />
        </div>
        {/* Feedback Toast */}
        <div className="md:col-span-6 col-span-12">
          <FeedbackToast />
        </div>
        {/* Dismissal Toast*/}
        <div className="md:col-span-6 col-span-12">
          <DismissalToast />
        </div>
      </div>
    </>
  );
};

export default page;
