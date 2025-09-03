import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import ReactColumnVisibilityTable from "@/app/components/react-tables/column-visiblity/page";


export const metadata: Metadata = {
    title: "column visibility Table ",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "column visibility Table ",
    },
];
function page() {
    return (
        <>
            <BreadcrumbComp title="column visibility Table " items={BCrumb} />
            <ReactColumnVisibilityTable />
        </>
    );
}

export default page;
