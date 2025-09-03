import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicDialog from '@/app/components/shadcn-ui/Dialog/BasicDialog';
import DialogWithCustomCloseButton from '@/app/components/shadcn-ui/Dialog/DialogWithCustomCloseButton';
import DialogWithForm from '@/app/components/shadcn-ui/Dialog/DialogWithForm';

export const metadata: Metadata = {
    title: "Ui Dialog",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Dialog",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Dialog" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicDialog/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <DialogWithCustomCloseButton/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <DialogWithForm/>
      </div>

    </div>
  </>
  )
}

export default page