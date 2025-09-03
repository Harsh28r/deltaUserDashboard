"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Badge } from "flowbite-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const Payments = () => {
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
          height: 140,
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
        <div className="flex items-baseline  justify-between">
          <div>
            <h5 className="card-title">Payments</h5>
            <p className="card-subtitle">Last 7 days</p>
          </div>
          <div className="text-end">
            <h5 className="card-title text-base">12,389</h5>
            <Badge color={"lighterror"}>-3.8%</Badge>
          </div>
        </div>

        <div className="rounded-bars -ms-3 -me-2">
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="bar"
            height='140px'
            width='100%'
          />
        </div>

        <div className="flex justify-between align-center ">
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
