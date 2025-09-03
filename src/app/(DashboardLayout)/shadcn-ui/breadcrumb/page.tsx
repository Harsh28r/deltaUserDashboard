import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicBreadcrumb from '@/app/components/shadcn-ui/Breadcrumb/BasicBreadcrumb';
import BreadcrumbWithSeparator from '@/app/components/shadcn-ui/Breadcrumb/BreadcrumbWithSeparator';
import BreadcrumbWithDropdown from '@/app/components/shadcn-ui/Breadcrumb/BreadcrumbWithDropdown';
import BreadcrumbWithEllipsis from '@/app/components/shadcn-ui/Breadcrumb/BreadcrumbWithEllipsis';



export const metadata: Metadata = {
    title: "Ui Breadcrumb",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Breadcrumb",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Breadcrumb" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicBreadcrumb/>
      </div>
       <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BreadcrumbWithSeparator/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BreadcrumbWithDropdown/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BreadcrumbWithEllipsis/>
      </div>
     

    </div>
  </>
  )
}

export default page