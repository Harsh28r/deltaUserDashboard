import React from "react";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";
import { ProductProvider } from '@/app/context/Ecommercecontext/index';
import ProductTableList from '@/app/components/apps/ecommerce/productTableList/ProductTableList'

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Product list",
  },
];
export const metadata: Metadata = {
  title: "Product List",
};
const EcomProductList = () => {
  return (
    <>
      <ProductProvider>
        <BreadcrumbComp title="Product list" items={BCrumb} />
        <ProductTableList />
      </ProductProvider>
    </>
  )
}

export default EcomProductList
