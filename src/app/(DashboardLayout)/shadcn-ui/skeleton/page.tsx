import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicSkeleton from '@/app/components/shadcn-ui/Skeleton/BasicSkeleton';
import CardSkeleton from '@/app/components/shadcn-ui/Skeleton/CardSkeleton';

export const metadata: Metadata = {
    title: "Ui Skeleton",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Skeleton",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Skeleton" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicSkeleton/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <CardSkeleton/>
      </div>

    </div>
  </>
  )
}

export default page