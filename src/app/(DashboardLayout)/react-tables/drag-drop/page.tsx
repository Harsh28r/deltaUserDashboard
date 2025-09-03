import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import Rowdragdrop from "@/app/components/react-tables/drag-drop/Rowdragdrop";
import Columndragdrop from "@/app/components/react-tables/drag-drop/Columndragdrop";



export const metadata: Metadata = {
    title: "DragDrop Table ",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Drag & Drop Table ",
    },
];
function page() {
    return (
        <>
            <BreadcrumbComp title="Drag & Drop Table " items={BCrumb} />
            <div className="grid grid-cols-12 gap-7">
                <div className="col-span-12">
                    <Rowdragdrop />
                </div>
                <div className="col-span-12">
                    <Columndragdrop />
                </div>
            </div>
        </>
    );
}

export default page;
