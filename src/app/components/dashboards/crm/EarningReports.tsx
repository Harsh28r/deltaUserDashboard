"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Icon } from "@iconify/react";
import { Badge, Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import Link from "next/link";

const EarningReports = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];

  const EarningReportsData = [
    {
      icon: "solar:card-line-duotone",
      title: "Bank Transfer",
      subtitle: "and +1 more",
      color: "primary",
      statuscolor: "success",
      statustext: "16.3%",
    },
    {
      icon: "solar:wallet-2-line-duotone",
      title: "Net Profit",
      subtitle: "and +4 more",
      color: "error",
      statuscolor: "success",
      statustext: "12.55%",
    },
    {
      icon: "solar:course-up-line-duotone",
      title: "Total Income",
      subtitle: "and +4 more",
      color: "secondary",
      statuscolor: "success",
      statustext: "12.55%",
    },
    {
      icon: "solar:waterdrops-line-duotone",
      title: "Total Expenses",
      subtitle: "and +2 more",
      color: "warning",
      statuscolor: "success",
      statustext: "8.28%",
    },
  ];
  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <h5 className="card-title">Earning Report</h5>
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

        <div className="flex flex-col">
          {EarningReportsData.map((item, index) => (
            <div className="flex items-center justify-between py-5 border-b border-ld" key={index}>
              <div className="flex gap-3 items-center">
                <span
                  className={`w-14 h-10 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
                >
                  <Icon icon={item.icon} height={24} />
                </span>
                <div>
                  <h4 className="text-sm mb-1">{item.title}</h4>
                  <p className="text-darklink text-xs flex items-center gap-1">{item.subtitle} <Icon icon="material-symbols:info-outline-rounded" height={13}></Icon></p>
                </div>
              </div>
              <Badge
                color={`light${item.statuscolor}`}
                icon={() => (
                  <Icon
                    icon="solar:alt-arrow-up-bold"
                    className="me-1"
                    height={12}
                  />
                )}
              >
                {item.statustext}
              </Badge>
            </div>
          ))}

          <Link href={'/'} className="text-base  text-center pt-7 pb-2 font-semibold text-ld hover:text-primary dark:hover:text-primary">
          View more markets</Link>
        </div>
      </CardBox>
    </>
  );
};

export default EarningReports;
