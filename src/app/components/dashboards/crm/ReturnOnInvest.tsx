"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Icon } from "@iconify/react";
import { Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";

const ReturnOnInvest = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];
  const ChartData: any = {
    series: [
      {
        name: "",
        data: [128, 193, 150, 120, 174, 150],
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      height: 230,
      type: "bar",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
    },
    colors: [
      "rgba(0,0,0,0.07)",
      "var(--color-primary)",
      "rgba(0,0,0,0.07)",
      "rgba(0,0,0,0.07)",
      "rgba(0,0,0,0.07)",
      "rgba(0,0,0,0.07)",
    ],
    plotOptions: {
      bar: {
        borderRadius: 12,
        columnWidth: "59%",
        distributed: true,
        endingShape: "rounded",
      },
    },

    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: [["JAN"], ["FEB"], ["MAR"], ["APR"], ["MAY"], ["JUN"]],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
  };
  return (
    <>
      <CardBox className="bg-lightprimary dark:bg-lightprimary pb-2">
        <div className="flex items-center justify-between">
          <h5 className="card-title">Return On Investment</h5>
          <div>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                  <HiOutlineDotsVertical size={22} />
                </span>
              )}
            >
              {dropdownItems.map((items, index) => {
                return <Dropdown.Item key={index}>{items}</Dropdown.Item>;
              })}
            </Dropdown>
          </div>
        </div>

        <div className="flex items-center pt-4">
          <span className="w-14 h-10 rounded-full flex items-center justify-center  bg-lighthover dark:bg-darkmuted text-darklink dark:text-white">
            <Icon icon="solar:course-up-line-duotone" height={24} />
          </span>
          <div className="flex items-center">
            <div className="px-6">
              <h4 className="text-xl">283%</h4>
              <p className="text-sm text-darklink">ROI</p>
            </div>
            <div className="px-6 border-s border-black/10 dark:border-white/10">
              <h4 className="text-primary dark:text-primary text-sm">+24%</h4>
              <p className="text-sm text-darklink">January</p>
            </div>
          </div>
        </div>
        <div className="-ms-3">
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="bar"
            height='230px'
            width='100%'
          />
        </div>
      </CardBox>
    </>
  );
};

export default ReturnOnInvest;
