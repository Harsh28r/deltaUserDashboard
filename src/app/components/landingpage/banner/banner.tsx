import Image from "next/image";
import React from "react";
import Banner1 from "/public/images/landingpage/background/banner-bg-1.png";
import Banner2 from "/public/images/landingpage/background/banner-bg-2.png";
import Banner3 from "/public/images/landingpage/background/banner-bg-3.png";
import Animate1 from "/public/images/landingpage/background/banner-widget-1.svg";
import Animate2 from "/public/images/landingpage/background/banner-widget-2.svg";
import { Button } from "flowbite-react";
import Link from "next/link";
const banner = () => {
  return (
    <>
      <div className="bg-lightgray dark:bg-darkgray md:py-20 py-12 relative overflow-hidden">
        <div className="container relative">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-3 col-span-12 lg:inline hidden text-end">
              <Image
                src={Banner1}
                className=" float-right rtl:float-left max-w-max h-full"
                alt="banner"
              />
              <Image src={Animate1} className="animted-img " alt="banner" />
            </div>
            <div className="lg:col-span-6 col-span-12 flex flex-col">
              <div className="text-center">
                <h1 className="md:text-[64px] text-4xl font-bold sm:leading-[74px] sm:mt-12" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
                  Most Elegant
                  <span className="font-normal block">Admin Dashboard</span>
                </h1>
                <div className="flex gap-3.5 justify-center my-[30px]" data-aos="fade-up" data-aos-delay="600" data-aos-duration="1000">
                  <div className="border rounded-md border-dashed border-ld px-4 py-2 text-center">
                    <h4 className="text-xl">90+</h4>
                    <p className="text-xs font-medium text-darklink">
                      Demo Pages
                    </p>
                  </div>
                  <div className="border rounded-md border-dashed border-ld px-4 py-2 text-center">
                    <h4 className="text-xl">12+</h4>
                    <p className="text-xs font-medium text-darklink">Apps</p>
                  </div>
                  <div className="border rounded-md border-dashed border-ld px-4 py-2 text-center">
                    <h4 className="text-xl">45+</h4>
                    <p className="text-xs font-medium text-darklink">
                      UI Components
                    </p>
                  </div>
                </div>
                <div className="flex gap-3.5 justify-center" data-aos="fade-up" data-aos-delay="800" data-aos-duration="1000">
                  <Button as={Link} href="/auth/auth1/login" color={"primary"} className="px-8">
                    Login
                  </Button>
                  <Button
                    as={Link}
                    href="#demos"
                    color={"outlineprimary"}
                    className="px-4"
                  >
                    Live Preview
                  </Button>
                </div>
              </div>
              <div className="mt-auto lg:block hidden">
                <Image src={Banner3} alt="banner" />
              </div>
            </div>
            <div className="lg:col-span-3 col-span-12 lg:inline hidden">
              <Image
                src={Banner2}
                className=" float-left rtl:float-right  max-w-max h-full"
                alt="banner"

              />
              <Image src={Animate2} className="animted-img-2" alt="banner" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default banner;
