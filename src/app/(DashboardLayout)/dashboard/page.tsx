import React from "react";
import DashboardOverview from "@/app/components/dashboard/DashboardOverview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Welcome Back",
  description: "Your personalized dashboard overview with comprehensive analytics and insights",
};

const Dashboard = () => {
  return (
    <div className="p-6">
      <DashboardOverview />
    </div>
  );
};

export default Dashboard;
