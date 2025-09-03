import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicButton from '@/app/components/shadcn-ui/Button/BasicButton';
import OutlineButton from '@/app/components/shadcn-ui/Button/OutlineButton';
import GhostButton from '@/app/components/shadcn-ui/Button/GhostButton';
import ButtonWithIcon from '@/app/components/shadcn-ui/Button/ButtonWithIcon';
import LoadingButton from '@/app/components/shadcn-ui/Button/LoadingButton';

export const metadata: Metadata = {
    title: "Ui Button",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Button",
    },
  ];

const page = () => {
  return (
    <>
    <BreadcrumbComp title="Button" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicButton />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <OutlineButton />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <GhostButton />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <ButtonWithIcon />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <LoadingButton />
      </div>

    </div>
  </>
  )
}

export default page