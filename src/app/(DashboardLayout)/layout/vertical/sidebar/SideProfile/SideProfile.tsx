"use client";
import { Icon } from "@iconify/react";
import { Button, Dropdown } from "flowbite-react";
import React from "react";
import * as profileData from "../../header/Data";
import Link from "next/link";
import Image from "next/image";
import SimpleBar from "simplebar-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const SideProfile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/auth1/login");
  };

  return (
    <>
      <div className="relative group/menu">
        <Dropdown
          label=""
          className="w-screen sm:w-[360px] py-6 !shadow-lg rounded-sm"
          dismissOnClick={false}
          renderTrigger={() => (
            <span className="h-10 w-10  mx-auto  hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
              <Image
                src="/images/profile/user-1.jpg"
                alt="logo"
                height="40"
                width="40"
                className="rounded-full mx-auto cursor-pointer border border-dashed border-transparent  hover:border-primary p-0.5"
              />
            </span>
          )}
        >
          <div className="px-6">
            <h3 className="text-lg font-semibold text-ld">User Profile</h3>
            <div className="flex items-center gap-6 pb-5 border-b dark:border-darkborder mt-5 mb-3">
              <Image
                src="/images/profile/user-1.jpg"
                alt="logo"
                height="80"
                width="80"
                className="rounded-full"
              />
              <div>
                <h5 className="card-title">{user?.name || "User"}</h5>
                <span className="card-subtitle">{user?.role || "User"}</span>
                <p className="card-subtitle mb-0 mt-1 flex items-center">
                  <Icon
                    icon="solar:mailbox-line-duotone"
                    className="text-base me-1"
                  />
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
          <SimpleBar>
          {profileData.profileDD.map((items, index) => (
            <Dropdown.Item
              as={Link}
              href={items.url}
              className="px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
              key={index}
            >
              <div className="flex items-center w-full">
                <div
                  className={`h-11 w-11 flex-shrink-0 rounded-md flex justify-center items-center ${items.bgcolor}`}
                >
                  <Icon icon={items.icon} height={20} className={items.color} />
                </div>
                <div className="ps-4 flex justify-between w-full">
                  <div className="w-3/4 ">
                    <h5 className="mb-1 text-sm  group-hover/link:text-primary">
                      {items.title}
                    </h5>
                    <div className="text-xs  text-darklink">
                      {items.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </Dropdown.Item>
          ))}
          </SimpleBar>

          <div className="pt-6 px-6">
            <Button
              color={"primary"}
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </Dropdown>
      </div>
    </>
  );
};

export default SideProfile;
