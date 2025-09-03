import React from "react";
import CardBox from "../../shared/CardBox";
import Image from "next/image";
import banner from "/public/images/backgrounds/school.png";
import { Button } from "flowbite-react";
import Link from "next/link";

const Ticket = () => {
  return (
    <>
      <div className="bg-white dark:bg-dark">
        <div className="container">
          <CardBox className="bg-dark dark:bg-lightprimary relative lg:py-12 py-0 md:px-11">
            <div className="lg:w-2/4 w-full lg:pt-0 pt-12">
              <h2 className="text-4xl text-white text-center lg:text-start font-bold mb-5 leading-[54px]">
                Haven't found an answer to your question?
              </h2>
              <p className="text-white opacity-50 text-lg text-center lg:text-start pb-5 ">
                Connect with us either on discord or email us
              </p>
              <div className="sm:flex items-center justify-center lg:justify-start gap-3 mb-4 ">
                <Button
                  color={"primary"}
                  as={Link}
                  target="_blank"
                  href="https://discord.com/invite/eMzE8F6Wqs"
                  className="block md:mb-0 mb-3"
                >
                  Ask on Discord
                </Button>
                <Button
                  color={"outlinewhite"}
                  as={Link}
                  target="_blank"
                  href="https://support.wrappixel.com/"
                  className="block md:mb-0 mb-3 hover:text-dark"
                >
                  Submit Ticket
                </Button>
              </div>
            </div>
            <div className="lg:absolute relative md:end-0 lg:-end-6 md:bottom-0 mx-auto">
              <Image src={banner} alt="banner" className="w-full mx-auto " />
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default Ticket;
