import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicDrawer from '@/app/components/shadcn-ui/Drawer/BasicDrawer';

export const metadata: Metadata = {
    title: "Ui Drawer",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Drawer",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Drawer" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        {/* <BasicDropdown /> */}
        <BasicDrawer/>
      </div>


    </div>
  </>
  )
}

export default page