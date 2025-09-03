"use client";
import React from "react";
import shape1 from "/public/images/shapes/danger-card-shape.png";
import shape2 from "/public/images/shapes/secondary-card-shape.png";
import shape3 from "/public/images/shapes/success-card-shape.png";
import { Icon } from "@iconify/react";
import Image from "next/image";
import CardBox from "../../shared/CardBox";

const SmallCard = [
  {
    icon: "solar:pie-chart-2-broken",
    num: "2358",
    percent: "+23%",
    title: "Sales",
    shape: shape1,
    bgcolor: "error",
  },
  {
    icon: "solar:refresh-circle-line-duotone",
    num: "434",
    percent: "-12%",
    title: "Refunds",
    shape: shape2,
    bgcolor: "secondary",
  },
  {
    icon: "solar:dollar-minimalistic-linear",
    num: "$245k",
    percent: "+8%",
    title: "Earnings",
    shape: shape3,
    bgcolor: "success",
  },
];

const SmallCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        {SmallCard.map((theme, index) => (
          <div className="md:col-span-4 col-span-12" key={index}>
            <CardBox
              className={`relative !shadow-none rounded-lg  overflow-hidden bg-light${theme.bgcolor} dark:bg-dark${theme.bgcolor}`}
            >
              {/* <div
              className={`relative shadow-none rounded-lg p-6 overflow-hidden bg-light${theme.bgcolor} dark:bg-dark${theme.bgcolor}`}
            > */}
              <div>
                <Image
                  src={theme.shape}
                  alt="shape"
                  className="absolute end-0 top-0"
                />
                <span
                  className={`w-14 h-10 rounded-full flex items-center justify-center text-white mb-8  bg-${theme.bgcolor}`}
                >
                  <Icon icon={theme.icon} height={24} />
                </span>
                <div className="flex items-center gap-1">
                  <h5 className="text-lg">{theme.num}</h5>
                  <span className="font-semibold border rounded-full border-black/5 dark:border-white/10 py-0.5 px-[10px] leading-[normal] text-xs">
                    {theme.percent}
                  </span>
                </div>
                <p className="text-darklink text-sm mt-2 font-medium">
                  {theme.title}
                </p>
              </div>
              {/* </div> */}
            </CardBox>
          </div>
        ))}
      </div>
    </>
  );
};

export default SmallCards;
