"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import { Icon } from "@iconify/react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MarketingReport = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];

  const MarketingData = [
    {
      icon: "solar:course-up-line-duotone",
      title: "+2.9k",
      subtitle: "Google Ads",
      color: "error",
    },
    {
      icon: "solar:cursor-line-duotone",
      title: "1.22",
      subtitle: "Referral",
      color: "success",
    },
    {
      icon: "solar:pie-chart-3-line-duotone",
      title: "24.3K",
      subtitle: "Oraganic",
      color: "primary",
    },
  ];


    const ChartData: any = {
        color: '#adb5bd',
        series: [70, 18, 12],
        labels: ['24.3k', '1.22', '+2.9k'],
        chart: {
            height: 175,
            type: 'donut',
            color: '#adb5bd',
            fontFamily: 'inherit',
            foreColor: '#adb0bb'
        },
        
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: '85%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            offsetY: 7
                        },
                        value: {
                            show: false
                        },
                        total: {
                            show: true,
                            fontSize: '20px',
                            fontWeight: '600',
                            label: '24.3k'
                        }
                    }
                }
            }
        },
        stroke: {
            show: true,
            colors: "var(--color-surface-ld)",
            width: 3
        },
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false
        },
        colors: ["var(--color-primary)","var(--color-success)", "var(--color-error)"],

        tooltip: {
            theme: 'dark',
            fillSeriesColor: false
        }
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

        <div className="grid grid-cols-12 gap-6 mt-3">
          <div className="sm:col-span-6  col-span-12 ">
            <div className="flex flex-col gap-6">
              {MarketingData.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <span
                    className={`w-14 h-10 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
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
          <Chart
          options={ChartData}
          series={ChartData.series}
          type="donut"
          height='175px'
          width='100%'
        />
          </div>
        </div>

        <div className="bg-muted dark:bg-dark rounded-tw py-3 px-[18px] flex justify-between items-center mt-6">
          <p className="text-darklink">Learn insigs how to manage</p>
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

export default MarketingReport;
