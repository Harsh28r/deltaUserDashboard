import React from "react";
import * as DemosName from "../Data";
import { Button } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
const AllApps = () => {
  return (
    <>
      {/* Demos */}
      <div className="grid grid-cols-12 gap-30">
        {DemosName.Demos.map((item, index) => (
          <React.Fragment key={index}>
            {item.type != true ? (
              <div className="lg:col-span-4 md:col-span-6 col-span-12 " data-aos="fade-up" 
              data-aos-delay="200" data-aos-duration="1000">
                <div className="relative overflow-hidden rounded-md rounded-b-none">
                  <div className="bg-muted dark:bg-darkmuted p-6 pb-0">
                    <div className="overflow-hidden rounded-md rounded-b-none relative flex justify-center items-center group ">
                      <Image
                        src={item.img}
                        alt="materialm"
                        className="w-full"
                      />
                      <Button
                        as={Link}
                        href={item.link}
                        color={"primary"}
                        className="text-xs  absolute  left-0 right-0 flex justify-center items-center w-fit mx-auto invisible group-hover:visible z-[1]"
                      >
                        Live Preview
                      </Button>
                      <div className="absolute top-0 bottom-0 left-0 h-full w-full bg-blue-100  mix-blend-multiply invisible group-hover:visible"></div>
                    </div>
                  </div>
                  <div className="rounded-t-none rounded-md border-ld border border-t-0  p-4">
                    <Link href={item.link} className="text-base text-ld hover:text-primary font-semibold ">{item.name}</Link>
                    <p className="text-darklink mt-1">Application</p>
                  </div>
                </div>
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default AllApps;
