import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import HeadingsTyp from "@/app/components/ui-components/Typography/HeadingsTyp";
import BlockOutTypo from "@/app/components/ui-components/Typography/BlockOutTypo";
import SolidBgTypo from "@/app/components/ui-components/Typography/SolidBgTypo";
import BlockQtIconTypo from "@/app/components/ui-components/Typography/BlockQtIconTypo";
import ParagraphTypo from "@/app/components/ui-components/Typography/ParagraphTypo";
import ReviewTypo from "@/app/components/ui-components/Typography/ReviewTypo";
import AlignLeftTypo from "@/app/components/ui-components/Typography/AlignLeftTypo";
import AlignRightTypo from "@/app/components/ui-components/Typography/AlignRightTypo";
import SmallSizeTypo from "@/app/components/ui-components/Typography/SmallSizeTypo";
import MediumSizeTypo from "@/app/components/ui-components/Typography/MediumSizeTypo";
import LargeSizeTypo from "@/app/components/ui-components/Typography/LargeSizeTypo";
import DefaultListTypo from "@/app/components/ui-components/Typography/DefaultListTypo";
import IconListTypo from "@/app/components/ui-components/Typography/IconListTypo";
import NestedTypo from "@/app/components/ui-components/Typography/NestedTypo";
import UnstyledTypo from "@/app/components/ui-components/Typography/UnstyledTypo";
import OrderTypo from "@/app/components/ui-components/Typography/OrderTypo";
import HorizontalListTypo from "@/app/components/ui-components/Typography/HorizontalListTypo";
export const metadata: Metadata = {
  title: "Ui Typography",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Typography",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Typography" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Headings Typo */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <HeadingsTyp />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BlockOutTypo />
        </div>
        <div className="col-span-12">
          <SolidBgTypo />
        </div>
        <div className="col-span-12">
          <BlockQtIconTypo />
        </div>
        <div className="col-span-12">
          <ParagraphTypo />
        </div>
        <div className="col-span-12">
          <ReviewTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <AlignLeftTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <AlignRightTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <SmallSizeTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <MediumSizeTypo />
        </div>
        <div className="col-span-12">
          <LargeSizeTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <DefaultListTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <IconListTypo />
        </div>
        <div className="col-span-12">
          <NestedTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <UnstyledTypo />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <OrderTypo />
        </div>
        <div className="col-span-12">
          <HorizontalListTypo />
        </div>
      </div>
    </>
  );
};

export default page;
