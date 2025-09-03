"use client";
import CardBox from "@/app/components/shared/CardBox";
import { Drawer, HR } from "flowbite-react";
import React, { useState } from "react";
import ChatListing from "@/app/components/apps/chat/ChatListing";
import ChatContent from "@/app/components/apps/chat/ChatContent";
import ChatMsgSent from "@/app/components/apps/chat/ChatMsgSent";
import { ChatProvider } from '@/app/context/ChatContext/index';

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chat",
  },
];
const ChatsApp = () => {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const handleClose = () => setIsOpenChat(false);
  return (
    <>
      <ChatProvider>
        <CardBox className="p-0 overflow-hidden">
          <div className="flex">
            {/* ------------------------------------------- */}
            {/* Left Part */}
            {/* ------------------------------------------- */}
            <Drawer
              open={isOpenChat}
              onClose={handleClose}
              className="lg:relative lg:transform-none lg:h-auto lg:bg-transparent max-w-[350px] w-full  lg:z-[0] "
            >
              <ChatListing />
            </Drawer>
            {/* ------------------------------------------- */}
            {/* Right part */}
            {/* ------------------------------------------- */}
            <div className="grow w-[70%] shrink-0">
              <ChatContent onClickMobile={() => setIsOpenChat(true)} />
              <HR className="my-0" />
              <ChatMsgSent />
            </div>
          </div>
        </CardBox>
      </ChatProvider >
    </>
  );
};

export default ChatsApp;
