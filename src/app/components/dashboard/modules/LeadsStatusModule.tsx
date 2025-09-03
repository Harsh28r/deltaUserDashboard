"use client";

import React from "react";
import LeadStatusesManager from "@/app/components/leads/LeadStatusesManager";
import PermissionGate from "@/app/components/auth/PermissionGate";

const LeadsStatusModule = () => {
  return (
    <PermissionGate permission="leadsstatus:read">
      <LeadStatusesManager />
    </PermissionGate>
  );
};

export default LeadsStatusModule;

