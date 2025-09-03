import { Metadata } from 'next';
import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp';
import BasicAvatar from '@/app/components/shadcn-ui/Avatar/BasicAvatar';

export const metadata: Metadata = {
    title: "Ui Avatar",
  };
const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Avatar",
    },
  ];

const page = () => {
  return (
    <>
    <BreadcrumbComp title="Avatar" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicAvatar />
      </div>
    </div>
  </>
  )
}

export default page