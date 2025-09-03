import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import PaginationTable from "@/app/components/react-tables/pagination/page";

export const metadata: Metadata = {
    title: "Pagination Table",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Pagination Table",
    },
];
function page() {
    return (
        <>
            <BreadcrumbComp title="Pagination Table " items={BCrumb} />
            <PaginationTable />
        </>
    );
}

export default page;
