"use client";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import React, { useState } from "react";
import CardBox from "../../shared/CardBox";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Dropdown } from "flowbite-react";
import { Icon } from "@iconify/react";
const DeliveryAnalytics = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];

  const ChartData: any = {
    chart: {
      fontFamily: "inherit",
      type: "radar",
      height: 350,
      toolbar: { show: !1 },
      foreColor: "#adb0bb",
    },
    series: [
      { name: "Sales", data: [32, 27, 27, 30, 25, 25] },
      { name: "Visits", data: [25, 35, 20, 20, 20, 20] },
    ],
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: "#90A4AE50",
          connectorColors: "#90A4AE50",
        },
      },
    },
    colors: ["var(--color-primary)", "#FFE4EC"],
    legend: {
      show: false,
    },
    fill: {
      colors: ["var(--color-primary)", "#FFE4EC"],
      opacity: [1, 1],
    },
    markers: { size: 0 },
    grid: {
      show: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: {
        show: !0,
        style: {
          fontSize: "13px",
        },
      },
    },
    yaxis: { show: !1, min: 0, max: 40, tickAmount: 4 },
    tooltip: {
      theme: "dark",
    },
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
  };

  // Custom Tab
  const [activeTab, setActiveTab] = useState("Email");
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <>
      <CardBox>
        <div className="sm:flex items-center justify-between">
          <h5 className="card-title">Delivery Analytics</h5>
          <div className="flex items-center gap-3 sm:mt-0 mt-4 justify-between">
            <div className="flex flex-wrap bg-muted dark:bg-dark p-1 rounded-full">
              <div
                onClick={() => handleTabClick("Email")}
                className={`py-2 px-4 rounded-full min-w-[100px] cursor-pointer text-dark  text-xs font-semibold text-center  ${
                  activeTab == "Email"
                    ? "text-dark bg-white dark:bg-darkgray dark:text-white "
                    : "dark:text-white opacity-60"
                }`}
              >
                Email
              </div>
              <div
                onClick={() => handleTabClick("From Last Week")}
                className={`py-2 px-4 rounded-full min-w-[100px] cursor-pointer text-dark text-xs font-semibold text-center  ${
                  activeTab == "From Last Week"
                    ? "text-dark bg-white dark:bg-darkgray dark:text-white"
                    : "dark:text-white opacity-60 "
                }`}
              >
                From Last Week
              </div>
            </div>
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

        {activeTab === "Email" && (
          <div className="grid grid-cols-12 gap-30 items-center mt-4">
            <div className="lg:col-span-7 col-span-12">
              <Chart
                options={ChartData}
                series={ChartData.series}
                type="radar"
                height="350px"
                width="100%"
              />
            </div>
            <div className="lg:col-span-5 col-span-12">
              <div className="bg-muted dark:bg-darkmuted rounded-md px-5 py-4">
                <Icon
                  icon="material-symbols:rocket-launch-outline"
                  className="text-primary mb-2"
                  height="30"
                ></Icon>
                <h5 className="text-lg my-1">Welcome Emails!</h5>
                <p className="text-dark opacity-80 dark:text-white text-sm font-medium">
                  Have great potential!
                </p>
              </div>
              <div className="flex gap-3 items-center mt-6">
                <span className="rounded-full w-[18px] h-[10px] bg-primary"></span>
                <h6 className="text-base">22.3%</h6>
                <p className="text-sm font-medium">Open Rate</p>
              </div>
              <div className="flex gap-3 items-center mt-4">
                <span className="rounded-full w-[18px] h-[10px] bg-secondary"></span>
                <h6 className="text-base">14.2%</h6>
                <p className="text-sm font-medium">Click-through Rate</p>
              </div>
              <div className="flex gap-3 items-center mt-4">
                <span className="rounded-full w-[18px] h-[10px] bg-error"></span>
                <h6 className="text-base">11.6%</h6>
                <p className="text-sm font-medium">Conversation Rate</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "From Last Week" && (
          <div className="-me-6">
            <Chart
              options={optionexpenses}
              series={optionexpenses.series}
              type="bar"
              height="350px"
              width="100%"
            />
          </div>
        )}
      </CardBox>
    </>
  );
};

export default DeliveryAnalytics;
