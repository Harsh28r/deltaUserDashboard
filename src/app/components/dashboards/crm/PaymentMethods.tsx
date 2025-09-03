"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Badge, Dropdown, Table } from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import { Icon } from "@iconify/react";
import visa from "/public/images/svgs/icon-visa.svg";
import master from "/public/images/svgs/icon-master-card-1.svg";
import Image from "next/image";
import icon1 from "/public/images/svgs/icon-netflix.svg";
import icon2 from "/public/images/svgs/icon-upwork.svg";

const PaymentMethods = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];
  const TransactionsData = [
    {
      img: icon1,
      title: "Netflix Subscription",
      subtitle: "Today, 09:23am",
      statuscolor: "success",
      statustext: "Approved",
      price: "- $4.58",
      rank: "+5 Bonus",
      rankcolor: "error",
    },
    {
      img: icon2,
      title: "Upwork",
      subtitle: "August 15, 10:35pm",
      statuscolor: "warning",
      statustext: "Pending",
      price: "+ $15.60",
      rank: "+30 Bonus",
      rankcolor: "success",
    },
  ];
  return (
    <>
      <CardBox className="pb-2">
        <div className="flex items-center justify-between">
          <h5 className="card-title">Payment Methods</h5>
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
        <div className="grid grid-cols-12 mt-2 gap-30">
          <div className="md:col-span-6 col-span-12">
            <div
              className="rounded-md p-6 bg-dark dark:bg-dark bg-no-repeat bg-right-bottom"
              style={{
                backgroundImage: "url(/images/shapes/circlr-shape.png)",
              }}
            >
              <div className="flex justify-between pb-10">
                <h5 className="text-lg text-white">**** 8942</h5>
                <Image src={visa} alt="icon" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1 text-white opacity-80">
                  Balance
                </p>
                <h5 className="text-lg text-white">$26,561.50</h5>
              </div>
            </div>
          </div>
          <div className="md:col-span-6 col-span-12">
            <div
              className="rounded-md p-6  bg-muted dark:bg-darkmuted bg-no-repeat bg-right-bottom"
              style={{
                backgroundImage: "url(/images/shapes/circle-white-shape.png)",
              }}
            >
              <div className="flex justify-between pb-10">
                <h5 className="text-lg">**** 8942</h5>
                <Image src={master} alt="icon" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1 text-darklink">
                  Balance
                </p>
                <h5 className="text-lg">$26,561.50</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-hidden">
          <Table className="mt-2">
            <Table.Head>
              <Table.HeadCell className="ps-0 text-base font-semibold pb-4">
                Transactions
              </Table.HeadCell>
              <Table.HeadCell className="text-base font-semibold  pb-2"></Table.HeadCell>
              <Table.HeadCell className="text-base font-semibold pb-2 text-end text-primary dark:text-primary pe-0">
                <span className="flex items-center justify-end text-sm">
                  See All{" "}
                  <Icon
                    icon="solar:alt-arrow-right-outline"
                    className="ms-1"
                    height={15}
                  />
                </span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder ">
              {TransactionsData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell className="whitespace-nowrap ps-0">
                    <div className="flex gap-3 items-center">
                      <div className="h-12 w-12  flex justify-center items-center rounded-full bg-muted dark:bg-darkmuted">
                        <Image src={item.img} alt="icon" className="h-6 w-6" />
                      </div>

                      <div className="truncat line-clamp-2 text-wrap max-w-56">
                        <h6 className="text-base">{item.title}</h6>
                        <p className="text-xs text-darklink">{item.subtitle}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="pe-0">
                    <div className="flex justify-end pe-0 items-center">
                      <Badge color={`light${item.statuscolor}`}>
                        {item.statustext}
                      </Badge>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-end pe-0">
                    <h6 className="text-base">{item.price}</h6>
                    <p className={`text-xs font-medium text-${item.rankcolor}`}>
                      {item.rank}
                    </p>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </CardBox>
    </>
  );
};

export default PaymentMethods;
