import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultList from "@/app/components/ui-components/ListGroup/DefaultList";
import LinkList from "@/app/components/ui-components/ListGroup/LinkList";
import ListButton from "@/app/components/ui-components/ListGroup/ListButton";
import ListIcon from "@/app/components/ui-components/ListGroup/ListIcon";
export const metadata: Metadata = {
  title: "Ui ListGroup",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "List Group",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="List Group" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultList />
        </div>
        {/* LinkList */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LinkList />
        </div>
        {/* ListButton */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ListButton />
        </div>
        {/* ListIcon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ListIcon />
        </div>
      </div>
    </>
  );
};

export default page;
