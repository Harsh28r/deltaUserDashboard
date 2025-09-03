import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import BasicAlert from '@/app/components/shadcn-ui/Alert/BasicAlert';
import { Metadata } from 'next';
import LightAlert from '@/app/components/shadcn-ui/Alert/LightAlert';
export const metadata: Metadata = {
    title: "Alert",
  };

const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Alert",
    },
  ];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Alerts" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Basic */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BasicAlert/>
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightAlert/>
        </div>
      </div>
    </>
  )
}

export default page