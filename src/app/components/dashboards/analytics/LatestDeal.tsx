"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import { Badge, Progress } from "flowbite-react";
import Image from "next/image";
import user1 from "/public/images/profile/user-2.jpg";
import user2 from "/public/images/profile/user-3.jpg";
import user3 from "/public/images/profile/user-4.jpg";
import user4 from "/public/images/profile/user-5.jpg";
const LatestDeal = () => {
  const userImg = [
    {
      user: user1,
    },
    {
      user: user2,
    },
    {
      user: user3,
    },
    {
      user: user4,
    },
  ];
  return (
    <>
      <CardBox>
        <div className="flex items-baseline  justify-between">
          <div>
            <h5 className="card-title">Latest Deal</h5>
            <p className="card-subtitle">Last 7 days</p>
          </div>
          <Badge color={"lightprimary"}>86.5%</Badge>
        </div>

        <div className="my-8">
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-base">$98,500</h6>
            <h6 className="text-base">$1,22,900</h6>
          </div>
          <Progress progress={80} color="success" size={"sm"} />
          <p className="text-darklink text-sm mt-2">Coupons used: 18/22</p>
        </div>

        <h5 className="text-sm mb-2">Recent Purchasers</h5>
        <div className="flex">
          {userImg.map((item, index) => (
            <div className="-ms-2  h-10 w-10" key={index}>
              <Image
                src={item.user}
                className="border-2 border-white dark:border-darkborder rounded-full"
                alt="icon"
              />
            </div>
          ))}
          <div className="-ms-2 ">
            <div className="bg-lightsecondary border-2 border-white dark:border-darkborder  h-10 w-10 flex justify-center items-center text-secondary rounded-full dark:bg-lightsecondary">
              +8
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default LatestDeal;
