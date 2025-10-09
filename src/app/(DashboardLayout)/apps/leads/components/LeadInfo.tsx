import React from 'react';
import { Card, Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Lead, ChannelPartner, CPSourcing } from '../types';

interface LeadInfoProps {
  lead: Lead;
  channelPartners: ChannelPartner[];
  cpSourcingOptions: CPSourcing[];
  onEditLead: () => void;
  onStatusChange: () => void;
}

const LeadInfo: React.FC<LeadInfoProps> = ({
  lead,
  channelPartners,
  cpSourcingOptions,
  onEditLead,
  onStatusChange
}) => {
  const cpList = Array.isArray(cpSourcingOptions) ? cpSourcingOptions : [];
  
  // Helper functions to get data from customData with fallback to different field name formats
  const getFirstName = () => lead.customData?.["First Name"] || lead.customData?.name || lead.customData?.firstName || '';
  const getLastName = () => lead.customData?.["Last Name"] || lead.customData?.lastName || '';
  const getEmail = () => lead.customData?.["Email"] || lead.customData?.email || '';
  const getPhone = () => lead.customData?.["Phone"] || lead.customData?.contact || lead.customData?.phone || '';
  const getCompany = () => lead.customData?.["Company"] || lead.customData?.company || '';
  const getNotes = () => lead.customData?.["Notes"] || lead.customData?.notes || '';
  const getLeadPriority = () => lead.customData?.["Lead Priority"] || lead.customData?.leadPriority || '';
  const getPropertyType = () => lead.customData?.["Property Type"] || lead.customData?.propertyType || '';
  const getConfiguration = () => lead.customData?.["Configuration"] || lead.customData?.configuration || '';
  const getFundingMode = () => lead.customData?.["Funding Mode"] || lead.customData?.fundingMode || '';
  const getGender = () => lead.customData?.["Gender"] || lead.customData?.gender || '';
  const getBudget = () => lead.customData?.["Budget"] || lead.customData?.budget || '';
  
  // Function to get source name with channel partner info
  const getSourceName = (lead: Lead) => {
    const channelPartnerId = lead.customData?.["Channel Partner"];
    if (channelPartnerId) {
      const channelPartner = channelPartners.find(cp => cp._id === channelPartnerId);
      if (channelPartner) {
        let sourceName = `Channel Partner: ${channelPartner.name}`;
        
        const cpSourcingId = lead.customData?.["Channel Partner Sourcing"];
        if (cpSourcingId) {
          const cpSourcing = cpList.find(cp => cp._id === cpSourcingId);
          if (cpSourcing) {
            sourceName += ` (${cpSourcing.channelPartnerId.name} - ${cpSourcing.projectId.name})`;
          }
        }
        return sourceName;
      } else {
        const cpSourcingId = lead.customData?.["Channel Partner Sourcing"];
        if (cpSourcingId) {
          const cpSourcing = cpList.find(cp => cp._id === cpSourcingId);
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
      {/* Basic Information */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
            <Icon icon="solar:user-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-900 dark:text-white font-medium">
                  {getFirstName()} {getLastName()}
                </p>
                {getFirstName() && (
                  <Badge color="blue" size="sm">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
              <p className="text-gray-900 dark:text-white">{getCompany() || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-900 dark:text-white">{getEmail() || 'N/A'}</p>
                {getEmail() && (
                  <Button size="xs" color="light" onClick={() => window.open(`mailto:${getEmail()}`)}>
                    <Icon icon="solar:letter-unread-line-duotone" className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-900 dark:text-white">{getPhone() || 'N/A'}</p>
                {getPhone() && (
                  <Button size="xs" color="light" onClick={() => window.open(`tel:${getPhone()}`)}>
                    <Icon icon="solar:phone-line-duotone" className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white text-sm">
                {getNotes() || 'No notes available'}
              </p>
            </div>
          </div>

          {/* Additional Lead Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lead Priority</label>
              <div className="mt-1">
                <Badge
                  color={
                    getLeadPriority() === 'Hot' ? 'red' :
                      getLeadPriority() === 'Warm' ? 'orange' :
                        getLeadPriority() === 'Cold' ? 'blue' : 'gray'
                  }
                  size="sm"
                >
                  {getLeadPriority() || 'Not Set'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Property Type</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {getPropertyType() || 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuration</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {getConfiguration() || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Funding Mode</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {getFundingMode() || 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {getGender() || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {getBudget() || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Lead Details */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
            <Icon icon="solar:chart-line-duotone" className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Details</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lead Source</label>
              <div className="mt-1">
                <Badge color="blue" size="sm">
                  {getSourceName(lead)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
              <div className="mt-1">
                <Badge color="purple" size="sm">
                  {lead.project?.name || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <div className="flex items-center gap-2 mt-1">
              {lead.statusHistory && lead.statusHistory.length > 0 && (
                <Badge color="blue" size="sm">
                  {lead.statusHistory[lead.statusHistory.length - 1]?.status?.name || 'N/A'}
                </Badge>
              )}
              <Badge color="gray" size="sm">
                {lead.statusHistory?.length || 0} Changes
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
              <p className="text-gray-900 dark:text-white">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
              <p className="text-gray-900 dark:text-white">
                {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeadInfo;
