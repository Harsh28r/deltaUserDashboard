import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import EcommerceShop from "@/app/components/apps/ecommerce/productGrid";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ecommerce Shop",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shop",
  },
];


const Ecommerce = () => {
  return (
    <>
      <BreadcrumbComp title="Shop App" items={BCrumb} />
      <EcommerceShop />
    </>
  );
};

export default Ecommerce;
