import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicDatepicker from '@/app/components/shadcn-ui/Datepicker/BasicDatepicker';
import DateRangePicker from '@/app/components/shadcn-ui/Datepicker/DateRangePicker';

export const metadata: Metadata = {
    title: "Ui Datepicker",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Datepicker",
    },
  ];
  
const page = () => {

  return (
    <>
    <BreadcrumbComp title="Datepicker" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">

      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicDatepicker/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <DateRangePicker/>
      </div>
    </div>
  </>
  )
}

export default page