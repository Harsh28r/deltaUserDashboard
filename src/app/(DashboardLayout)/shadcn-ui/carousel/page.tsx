import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import BasicCarousel from '@/app/components/shadcn-ui/Carousel/BasicCarousel';
import CarouselWithultipleItem from '@/app/components/shadcn-ui/Carousel/CarouselWithultipleItem';
import { VerticalCarousel } from '@/app/components/shadcn-ui/Carousel/VerticalCarousel';



export const metadata: Metadata = {
    title: "Ui Carousel",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Carousel",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Carousel" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicCarousel/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <VerticalCarousel/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <CarouselWithultipleItem/>
      </div>
    </div>
  </>
  )
}

export default page