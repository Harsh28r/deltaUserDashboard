"use client";
import React from "react";
import CardBox from "@/app/components/shared/CardBox";
import { Tabs } from "flowbite-react";
import { Icon } from "@iconify/react";
import AccountTab from "@/app/components/theme-pages/account-settings/AccountTab";
import NotificationTab from "@/app/components/theme-pages/account-settings/NotificationTab";
import BillsTabs from "@/app/components/theme-pages/account-settings/BillsTab";
import SecurityTab from "@/app/components/theme-pages/account-settings/SecurityTab";

const AccountSettingIndex = () => {
  return (
    <>
      <CardBox className="px-0 py-0 ">
        <Tabs aria-label="Tabs with underline" variant="underline">
          <Tabs.Item
            active
            title="Account"
            icon={() => <Icon icon="solar:user-circle-linear" height={20} />}
          >
            <div className="p-6">
              <AccountTab />
            </div>
          </Tabs.Item>
          <Tabs.Item
            title="Notification"
            icon={() => <Icon icon="solar:bell-linear" height={20} />}
          >
            <div className="p-6">
              <NotificationTab />
            </div>
          </Tabs.Item>
          <Tabs.Item
            title="Bills"
            icon={() => <Icon icon="solar:bill-check-broken" height={20} />}
          >
            <div className="p-6">
              <BillsTabs />
            </div>
          </Tabs.Item>
          <Tabs.Item
            title="Security"
            icon={() => (
              <Icon
                icon="solar:lock-keyhole-minimalistic-unlocked-broken"
                height={20}
              />
            )}
          >
            <div className="p-6">
              <SecurityTab />
            </div>
          </Tabs.Item>
        </Tabs>
      </CardBox>
    </>
  );
};

export default AccountSettingIndex;
