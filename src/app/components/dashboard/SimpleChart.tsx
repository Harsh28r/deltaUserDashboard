"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartData {
  name: string;
  value: number;
  percentage?: number;
  color: string;
}

interface SimpleChartProps {
  data: ChartData[];
  type: "pie" | "bar" | "line";
  className?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, type, className = "" }) => {
  const chartOptions = {
    chart: {
      height: 300,
      fontFamily: "inherit",
      foreColor: "#6B7280",
      toolbar: {
        show: false,
      },
    },
    colors: data.map(item => item.color),
    dataLabels: {
      enabled: type === "pie",
    },
    legend: {
      show: type === "pie",
      position: "bottom" as const,
    },
    grid: {
      show: type !== "pie",
      strokeDashArray: 3,
    },
    stroke: {
      show: type === "line",
      width: 2,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "light",
    },
    xaxis: type !== "pie" ? {
      categories: data.map(item => item.name),
    } : undefined,
    yaxis: type !== "pie" ? {
      title: {
        text: "Count",
      },
    } : undefined,
  };

  const chartSeries = type === "pie" 
    ? data.map(item => item.value)
    : [
        {
          name: "Count",
          data: data.map(item => item.value),
        },
      ];

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type={type}
        height={300}
        width="100%"
      />
    </div>
  );
};

export default SimpleChart;

