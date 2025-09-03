"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AnnualProfit = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];
  const ChartData: any = {
    series: [
      {
        name: "Users",
        data: [25, 66, 20, 40, 12, 58, 20],
      },
    ],
    chart: {
      type: "area",
      height: 80,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
    },
    colors: ["var(--color-primary)"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      color: ["var(--color-primary)"],
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.2,
        opacityTo: 0.8,
        stops: [100],
      },
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };
  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <h5 className="card-title">Annual Profit</h5>
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

        <div className="bg-lightprimary dark:bg-lightprimary rounded-md mt-3">
          <div className="p-6 flex justify-between items-center">
            <span>Conversion Rate</span>
            <h4 className="text-xl">18.4%</h4>
          </div>
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="area"
            height='80px'
            width='100%'
          />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex justify-between">
            <div>
              <p className="text-ld opacity-90 mb-1">
                Added to Cart
              </p>
              <span className="text-[13px] text-darklink">5 clicks</span>
            </div>
            <div>
              <h6 className="text-base font-normal  mb-1">$21,120.70</h6>
              <p className="font-medium text-[13px] text-right text-success">
                +13.2%
              </p>
            </div>
          </div>
          <div className="flex justify-between ">
            <div>
              <p className="text-ld opacity-90 mb-1">
              Reached to Checkout
              </p>
              <span className="text-[13px] text-darklink">12 clicks</span>
            </div>
            <div>
              <h6 className="text-base font-normal  mb-1">$16,100.00</h6>
              <p className="font-medium text-[13px] text-right text-error">-7.4%</p>
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default AnnualProfit;
