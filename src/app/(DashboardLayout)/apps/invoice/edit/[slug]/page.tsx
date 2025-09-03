import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import EditInvoicePage from '@/app/components/apps/invoice/Edit-invoice/index';
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Invoice Edit App",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Invoice Edit",
    },
];
function EditPage() {
    return (
        <InvoiceProvider>
            <BreadcrumbComp title="Invoice Edit" items={BCrumb} />
            <CardBox>
                <EditInvoicePage />
            </CardBox>
        </InvoiceProvider>
    )
}

export default EditPage;
