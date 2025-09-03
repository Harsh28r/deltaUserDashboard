"use client";
import { Carousel, Rating } from "flowbite-react";
import * as ClientRev from "../Data";
import React from "react";
import Image from "next/image";

const ClientReviews = () => {
  return (
    <>
      <div className="bg-white dark:bg-dark">
        <div className="container md:py-20 py-12">
          <div
            className="h-96 xl:min-h-64 xl:h-80 2xl:h-96"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="1000"
          >
            <Carousel slideInterval={5000} className="text-center">
              {ClientRev.userReview.map((item, index) => (
                <div key={index} className="max-w-[900px]">
                  <div className="mx-auto">
                    <Rating className="justify-center mb-4" size="md">
                      <Rating.Star />
                      <Rating.Star />
                      <Rating.Star />
                      <Rating.Star />
                      <Rating.Star />
                    </Rating>
                  </div>
                  <h2 className="md:text-4xl text-2xl pb-8 font-medium">
                    {item.review}
                  </h2>
                  <div className="flex gap-3.5 items-center justify-center">
                    <div>
                      <Image
                        src={item.img}
                        alt="review"
                        className="rounded-full h-14 w-14"
                      />
                    </div>
                    <div>
                      <h5 className="text-lg text-left">{item.title}</h5>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientReviews;
