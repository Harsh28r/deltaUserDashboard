"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Icon } from "@iconify/react";
import { Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";

const ProductSales = () => {

  const optionSales: any = {
    labels: ["36%", "10%", "16%", "16%", "10%", "15%"],
    chart: {
      type: "donut",
      fontFamily: "inherit",
      foreColor: "#c6d1e9",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "15px",
              offsetY: 5,
              color: "rgba(var(--v-theme-textPrimary))",
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              color: "var(--color-darklink)",
              fontSize: "20px",
              fontWeight: "600",
              label: "8364",
            },
          },
        },
      },
    },
    grid: {
      padding: {
        bottom: -80,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
      name: {
        show: false,
      },
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      enabled: false,
      fillSeriesColor: false,
    },
    colors: [
      "var(--color-primary)",
      "var(--color-secondary)",
      "var(--color-lighterror)",
      "var(--color-lightgray)",
      "var(--color-muted)",
      "var(--color-success)",
    ],
  };

  const salesChart = [30, 10, 16, 16, 16, 10];

  const dropdownItems = ["Action", "Another action", "Something else"];

  const chartData = [
    {
      color: "primary",
      title: "36% Modernize",
    },
    {
      color: "success",
      title: "17% Spike",
    },
    {
      color: "secondary",
      title: "22% Ample",
    },
    {
      color: "error",
      title: "31% MaterialM",
    },
  ];

  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <h5 className="card-title">Product Sales</h5>
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
                return <Dropdown.Item  key={index}>{items}</Dropdown.Item>;
              })}
            </Dropdown>
          </div>
        </div>

        <Chart
          options={optionSales}
          series={salesChart}
          type="donut"
          height='260px'
          width='100%'
          className="mt-5"
        />
        <div className="bg-lightsuccess dark:bg-lightsuccess mx-auto -mt-4 text-success flex gap-1 items-center py-2 px-3 rounded-full w-fit justify-center text-xs font-medium">
          <Icon icon="bi:lightning-charge-fill" />
          Best Seller
        </div>

        <div className="grid grid-cols-12 gap-2 mt-7 border-b border-ld pb-9">
          {chartData.map((item, index) => (
            <div className="sm:col-span-6  col-span-12 " key={index}>
              <div className="flex gap-2 items-center">
                <span
                  className={`rounded-full w-[18px] h-[10px] bg-${item.color}`}
                ></span>
                <p className="text-sm text-ld">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-darklink pt-6 px-5">This is overview of the sales happened this month for the material website</p>
      </CardBox>
    </>
  );
};

export default ProductSales;
