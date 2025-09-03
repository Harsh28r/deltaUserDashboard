import FormCustom from '@/app/components/form-components/FormCustom'
import React from 'react'
import type { Metadata } from "next";
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp';
export const metadata: Metadata = {
  title: "Form Custom",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Custom",
  },
];

const page = () => {
  return (
    <>
        <BreadcrumbComp title="Form Custom" items={BCrumb} />
        <FormCustom/>
    </>
  )
}

export default page