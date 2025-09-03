"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { demosMegamenu, appsMegamenu,FrontMenu } from "../Data";
import * as AppsData from "@/app/(DashboardLayout)/layout/vertical/header/Data";
import { IconChevronDown, IconHelp } from "@tabler/icons-react";
import { Button } from "flowbite-react";
import { Accordion } from "flowbite-react";
import Quicklinks from "@/app/(DashboardLayout)/layout/vertical/header/Quicklinks";
const MobileDemosMenu = () => {
  return (
    <>
      <Accordion collapseAll className="shadow-none mt-4 divide-none">
        <Accordion.Panel>
          <Accordion.Title className="py-3 px-0">Demos</Accordion.Title>
          <Accordion.Content className="px-0 py-3">
            <div className="p-0">
              <div className="mb-5">
                <h5 className="card-title">Different Demos</h5>
                <p>Included with the Package</p>
              </div>
              <div className="grid xl:grid-cols-5 grid-cols-1 gap-6">
                {demosMegamenu.map((item, index) => (
                  <div key={index}>
                    <div className="overflow-hidden border border-ld rounded-md relative flex justify-center items-center group ">
                      <Image
                        src={item.img}
                        alt="materialm"
                        className="w-full"
                      />
                      {item.link != "" ? (
                        <>
                          <Button
                            as={Link}
                            href={item.link}
                            color={"primary"}
                            size={"sm"}
                            className="text-xs absolute  left-0 right-0 flex justify-center items-center w-fit mx-auto invisible group-hover:visible z-[1]"
                          >
                            Live Preview
                          </Button>
                          <div className="absolute top-0 bottom-0 left-0 h-full w-full bg-blue-100  mix-blend-multiply invisible group-hover:visible"></div>
                        </>
                      ) : null}
                      
                    </div>
                    <h5 className="text-center p-3 text-sm font-semibold">
                      {item.name}
                    </h5>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h5 className="card-title mb-5">Different Apps</h5>
                <div className="grid xl:grid-cols-5 grid-cols-1 gap-6">
                  {appsMegamenu.map((item, index) => (
                    <div key={index}>
                      <div className="overflow-hidden border border-ld rounded-md relative flex justify-center items-center group ">
                        <Image
                          src={item.img}
                          alt="materialm"
                          className="w-full"
                        />
                        <Button
                          as={Link}
                          href={item.link}
                          color={"primary"}
                          size={"sm"}
                          className="text-xs  absolute  left-0 right-0 flex justify-center items-center w-fit mx-auto invisible group-hover:visible z-[1]"
                        >
                          Live Preview
                        </Button>
                        <div className="absolute top-0 bottom-0 left-0 h-full w-full bg-blue-100  mix-blend-multiply invisible group-hover:visible"></div>
                      </div>
                      <h5 className="text-center p-3 text-sm font-semibold">
                        {item.name}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title className="py-3 px-0">
            Frontend Pages
          </Accordion.Title>
          <Accordion.Content className="px-0 py-3">
            <div className="p-0">
              <div className="mb-5">
                <h5 className="card-title">Different Front Pages</h5>
                <p>Included with the Package</p>
              </div>
              <div className="grid xl:grid-cols-5 grid-cols-1 gap-6">
                {FrontMenu.map((item, index) => (
                  <div key={index}>
                    <div className="overflow-hidden border border-ld rounded-md relative flex justify-center items-center group ">
                      <Image src={item.img} alt="matdash" className="w-full" />
                      {item.link != "" ? (
                        <>
                          <Button
                            as={Link}
                            href={item.link}
                            color={"primary"}
                            size={"sm"}
                            className="text-xs absolute  left-0 right-0 flex justify-center items-center w-fit mx-auto invisible group-hover:visible z-[1]"
                          >
                            Live Preview
                          </Button>
                          <div className="absolute top-0 bottom-0 left-0 h-full w-full bg-blue-100  mix-blend-multiply invisible group-hover:visible"></div>
                        </>
                      ) : null}
                    </div>
                    <h5 className="text-center p-3 text-sm font-semibold">
                      {item.name}
                    </h5>
                    {item.include == "Included With The package" ? (
                      <p className="text-xs text-center text-bodytext">
                        Included With The package
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title className="py-3 px-0">Pages</Accordion.Title>
          <Accordion.Content className="px-0 py-3">
            <div className="grid grid-cols-12 w-full">
              <div className="lg:col-span-8 col-span-12 flex items-stretch lg:px-5 lg:pr-0 px-0 py-5">
                <div className="grid grid-cols-12 lg:gap-3 w-full">
                  {AppsData.appsLink.map((links, index) => (
                    <div
                      className="col-span-12 lg:col-span-6 flex items-stretch"
                      key={index}
                    >
                      <ul className="mb-5">
                        <li>
                          <Link
                            href={links.href}
                            className="flex gap-3 items-center hover:text-primary group relative"
                          >
                            <span className="bg-lighthover dark:bg-darkgray  h-10 w-10 flex justify-center items-center rounded-full">
                              <Image
                                src={links.avatar}
                                width={20}
                                height={20}
                                alt="materialm"
                              />
                            </span>
                            <div>
                              <h6 className="font-semibold text-sm text-ld group-hover:text-primary mb-1 ">
                                {links.title}
                              </h6>
                              <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                                {links.subtext}
                              </p>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                  <div className="col-span-12 md:col-span-12 border-t border-border dark:border-darkborder hidden lg:flex items-stretch pt-4 pr-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center text-dark dark:text-darklink">
                        <i className="ti ti-help text-lg "></i>
                        <Link
                          href={"/theme-pages/faq"}
                          className="text-sm font-semibold hover:text-primary ml-2 flex gap-2 items-center"
                        >
                          <IconHelp width={20} />
                          Frequently Asked Questions
                        </Link>
                      </div>
                      <Button color={"primary"}>Check</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 col-span-12  flex items-strech">
                <Quicklinks />
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </>
  );
};

export default MobileDemosMenu;
