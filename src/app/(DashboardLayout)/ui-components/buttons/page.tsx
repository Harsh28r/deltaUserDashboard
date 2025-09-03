import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultButtons from "@/app/components/ui-components/Button/DefaultButtons";
import LightButtons from "@/app/components/ui-components/Button/LightButtons";
import RoundedOutline from "@/app/components/ui-components/Button/RoundedOutline";
import SquareButton from "@/app/components/ui-components/Button/SquareButton";
import ButtonSizesPill from "@/app/components/ui-components/Button/ButtonSizesPill";
import ButtonSizesSquare from "@/app/components/ui-components/Button/ButtonSizeSquare";
import ButtonWithIcon from "@/app/components/ui-components/Button/ButtonWithIcon";
import ButtonLoading from "@/app/components/ui-components/Button/ButtonLoading";
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Button",
  },
];
export const metadata: Metadata = {
  title: "Ui Buttons",
};

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Button" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Basic */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultButtons />
        </div>
        {/* Light */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightButtons />
        </div>
        {/* Rounded Outline */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <RoundedOutline />
        </div>
        {/* Square Outline */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SquareButton />
        </div>
        {/* Button Sizes Pill */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonSizesPill />
        </div>
        {/* Button Sizes Suare */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonSizesSquare />
        </div>
        {/* Button With Icon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonWithIcon />
        </div>
        {/* Loading Button */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonLoading />
        </div>
      </div>
    </>
  );
};

export default page;
