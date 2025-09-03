import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import type { Metadata } from "next";
import CardBox from "@/app/components/shared/CardBox";
export const metadata: Metadata = {
  title: "Tabler Icons",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tabler Icons",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Tabler Icons" items={BCrumb} />
      <CardBox>
        <iframe
          src="https://tabler-icons.io/"
          title="Inline Frame Example"
          width="100%"
          height="650"
        ></iframe>
      </CardBox>
    </>
  );
};

export default page;
