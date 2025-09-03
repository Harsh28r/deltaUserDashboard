"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Payments = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];

  const ChartData: any = {
    series: [
      {
        name: "Paypal",
        data: [29, 52, 38, 47, 56, 41, 46],
      },
      {
        name: "Credit Card",
        data: [71, 71, 71, 71, 71, 71, 71],
      },
    ],

    chart: {
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      type: "bar",
      height: 150,
      stacked: true,
      offsetX: -5,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false,
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 1,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    colors: ["var(--color-primary)", "#D9D9D955"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "26%",
        borderRadius: [3],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [["M"], ["T"], ["W"], ["T"], ["F"], ["S"], ["S"]],
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
    legend: {
      show: false,
    },
  };
  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <h5 className="card-title">Payments</h5>
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

        <div className="mt-3">
          <h6 className="text-xl flex items-center">
            12,389
            <span className="ms-2 bg-lighterror dark:bg-lighterror rounded-full text-error text-xs py-1 px-[10px]">
              -3.8%
            </span>
          </h6>
          <p className="text-darklink text-sm">Last 7 days</p>
        </div>
        <div className="rounded-bars -ms-3 -me-2">
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="bar"
            height='150px'
            width='100%'
          />
        </div>

        <div className="flex justify-between align-center mt-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary elipse rounded-full"></span>
            <p className="text-darklink">Paypal</p>
          </div>
          <p className="text-darklink">52%</p>
        </div>
        <div className="flex justify-between align-center">
          <div className="flex items-center gap-2">
            <span className="bg-muted dark:bg-dark elipse rounded-full"></span>
            <p className="text-darklink">Credit Card</p>
          </div>
          <p className="text-darklink">48%</p>
        </div>
      </CardBox>
    </>
  );
};

export default Payments;
