import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicTab from '@/app/components/shadcn-ui/Tab/BasicTab';

export const metadata: Metadata = {
    title: "Ui Tab",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Tab",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Tab" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicTab/>
      </div>

    </div>
  </>
  )
}

export default page