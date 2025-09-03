import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import InvoiceDetail from '@/app/components/apps/invoice/Invoice-detail/index'
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Invoice Details App ",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Invoice Details",
    },
];

function InvoiceDetailPage() {
    return (
        <InvoiceProvider>
            <BreadcrumbComp title="Invoice Details" items={BCrumb} />
            <CardBox>
                <InvoiceDetail />
            </CardBox>
        </InvoiceProvider>
    )
}
export default InvoiceDetailPage;



