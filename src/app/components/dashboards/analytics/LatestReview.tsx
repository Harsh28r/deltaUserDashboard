"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Rating,
  TextInput,
} from "flowbite-react";
import { HiOutlineDotsVertical  } from "react-icons/hi";
import { Table } from "flowbite-react";
import { Icon } from "@iconify/react";

import user1 from "/public/images/profile/user-2.jpg";
import user2 from "/public/images/profile/user-3.jpg";
import user3 from "/public/images/profile/user-4.jpg";
import user4 from "/public/images/profile/user-5.jpg";
import Image from "next/image";

const LatestReview = () => {
  /*Table Action*/
  const tableActionData = [
    {
      icon: "solar:add-circle-outline",
      listtitle: "Add",
    },
    {
      icon: "solar:pen-new-square-broken",
      listtitle: "Edit",
    },
    {
      icon: "solar:trash-bin-minimalistic-outline",
      listtitle: "Delete",
    },
  ];

  const LatestReviewData = [
    {
      profile: user1,
      customername: "Arlene McCoy",
      customeremail: "macoy@arlene.com",
      review: 5,
      reviewtext:
        "This theme is great. Clean and easy to understand. Perfect for those who don t havetime to",
      time: "Nov 8",
    },
    {
      profile: user2,
      customername: "Jerome Bell",
      customeremail: "belljerome@yahoo.com",
      review: 4,
      reviewtext:
        "It is a Mac, after all. Once you have gone Mac,there s no going back. My first Maclastedover nine years",
      time: "Nov 8",
    },
    {
      profile: user3,
      customername: "Jacob Jones",
      customeremail: "jones009@hotmail.com",
      review: 4,
      reviewtext:
        " The best experience we could hope for.Customer service team is amazing and thequality of their products",
      time: "Nov 8",
    },
    {
      profile: user4,
      customername: "Annette Black",
      customeremail: "blackanne@yahoo.com",
      review: 3,
      reviewtext:
        " The controller is quite comfy for me. Despiteits increased size, the controller still fits well",
      time: "Nov 8",
    },
  ];

  return (
    <>
      <CardBox className="px-0">
        <div className="sm:flex  items-center justify-between px-6">
          <div>
            <h5 className="card-title">Latest Reviews</h5>
            <p className="card-subtitle">
              Reviewed received across all channels
            </p>
          </div>

          <div className="flex gap-4 sm:mt-0 mt-3">
            <TextInput
              placeholder="Search"
              className="form-control-rounded"
              sizing="md"
              icon={() => (
                <Icon icon="solar:magnifer-line-duotone" height={20} />
              )}
              required
            />
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="h-10 w-14 flex justify-center items-center rounded-full border border-ld hover:bg-lightprimary hover:text-primary cursor-pointer">
                  <HiOutlineDotsVertical size={22} />
                </span>
              )}
            >
              {tableActionData.map((items, index) => (
                <Dropdown.Item key={index} className="flex gap-3">
                  <Icon icon={`${items.icon}`} height={18} />
                  <span>{items.listtitle}</span>
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="p-6 text-base font-semibold pb-2">
                #
              </Table.HeadCell>
              <Table.HeadCell className="text-base font-semibold  pb-2">
                Customer
              </Table.HeadCell>
              <Table.HeadCell className="text-base font-semibold pb-2">
                Reviews
              </Table.HeadCell>
              <Table.HeadCell className="text-base font-semibold pb-2">
                Time
              </Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder ">
              {LatestReviewData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell className="whitespace-nowrap ps-6">
                    <Checkbox className="checkbox" />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap ps-6">
                    <div className="flex gap-3 items-center">
                      <Image
                        src={item.profile}
                        alt="icon"
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="truncat line-clamp-2 text-wrap max-w-56">
                        <h6 className="text-base">{item.customername}</h6>
                        <p className="text-sm text-ld">
                          {item.customeremail}
                        </p>

                        {item.review == 5 ? (
                          <Rating size={"sm"} className="mt-1">
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star />
                          </Rating>
                        ) : item.review == 4 ? (
                          <Rating size={"sm"} className="mt-1">
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star filled={false} />
                          </Rating>
                        ) : (
                          <Rating size={"sm"} className="mt-1">
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star />
                            <Rating.Star filled={false} />
                            <Rating.Star filled={false} />
                          </Rating>
                        )}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <p className="text-ld truncat line-clamp-2 text-wrap max-w-56 text-sm">
                      {item.reviewtext}
                    </p>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <p className="text-ld text-sm">
                      {item.time}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                          <HiOutlineDotsVertical size={22} />
                        </span>
                      )}
                    >
                      {tableActionData.map((items, index) => (
                        <Dropdown.Item key={index} className="flex gap-3">
                          <Icon icon={`${items.icon}`} height={18} />
                          <span>{items.listtitle}</span>
                        </Dropdown.Item>
                      ))}
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="sm:flex items-center justify-between border-t border-ld pt-6 px-6">
          <span className="text-darklink text-sm">1-6 of 32</span>
          <Button color={"primary"} className="w-fit">
            View All Reviews
          </Button>
        </div>
      </CardBox>
    </>
  );
};

export default LatestReview;
