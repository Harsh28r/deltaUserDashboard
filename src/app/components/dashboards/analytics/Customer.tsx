"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Badge } from "flowbite-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const Customer = () => {
  const ChartData: any = {
    series: [
      {
        name: "monthly earnings",
        color: "var(--color-primary)",
        data: [15, 18, 66, 20, 40, 12, 30],
      },
    ],
    chart: {
      type: "area",
      stacked: true,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      color: "var(--color-primary)",

      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.1,
        opacityTo: 0,
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
        <div className="flex items-baseline  justify-between">
          <div>
            <h5 className="card-title">Customers</h5>
            <p className="card-subtitle">Last 7 days</p>
          </div>
          <div className="text-end">
            <h5 className="card-title text-base">6,380</h5>
            <Badge color={"lightsuccess"}>+26.5%</Badge>
          </div>
        </div>

        <Chart
          options={ChartData}
          series={ChartData.series}
          type="area"
          height='103px'
          width='100%'
          className="my-5"
        />

        <div className="flex justify-between align-center mt-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary elipse rounded-full"></span>
            <p className="text-darklink">Apr 07 - Apr 14</p>
          </div>
          <p className="text-darklink">6,380</p>
        </div>
        <div className="flex justify-between align-center">
          <div className="flex items-center gap-2">
            <span className="bg-muted dark:bg-dark elipse rounded-full"></span>
            <p className="text-darklink">Last Week</p>
          </div>
          <p className="text-darklink">4,298</p>
        </div>
      </CardBox>
    </>
  );
};

export default Customer;
