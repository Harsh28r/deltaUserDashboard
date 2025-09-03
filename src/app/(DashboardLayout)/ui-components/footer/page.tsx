import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import DefaultFooter from "@/app/components/ui-components/Footer/DefaultFooter";
import FooterWithLogo from "@/app/components/ui-components/Footer/FooterWithLogo";
import SocialFooter from "@/app/components/ui-components/Footer/SocialFooter";
import SitemapLinkFooter from "@/app/components/ui-components/Footer/SitemapLinkFooter";
export const metadata: Metadata = {
  title: "Ui footer",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Footer",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Footer" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="col-span-12">
          <DefaultFooter />
        </div>
        {/* Footer With Logo */}
        <div className="col-span-12">
          <FooterWithLogo />
        </div>
        {/* Social Footer */}
        <div className="col-span-12">
          <SocialFooter />
        </div>
        {/* Sitemap Link Footer */}
        <div className="col-span-12">
          <SitemapLinkFooter />
        </div>
      </div>
    </>
  );
};

export default page;
