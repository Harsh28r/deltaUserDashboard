import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { Metadata } from 'next';
import DefaultBadge from '@/app/components/shadcn-ui/Badge/DefaultBadge';
import OutlineBadge from '@/app/components/shadcn-ui/Badge/OutlineBadge';
import LinkBadge from '@/app/components/shadcn-ui/Badge/LinkBadge';
import BadgeWithIconText from '@/app/components/shadcn-ui/Badge/BadgeWithIconText';
import Iconbadge from '@/app/components/shadcn-ui/Badge/IconBadge';

export const metadata: Metadata = {
    title: "Ui Badge",
  };
  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Badge",
    },
  ];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Badges" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Basic */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultBadge />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <OutlineBadge />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LinkBadge />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BadgeWithIconText />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <Iconbadge />
        </div>
      </div>
    </>
  )
}

export default page