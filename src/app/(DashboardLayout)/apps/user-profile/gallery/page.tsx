import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import GalleryApp from "@/app/components/apps/userprofile/Gallery";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Gallery",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Gallery",
  },
];
const Gallery = () => {
  return (
    <>
      <BreadcrumbComp title="Gallery" items={BCrumb} />
      <GalleryApp />
    </>
  );
};

export default Gallery;
