import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import UserProfileApp from "@/app/components/apps/userprofile/profile";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Profile App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "User Profile",
  },
];
const UserProfile = () => {
  return (
    <>
      <BreadcrumbComp title="User Profile" items={BCrumb} />
      <UserProfileApp />
    </>
  );
};

export default UserProfile;
