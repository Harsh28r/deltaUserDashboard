"use client";
import React, { useState } from "react";
import CardBox from "../../shared/CardBox";
import { Badge, Dropdown, Timeline } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import { Icon } from "@iconify/react";
import SimpleBar from "simplebar-react";
const UpcommingSchedule = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];

  const DeliveredData = [
    {
      icon: "scooter-line-duotone",
      iconBg: "warning",
      title: "Scooter Freight",
      code: "#1245-456201",
      statustext: "Delivered",
      statuscolor: "success",
      timeline: [
        {
          id: 1,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "warning",
          title: "Drainage",
          country: "United Kingdom",
        },
        {
          id: 2,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "warning",
          title: "The lowland zone",
          country: "United Kingdom",
        },
      ],
    },
    {
      icon: "bus-line-duotone",
      iconBg: "primary",
      title: "Bus Freight",
      code: "#9002-125423",
      statustext: "All",
      statuscolor: "success",
      timeline: [
        {
          id: 1,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "primary",
          title: "Messina Harbor",
          country: "Sicily, Italy",
        },
        {
          id: 2,
          timelineIcon: "map-point-bold-duotone",
          iconcolor: "primary",
          title: "Hektor Container Hotel",
          country: "Tallin, EST",
        },
      ],
    },
    {
      icon: "tram-linear",
      iconBg: "secondary",
      title: "Train Freight",
      code: "#1245-780652",
      statustext: "Delivered",
      statuscolor: "success",
      timeline: [
        {
          id: 1,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "secondary",
          title: "Messina Harbor",
          country: "Lester, United Kingdom",
        },
        {
          id: 2,
          timelineIcon: "map-point-bold-duotone",
          iconcolor: "secondary",
          title: "Laxmi Empire Hotel",
          country: "Mumbai, India",
        },
      ],
    },
  ];

  const ShippingData = [
    {
      icon: "tram-linear",
      iconBg: "secondary",
      title: "Train Freight",
      code: "#1245-780652",
      statustext: "Shipping",
      statuscolor: "primary",
      timeline: [
        {
          id: 1,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "secondary",
          title: "Messina Harbor",
          country: "Lester, United Kingdom",
        },
        {
          id: 2,
          timelineIcon: "map-point-bold-duotone",
          iconcolor: "secondary",
          title: "Laxmi Empire Hotel",
          country: "Mumbai, India",
        },
      ],
    },
    {
      icon: "scooter-line-duotone",
      iconBg: "warning",
      title: "Scooter Freight",
      code: "#1245-456201",
      statustext: "Shipping",
      statuscolor: "primary",
      timeline: [
        {
          id: 1,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "warning",
          title: "Drainage",
          country: "United Kingdom",
        },
        {
          id: 2,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "warning",
          title: "The lowland zone",
          country: "United Kingdom",
        },
      ],
    },
    {
      icon: "bus-line-duotone",
      iconBg: "primary",
      title: "Bus Freight",
      code: "#9002-125423",
      statustext: "Shipping",
      statuscolor: "primary",
      timeline: [
        {
          id: 1,
          timelineIcon: "soundwave-circle-bold-duotone",
          iconcolor: "primary",
          title: "Messina Harbor",
          country: "Sicily, Italy",
        },
        {
          id: 2,
          timelineIcon: "map-point-bold-duotone",
          iconcolor: "primary",
          title: "Hektor Container Hotel",
          country: "Tallin, EST",
        },
      ],
    },
  ];

  // Custom Tab
  const [activeTab, setActiveTab] = useState("Delivered");
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <div>
            <h5 className="card-title">Upcoming Schedules</h5>
            <p className="text-subtitle">Our corporate events</p>
          </div>

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

        <div className=" mt-5   ">
          <div className="flex flex-wrap bg-muted dark:bg-dark p-1 rounded-full">
            <div
              onClick={() => handleTabClick("Delivered")}
              className={`py-2 px-4 rounded-full min-w-[50%] cursor-pointer text-dark text-sm font-semibold text-center  ${
                activeTab == "Delivered"
                  ? "text-dark bg-white dark:bg-darkgray dark:text-white"
                  : "dark:text-white opacity-60 "
              }`}
            >
              Delivered
            </div>
            <div
              onClick={() => handleTabClick("Shipping")}
              className={`py-2 px-4 rounded-full min-w-[50%] cursor-pointer text-dark text-sm font-semibold text-center  ${
                activeTab == "Shipping"
                  ? "text-dark bg-white dark:bg-darkgray dark:text-white"
                  : "dark:text-white opacity-60 "
              }`}
            >
              Shipping
            </div>
          </div>

        </div>


        {activeTab === "Delivered" && (
          <SimpleBar className="max-h-[378px]">
            <div className="timeline-tabs">
              {DeliveredData.map((item, index) => (
                <div className="mt-6 timeline-list" key={index}>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div
                        className={`h-10 w-10 flex justify-center items-center rounded-md bg-${item.iconBg}`}
                      >
                        <Icon
                          icon={`solar:${item.icon}`}
                          className="text-white"
                          height="25"
                        ></Icon>
                      </div>
                      <div>
                        <p className="font-medium text-darktext">
                          {item.title}
                        </p>
                        <h6 className="text-body-1">{item.code}</h6>
                      </div>
                    </div>
                    <Badge color={`light${item.statuscolor}`}>
                      {item.statustext}
                    </Badge>
                  </div>

                  {item.timeline.map((time, i) => (
                    <div className="mt-5 timeline" key={i}>
                      <div className="flex gap-3 items-center mb-4">
                        <div className="timeline-icon">
                          <div className="h-10 w-10 border flex justify-center items-center border-ld rounded-full">
                            <Icon
                              icon={`solar:${time.timelineIcon}`}
                              className={`text-${time.iconcolor}`}
                              height="25"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-darklink">
                            {time.title}
                          </p>
                          <h6 className="text-sm">{time.country}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SimpleBar>
        )}

        {activeTab === "Shipping" && (
          <SimpleBar className="max-h-[378px]">
            <div className="timeline-tabs">
              {ShippingData.map((item, index) => (
                <div className="mt-6 timeline-list" key={index}>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div
                        className={`h-10 w-10 flex justify-center items-center rounded-md bg-${item.iconBg}`}
                      >
                        <Icon
                          icon={`solar:${item.icon}`}
                          className="text-white"
                          height="25"
                        ></Icon>
                      </div>
                      <div>
                        <p className="font-medium text-darktext">
                          {item.title}
                        </p>
                        <h6 className="text-body-1">{item.code}</h6>
                      </div>
                    </div>
                    <Badge color={`light${item.statuscolor}`}>
                      {item.statustext}
                    </Badge>
                  </div>

                  {item.timeline.map((time, i) => (
                    <div className="mt-5 timeline" key={i}>
                      <div className="flex gap-3 items-center mb-4">
                        <div className="timeline-icon">
                          <div className="h-10 w-10 border flex justify-center items-center border-ld rounded-full">
                            <Icon
                              icon={`solar:${time.timelineIcon}`}
                              className={`text-${time.iconcolor}`}
                              height="25"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-darklink">
                            {time.title}
                          </p>
                          <h6 className="text-sm">{time.country}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SimpleBar>
        )}
      </CardBox>
    </>
  );
};

export default UpcommingSchedule;
