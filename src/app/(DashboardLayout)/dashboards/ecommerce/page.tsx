
import AnnualProfit from "@/app/components/dashboards/ecommerce/AnnualProfit";
import MarketingReport from "@/app/components/dashboards/ecommerce/MarketingReport";
import Payments from "@/app/components/dashboards/ecommerce/Payments";
import ProductSales from "@/app/components/dashboards/ecommerce/ProductSales";
import RecentTransaction from "@/app/components/dashboards/ecommerce/RecentTransaction";
import SalesProfit from "@/app/components/dashboards/ecommerce/SalesProfit";
import SmallCards from "@/app/components/dashboards/ecommerce/smallCards";
import TopProducts from "@/app/components/dashboards/ecommerce/TopProducts";
import Welcome from "@/app/components/dashboards/ecommerce/Welcome";
import React from "react";



const ecommerce = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6  col-span-12">
          <Welcome />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <SmallCards />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <SalesProfit />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <ProductSales />
        </div>
        <div className="lg:col-span-5 col-span-12">
          <MarketingReport />
        </div>
        <div className="lg:col-span-3 col-span-12">
          <Payments />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <AnnualProfit />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <TopProducts />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <RecentTransaction />
        </div>
      </div>
     
    </>
  );
};

export default ecommerce;
