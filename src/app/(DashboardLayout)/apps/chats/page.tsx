import ChatsApp from "@/app/components/apps/chat";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chat App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chat",
  },
];
const Chats = () => {
  return (
    <>
      <BreadcrumbComp title="Chat App" items={BCrumb} />
      <ChatsApp />
    </>
  );
};

export default Chats;
