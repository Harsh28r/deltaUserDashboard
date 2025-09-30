import React from "react";
import CrmDashboard from "@/app/components/dashboard/CrmDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Management Dashboard - Lead Analytics & Performance",
  description: "Comprehensive management dashboard for lead analytics, team performance, and business metrics",
};

const ManagementDashboard = () => {
  return (
    <div className="p-6">
      <CrmDashboard />
    </div>
  );
};

export default ManagementDashboard;

