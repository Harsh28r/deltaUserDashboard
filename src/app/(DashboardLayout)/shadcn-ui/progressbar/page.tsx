import { Metadata } from 'next';
import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp';
import BasicProgressbar from '@/app/components/shadcn-ui/Progressbar/BasicProgressbar';

export const metadata: Metadata = {
    title: "Ui Progressbar",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Progressbar",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Progressbar" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicProgressbar/>
      </div>

    </div>
  </>
  )
}

export default page