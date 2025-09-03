import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import ReactEditable from "@/app/components/react-tables/row-selection/page";

export const metadata: Metadata = {
    title: "Row Selection Table",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Row Selection Table",
    },
];
function page() {
    return (
        <>
            <BreadcrumbComp title="Row Selection Table " items={BCrumb} />
            <ReactEditable />
        </>
    );
}

export default page;
