"use client";

import React from "react";
import { Card, Button } from "flowbite-react";
import PermissionGate from "@/app/components/auth/PermissionGate";
import { useAuth } from "@/app/context/AuthContext";

const LeadsPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {user?.name}! Manage your leads here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* View Leads - requires leads:read permission */}
        <PermissionGate permission="leads:read">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              View Leads
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              View and browse all leads in the system.
            </p>
            <Button color="primary" className="mt-4">
              View Leads
            </Button>
          </Card>
        </PermissionGate>

        {/* Create Lead - requires leads:create permission */}
        <PermissionGate permission="leads:create">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create Lead
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Add a new lead to the system.
            </p>
            <Button color="success" className="mt-4">
              Create Lead
            </Button>
          </Card>
        </PermissionGate>

        {/* Update Leads - requires leads:update permission */}
        <PermissionGate permission="leads:update">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Update Leads
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Edit and update existing leads.
            </p>
            <Button color="warning" className="mt-4">
              Update Leads
            </Button>
          </Card>
        </PermissionGate>

        {/* Bulk Operations - requires leads:bulk permission */}
        <PermissionGate permission="leads:bulk">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bulk Operations
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Perform bulk operations on multiple leads.
            </p>
            <Button color="purple" className="mt-4">
              Bulk Operations
            </Button>
          </Card>
        </PermissionGate>

        {/* Transfer Leads - requires leads:transfer permission */}
        <PermissionGate permission="leads:transfer">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transfer Leads
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Transfer leads between users or departments.
            </p>
            <Button color="info" className="mt-4">
              Transfer Leads
            </Button>
          </Card>
        </PermissionGate>
      </div>

      {/* User Permissions Display */}
      <div className="mt-8">
        <Card>
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Your Permissions
          </h5>
          <div className="flex flex-wrap gap-2">
            {user?.permissions?.allowed?.map((permission, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {permission}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeadsPage;

