"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Icon } from "@iconify/react";
import { Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";

const CurrentBalance = () => {
  const Action = [
    {
      icon: "solar:add-circle-outline",
      listtitle: "Add",
    },
    {
      icon: "solar:pen-new-square-broken",
      listtitle: "Edit",
    },
    {
      icon: "solar:trash-bin-minimalistic-outline",
      listtitle: "Delete",
    },
  ];

  const ChartData: any = {
    color: "#adb5bd",
    series: [70, 49],
    labels: ["2022", "2021", "2020"],
    chart: {
      height: 145,
      type: "donut",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      offsetY: 0,
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "85%",
        },
      },
    },
    stroke: {
      show: false,
      colors: "var(--color-surface-ld)",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    colors: ["#b2efe8", "var(--color-success)"],

    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  return (
    <>
      <CardBox className="bg-lightsuccess dark:bg-lightsuccess !shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-14 h-10 rounded-full flex items-center justify-center  bg-success text-white">
              <Icon icon="solar:banknote-line-duotone" height={24} />
            </span>
            <h5 className="text-base opacity-70">Current Balance</h5>
          </div>
          <div>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="h-9 w-9 flex justify-center items-center rounded-full  cursor-pointer">
                  <HiOutlineDotsVertical size={22} />
                </span>
              )}
            >
              {Action.map((items, index) => (
                <Dropdown.Item key={index} className="flex gap-3">
                  <Icon icon={`${items.icon}`} height={18} />
                  <span>{items.listtitle}</span>
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[10px] items-end">
          <div className="xl:col-span-5 col-span-7 ">
            <div className="">
              <h2 className="text-3xl mb-3">$2,529</h2>
              <span className="font-semibold border rounded-full border-black/5 dark:border-white/10 py-0.5 px-[10px] leading-[normal] text-xs text-dark dark:text-darklink">
                <span className="opacity-70">+42% last month</span>
              </span>
            </div>
          </div>
          <div className="xl:col-span-7  col-span-5 ">
            <div className="-mb-4">
              <Chart
                options={ChartData}
                series={ChartData.series}
                type="donut"
                height='145px'
                width='100%'

              />
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default CurrentBalance;
