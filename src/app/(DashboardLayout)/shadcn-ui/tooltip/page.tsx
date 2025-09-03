import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicTooltip from '@/app/components/shadcn-ui/Tooltip/BasicTooltip';

export const metadata: Metadata = {
    title: "Ui Tooltip",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Tooltip",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Tooltip" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="col-span-12">
        <BasicTooltip/>
      </div>

    </div>
  </>
  )
}

export default page