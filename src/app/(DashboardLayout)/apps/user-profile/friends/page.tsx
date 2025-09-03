import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import FriendsApp from "@/app/components/apps/userprofile/friends";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Friends",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Friends",
  },
];

const Friends = () => {
  return (
    <>
      <BreadcrumbComp title="Friends" items={BCrumb} />
      <FriendsApp />
    </>
  );
};

export default Friends;
