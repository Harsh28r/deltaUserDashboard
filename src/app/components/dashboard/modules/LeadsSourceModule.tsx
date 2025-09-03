"use client";

import React from "react";
import LeadSourcesManager from "@/app/components/leads/LeadSourcesManager";
import PermissionGate from "@/app/components/auth/PermissionGate";

const LeadsSourceModule = () => {
  return (
    <PermissionGate permission="leadssource:read">
      <LeadSourcesManager />
    </PermissionGate>
  );
};

export default LeadsSourceModule;

