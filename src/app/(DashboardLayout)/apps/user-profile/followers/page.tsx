import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import FollowersApp from "@/app/components/apps/userprofile/followers";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Followers",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Followers",
  },
];
const Followers = () => {
  return (
    <>
      <BreadcrumbComp title="Followers" items={BCrumb} />
      <FollowersApp />
    </>
  );
};

export default Followers;
