"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import { Icon } from "@iconify/react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CrmMarketingReport = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];

  const MarketingData = [
    {
      icon: "solar:course-up-line-duotone",
      title: "+2.9k",
      subtitle: "Search Volume",
      bgcolor: "error",
    },
    {
      icon: "solar:pie-chart-3-line-duotone",
      title: "1.22",
      subtitle: "Return Ratio",
      bgcolor: "warning",
    },
    {
      icon: "solar:cursor-line-duotone",
      title: "0.83",
      subtitle: "Clicks / search",
      bgcolor: "success",
    },
    {
      icon: "solar:pie-chart-3-line-duotone",
      title: "41.2",
      subtitle: "Return Ratio",
      bgcolor: "primary",
    },
  ];

  const ChartData: any = {
    series: [20, 20, 20, 20, 20],
    labels: ["245", "45", "14", "78", "95"],
    chart: {
      height: 200,
      fontFamily: "inherit",
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
        donut: {
          size: "85%",
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
      width: 2,
      colors: "var(--color-surface-ld)",
    },
    tooltip: {
      fillSeriesColor: false,
    },
    colors: [
      "var(--color-error)",
      "var(--color-warning)",
      "var(--color-lightwarning)",
      "var(--color-lightsuccess)",
      "var(--color-success)",
    ],
  };

  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <h5 className="card-title">Marketing Report</h5>
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

        <div className="grid grid-cols-12 gap-6 mt-5 items-center">
          <div className="sm:col-span-6  col-span-12 ">
            <div className="flex flex-col gap-5">
              {MarketingData.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <span
                    className={`w-14 h-10 rounded-full flex items-center justify-center text-darklink dark:text-white bg-light${item.bgcolor} text-${item.bgcolor}`}
                  >
                    <Icon icon={item.icon} height={24} />
                  </span>
                  <div>
                    <p className="text-darklink">{item.subtitle}</p>
                    <h4 className="text-xl">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sm:col-span-6  col-span-12 ">
            <div className="text-center">
              <Chart
                options={ChartData}
                series={ChartData.series}
                type="donut"
                height="200px"
                width="100%"
              />
              <h2 className="text-3xl opacity-75">275</h2>
              <p className="mt-3 text-sm text-xs text-darklink">
                Learn insigs how to manage all aspects of your startup.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted dark:bg-darkmuted rounded-tw py-[18px] px-6 flex justify-between items-center mt-6">
          <div className="w-3/4 flex gap-3 items-center">
            <Icon
              icon="solar:plain-2-line-duotone"
              height={40}
              className="text-primary dark:text-primary"
            />
            <p className="text-darklink">
              Learn insigs how to manage all aspects of your startup.
            </p>
          </div>

          <Link
            href="/"
            className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-full"
          >
            <Icon icon="solar:play-linear" height="18"></Icon>
          </Link>
        </div>
      </CardBox>
    </>
  );
};

export default CrmMarketingReport;
