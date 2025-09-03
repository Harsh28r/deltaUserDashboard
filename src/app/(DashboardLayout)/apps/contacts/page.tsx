import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import ContactApp from "@/app/components/apps/contacts/index";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact App",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Contact",
  },
];
const Contacts = () => {
  return (
    <>
      <BreadcrumbComp title="Contact App" items={BCrumb} />
      <ContactApp />
    </>
  );
};

export default Contacts;
