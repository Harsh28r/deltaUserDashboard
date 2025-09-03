import EmaiilApp from "@/app/components/apps/email";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Email App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Email",
  },
];
const Emaiil = () => {
  return (
    <>
      <BreadcrumbComp title="Email App" items={BCrumb} />
      <EmaiilApp />
    </>
  );
};
export default Emaiil;
