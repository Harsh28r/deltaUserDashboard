import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Lead, ChannelPartner, CPSourcing, Activity } from '../types';

interface LeadOverviewProps {
  lead: Lead;
  activities: Activity[];
  channelPartners: ChannelPartner[];
  cpSourcingOptions: CPSourcing[];
}

const LeadOverview: React.FC<LeadOverviewProps> = ({
  lead,
  activities,
  channelPartners,
  cpSourcingOptions
}) => {
  // Function to get source name with channel partner info
  const getSourceName = (lead: Lead) => {
    const channelPartnerId = lead.customData?.["Channel Partner"];
    if (channelPartnerId) {
      const channelPartner = channelPartners.find(cp => cp._id === channelPartnerId);
      if (channelPartner) {
        let sourceName = `Channel Partner: ${channelPartner.name}`;
        
        const cpSourcingId = lead.customData?.["Channel Partner Sourcing"];
        if (cpSourcingId) {
          const cpSourcing = cpSourcingOptions.find(cp => cp._id === cpSourcingId);
          if (cpSourcing) {
            sourceName += ` (${cpSourcing.channelPartnerId.name} - ${cpSourcing.projectId.name})`;
          }
        }
        return sourceName;
      } else {
        const cpSourcingId = lead.customData?.["Channel Partner Sourcing"];
        if (cpSourcingId) {
          const cpSourcing = cpSourcingOptions.find(cp => cp._id === cpSourcingId);
          if (cpSourcing) {
            return `Channel Partner: ${cpSourcing.channelPartnerId.name}`;
          }
        }
        return 'Channel Partner';
      }
    } else if (lead.leadSource?._id) {
      return lead.leadSource?.name || 'N/A';
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Lead Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lead Score</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {lead.LeadScore || 0}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              <Icon icon="solar:star-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge color="green" size="sm">
                  {lead.currentStatus?.name || 'N/A'}
                </Badge>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <Icon icon="solar:check-circle-line-duotone" className="text-green-600 dark:text-green-400 text-xl" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Source</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {getSourceName(lead)}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
              <Icon icon="solar:target-line-duotone" className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
          </div>
        </Card>

        {/* CP Sourcing Information - Always show if there's CP sourcing data */}
        {lead?.customData?.["Channel Partner Sourcing"] && (
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">CP Sourcing Details</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {(() => {
                    const cpSourcingId = lead.customData?.["Channel Partner Sourcing"];
                    const cpSourcing = cpSourcingOptions.find(cp => cp._id === cpSourcingId);
                    return cpSourcing ? `${cpSourcing.channelPartnerId.name} - ${cpSourcing.projectId.name}` : 'Loading...';
                  })()}
                </p>
                {(() => {
                  const cpSourcingId = lead.customData?.["Channel Partner Sourcing"];
                  const cpSourcing = cpSourcingOptions.find(cp => cp._id === cpSourcingId);
                  return cpSourcing ? (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                      <p>Visits: {cpSourcing.sourcingHistory.length}</p>
                      <p>Status: {cpSourcing.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                      <p>Loading CP sourcing data...</p>
                    </div>
                  );
                })()}
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <Icon icon="solar:chart-line-duotone" className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Lead Priority and Scoring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Lead Score</h4>
            <Icon icon="solar:star-line-duotone" className="text-yellow-500 text-lg" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            {lead.LeadScore || 0}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((lead.LeadScore || 0) * 10, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {(lead.LeadScore || 0) >= 80 ? 'High Priority' : (lead.LeadScore || 0) >= 50 ? 'Medium Priority' : 'Low Priority'}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Engagement Level</h4>
            <Icon icon="solar:heart-line-duotone" className="text-red-500 text-lg" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            {activities.length > 10 ? 'High' : activities.length > 5 ? 'Medium' : 'Low'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Based on {activities.length} activities
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Lead Age</h4>
            <Icon icon="solar:clock-circle-line-duotone" className="text-blue-500 text-lg" />
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {lead.createdAt ? Math.ceil((new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Days since creation
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeadOverview;
