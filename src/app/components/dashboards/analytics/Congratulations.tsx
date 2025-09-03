"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Icon } from "@iconify/react";
import Image from "next/image";
import cardimage from "/public/images/backgrounds/teamwork.png";
import { Select } from "flowbite-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const Congratulations = () => {
  const dropdownItems = ["This Weeek", "April 2023", "May 2023", "June 2023"];
  const CongratsData = [
    {
      icon: "solar:cart-4-line-duotone",
      title: "64 new orders",
      subtitle: "Processing",
      color: "primary",
    },
    {
      icon: "solar:checklist-minimalistic-line-duotone",
      title: "4 orders",
      subtitle: "On hold",
      color: "error",
    },
    {
      icon: "solar:banknote-line-duotone",
      title: "12 orders",
      subtitle: "Delivered",
      color: "success",
    },
  ];

  const ChartData: any = {
    series: [
      {
        name: "",
        data: [0, 20, 15, 19, 14, 25, 30],
      },
      {
        name: "",
        data: [0, 8, 19, 13, 26, 16, 25],
      },
    ],

    chart: {
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 250,
      width: "100%",
      type: "line",
      offsetX: -15,
      toolbar: {
        show: false,
      },
      stacked: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    grid: {
      borderColor: "rgba(173,181,189,0.3)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        bottom: 0,
        left: 10,
        right: 0,
      },
    },
    colors: ["var(--color-primary)", "var(--color-secondary)"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#6993ff"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 0,
    },
    xaxis: {
      labels: {
        show: true,
      },
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
        formatter: function (value: string) {
          return value + "k";
        },
      },

      min: 0,
      max: 32,
      tickAmount: 4,
    },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <>
      <div className="col-span-12">
        <CardBox>
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-6 col-span-12">
              <h5 className="card-title">Congratulations Jonathan</h5>
              <p className="card-subtitle">You have done 38% more sales</p>
              <div className="grid grid-cols-12 gap-6 mt-3 items-center">
                <div className="md:col-span-5 col-span-12">
                  <div className="flex flex-col gap-4">
                    {CongratsData.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <span
                          className={`w-14 h-10 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
                        >
                          <Icon icon={item.icon} height={24} />
                        </span>
                        <div>
                          <h4 className="text-base">{item.title}</h4>
                          <p className="text-darklink">{item.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-7 col-span-12 text-end">
                  <Image src={cardimage} alt="background" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 col-span-12">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="card-title">Total Orders</h5>
                  <p className="card-subtitle">Weekly order updates</p>
                </div>
                <Select required className="form-control select-option">
                  {dropdownItems.map((items, index) => {
                    return <option key={index}>{items}</option>;
                  })}
                </Select>
              </div>
              <div className="-me-4 mt-3">
                <Chart
                  options={ChartData}
                  series={ChartData.series}
                  type="line"
                  height='250px'
                  width='100%'
                />
              </div>
            </div>
          </div>
        </CardBox>
      </div>
    </>
  );
};

export default Congratulations;
