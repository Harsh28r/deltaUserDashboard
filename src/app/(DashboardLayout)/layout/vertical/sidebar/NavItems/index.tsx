"use client";
import React, { useContext } from "react";
import { ChildItem } from "../Sidebaritems";
import { Sidebar } from "flowbite-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CustomizerContext } from "@/app/context/CustomizerContext";

interface NavItemsProps {
  item: ChildItem;
}
const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { setIsMobileSidebar } = useContext(CustomizerContext);
  const handleMobileSidebar = () => {
    setIsMobileSidebar(false);
  };
  
  // Don't render if item doesn't have required properties
  if (!item || !item.name) {
    return null;
  }
  
  return (
    <>
      <Sidebar.Item
        href={item.url}
        as={Link}
        className={`${
          item.url == pathname
            ? "!text-primary bg-lightprimary "
            : "text-link bg-transparent group/link "
        } `}
      >
        <span
          onClick={handleMobileSidebar}
          className="flex gap-3 align-center items-center"
        >
          {item.icon ? (
            <Icon icon={item.icon} className={`${item.color}`} height={18} />
          ) : (
            <span
              className={`${
                item.url == pathname
                  ? "dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary !bg-primary h-[6px] w-[6px]"
                  : "h-[6px] w-[6px] bg-darklink dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary"
              } `}
            ></span>
          )}
          <span className="max-w-36 overflow-hidden">{t(`${item.name}`)}</span>
        </span>
      </Sidebar.Item>
    </>
  );
};

export default NavItems;
