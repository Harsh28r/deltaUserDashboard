import React from 'react'
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from 'next';
import ReactBasicTables from '@/app/components/react-tables/react-basics/BasicTables';
import StripedTable from '@/app/components/react-tables/react-basics/StripedTable';
import FooterTable from '@/app/components/react-tables/react-basics/FooterTable';


export const metadata: Metadata = {
    title: "Basic Tables List",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Tables List",
    },
];
function page() {
    return (
        <>
            <BreadcrumbComp title="Basic Tables List" items={BCrumb} />
            <div className="grid grid-cols-12 gap-7">
                <div className="col-span-12">
                    <ReactBasicTables />
                </div>
                <div className="col-span-12">
                    <StripedTable />
                </div>
                <div className="col-span-12">
                    <FooterTable />
                </div>
            </div>

        </>
    )
}

export default page
