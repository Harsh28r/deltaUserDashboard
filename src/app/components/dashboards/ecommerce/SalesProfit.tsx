"use client";
import React, { useState } from "react";
import CardBox from "../../shared/CardBox";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "flowbite-react";
const SalesProfit = () => {
  // chart
  const optionscolumnchart: any = {
    chart: {
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      fontSize: "12px",
      offsetX: 0,
      offsetY: 10,
      animations: {
        speed: 500,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["var(--color-primary)", "#adb0bb35"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.1,
        opacity: 0.3,
        stops: [100],
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: "#90A4AE50",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 90,
      tickAmount: 3,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const areaChart = {
    series: [
      {
        type: "area",
        name: "This Year",
        chart: {
          foreColor: "#111c2d99",
          fontSize: 12,
          fontWeight: 500,
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1,
          },
        },
        data: [
          { x: "Aug", y: 25 },
          { x: "Sep", y: 25 },
          { x: "Oct", y: 10 },
          { x: "Nov", y: 10 },
          { x: "Dec", y: 45 },
          { x: "Jan", y: 45 },
          { x: "Feb", y: 75 },
          { x: "Mar", y: 70 },
          { x: "Apr", y: 35 },
        ],
      },
      {
        type: "area",
        name: "Last Year",
        chart: {
          foreColor: "#111c2d99",
        },

        data: [
          { x: "Aug", y: 50 },
          { x: "Sep", y: 50 },
          { x: "Oct", y: 25 },
          { x: "Nov", y: 20 },
          { x: "Dec", y: 20 },
          { x: "Jan", y: 20 },
          { x: "Feb", y: 35 },
          { x: "Mar", y: 35 },
          { x: "Apr", y: 60 },
        ],
      },
    ],
  };

  const optionexpenses: any = {
    series: [
      {
        name: "This year",
        data: [9, 5, 3, 7, 5, 10, 3],
      },
      {
        name: "Last year ",
        data: [6, 3, 9, 5, 4, 6, 4],
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "bar",
      height: 350,
      offsetY: 10,
      offsetX: -18,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: "rgba(0,0,0,.1)",
    },
    colors: ["var(--color-primary)", "var(--color-secondary)"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        columnWidth: "30%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    xaxis: {
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
      min: 0,
      max: 12,
      tickAmount: 4,
    },

    fill: {
      opacity: 1,
      colors: ["var(--color-primary)", "var(--color-secondary)"],
    },
    tooltip: {
      theme: "dark",
    },
    legend: {
      show: false,
    },

    responsive: [
      {
        breakpoint: 767,
        options: {
          stroke: {
            show: false,
            width: 5,
            colors: ["transparent"],
          },
        },
      },
    ],
  };

  // Custom Tab
  const [activeTab, setActiveTab] = useState("Profit");
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <CardBox>
      <div className="flex justify-between items-center">
        <h5 className="card-title">Sales Profit</h5>

        <div className="mb-4">
          <div className="flex flex-wrap bg-muted dark:bg-dark p-1 rounded-full">
            <div
              onClick={() => handleTabClick("Profit")}
              className={`py-2 px-4 rounded-full min-w-[100px] cursor-pointer text-dark  text-xs font-semibold text-center  ${
                activeTab == "Profit"
                  ? "text-dark bg-white dark:bg-darkgray dark:text-white "
                  : "dark:text-white opacity-60"
              }`}
            >
              Profit
            </div>
            <div
              onClick={() => handleTabClick("Expenses")}
              className={`py-2 px-4 rounded-full min-w-[100px] cursor-pointer text-dark text-xs font-semibold text-center  ${
                activeTab == "Expenses"
                  ? "text-dark bg-white dark:bg-darkgray dark:text-white"
                  : "dark:text-white opacity-60 "
              }`}
            >
              Expenses
            </div>
          </div>
        </div>
      </div>

      {activeTab === "Profit" && (
        <>
          <div className="-ms-4 -me-3">
            <Chart
              options={optionscolumnchart}
              series={areaChart.series}
              type="area"
              height="300px"
              width="100%"
            />
          </div>

          <div className="sm:flex justify-between items-center mt-6">
            <div className="sm:flex gap-7 items-center">
              <div className="flex gap-2 items-center">
                <span
                  className={`w-14 h-10 rounded-full flex items-center justify-center text-primary bg-lightprimary`}
                >
                  <Icon
                    icon="solar:checklist-minimalistic-line-duotone"
                    height={24}
                  />
                </span>
                <div>
                  <h6 className="text-base">
                    $63,489.50{" "}
                    <span className="bg-lightsuccess dark:bg-lightprimary rounded-full text-success text-xs py-[5px] px-[10px]">
                      +8%
                    </span>
                  </h6>
                  <p className="text-darklink text-sm">Profit this year</p>
                </div>
              </div>
              <div className="flex gap-2 items-center sm:my-0 my-4">
                <span className="w-14 h-10 rounded-full flex items-center justify-center bg-muted text-darklink dark:bg-dark">
                  <Icon
                    icon="solar:dollar-minimalistic-line-duotone"
                    height={24}
                  />
                </span>
                <div>
                  <h6 className="text-base">$38,496.00</h6>
                  <p className="text-darklink text-sm">Profit this year</p>
                </div>
              </div>
            </div>
            <div>
              <Button color={"primary"} className="px-6">
                View Details
              </Button>
            </div>
          </div>
        </>
      )}

      {activeTab === "Expenses" && (
        <div className="">
          <Chart
            options={optionexpenses}
            series={optionexpenses.series}
            type="bar"
            height="350px"
            width={"100%"}
          />
        </div>
      )}
    </CardBox>
  );
};

export default SalesProfit;
