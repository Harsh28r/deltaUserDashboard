import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Activity, LeadStatus, Project, User } from '../types';

interface ActivityTimelineProps {
  activities: Activity[];
  leadStatuses: LeadStatus[];
  projects: Project[];
  users: User[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  leadStatuses,
  projects,
  users
}) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return 'solar:add-circle-line-duotone';
      case 'status_changed':
        return 'solar:refresh-line-duotone';
      case 'transferred':
        return 'solar:transfer-horizontal-line-duotone';
      case 'updated':
        return 'solar:pen-line-duotone';
      default:
        return 'solar:info-circle-line-duotone';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'green';
      case 'status_changed':
        return 'blue';
      case 'transferred':
        return 'orange';
      case 'updated':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatActionText = (activity: Activity) => {
    switch (activity.action) {
      case 'created':
        return 'Lead created';
      case 'status_changed':
        return 'Status changed';
      case 'transferred':
        return 'Lead transferred';
      case 'updated':
        return 'Lead updated';
      default:
        return activity.action.replace('_', ' ');
    }
  };

  const formatDetails = (activity: Activity) => {
    switch (activity.action) {
      case 'status_changed':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon icon="solar:arrow-right-line-duotone" className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Status Changed</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">From:</span>
                <Badge color="gray" size="sm">
                  {(() => {
                    const oldStatus = leadStatuses.find(status => status._id === activity.details.oldStatus);
                    return oldStatus?.name || activity.details.oldStatus || 'Unknown Status';
                  })()}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">To:</span>
                <Badge color="green" size="sm">
                  {(() => {
                    const newStatus = leadStatuses.find(status => status._id === activity.details.newStatus);
                    return newStatus?.name || activity.details.newStatus || 'Unknown Status';
                  })()}
                </Badge>
              </div>
            </div>
            {activity.details.statusFields && Object.keys(activity.details.statusFields).length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:settings-line-duotone" className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Fields Updated:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {Object.entries(activity.details.statusFields).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium text-gray-600 dark:text-gray-400">{key}:</span>
                      <span className="text-gray-900 dark:text-white max-w-[150px] truncate">
                        {Array.isArray(value) ? value.join(', ') : String(value) || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activity.details.remark && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon icon="solar:chat-round-line-duotone" className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Remark:</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{activity.details.remark}</p>
              </div>
            )}
          </div>
        );

      case 'transferred':
        return (
          <div className="text-sm space-y-2">
            {/* Lead Name Information */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="solar:user-line-duotone" className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Lead Transferred</span>
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                <div className="font-medium">
                  {activity.details.leadName || 
                   activity.details.name ||
                   (activity.details.oldData?.customData?.["First Name"] && activity.details.oldData?.customData?.["Last Name"] 
                     ? `${activity.details.oldData.customData["First Name"]} ${activity.details.oldData.customData["Last Name"]}`.trim()
                     : activity.details.oldData?.customData?.["First Name"]) ||
                   (activity.details.newData?.customData?.["First Name"] && activity.details.newData?.customData?.["Last Name"]
                     ? `${activity.details.newData.customData["First Name"]} ${activity.details.newData.customData["Last Name"]}`.trim()
                     : activity.details.newData?.customData?.["First Name"]) ||
                   'Unknown Lead'}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Lead ID: {activity.lead?._id?.slice(-8) || 'N/A'}
                </div>
              </div>
            </div>

            {/* Project Information */}
            {(() => {
              const oldProjectId = activity.details.oldProjectId || 
                                 activity.details.oldProject?._id || 
                                 activity.details.oldData?.project ||
                                 activity.details.oldProject;
              
              const newProjectId = activity.details.newProjectId || 
                                 activity.details.newProject?._id || 
                                 activity.details.newData?.project ||
                                 activity.details.newProject;
              
              const oldProjectName = activity.details.oldProject?.name || 
                (oldProjectId && projects.find(p => p._id === oldProjectId)?.name) ||
                'N/A';
              
              const newProjectName = activity.details.newProject?.name || 
                (newProjectId && projects.find(p => p._id === newProjectId)?.name) ||
                'N/A';
              
              if (oldProjectName === 'N/A' && newProjectName === 'N/A') {
                return (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Project information not available in this transfer record
                  </div>
                );
              }
              
              return (
                <>
                  <div><strong>Old Project:</strong> {oldProjectName}</div>
                  <div><strong>New Project:</strong> {newProjectName}</div>
                </>
              );
            })()}

            {/* Transfer User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:user-line-duotone" className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Transferred By</span>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <div className="font-medium">{activity.user?.name || 'Unknown User'}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">{activity.user?.email || 'N/A'}</div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:user-plus-line-duotone" className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Transferred To</span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {(() => {
                    const transferredToUserId = activity.details.toUser || activity.details.transferredTo;
                    const transferredToUser = users.find(u => u._id === transferredToUserId);
                    
                    if (transferredToUser) {
                      return (
                        <>
                          <div className="font-medium">{transferredToUser.name || 'Unknown User'}</div>
                          <div className="text-xs text-green-600 dark:text-green-400">{transferredToUser.email || 'N/A'}</div>
                        </>
                      );
                    }
                    
                    return (
                      <div className="text-gray-500 dark:text-gray-400">
                        {transferredToUserId ? (
                          <>
                            <div className="font-medium text-gray-700 dark:text-gray-300 text-lg">
                              {transferredToUserId}
                            </div>
                            <div className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                              User ID (Name not available)
                            </div>
                          </>
                        ) : (
                          <div>User information not available</div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {activity.details.reason && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon icon="solar:chat-round-line-duotone" className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Reason</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{activity.details.reason}</p>
              </div>
            )}

            {activity.details.notes && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon icon="solar:document-text-line-duotone" className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details.notes}</p>
              </div>
            )}
          </div>
        );

      case 'updated':
        return (
          <div className="space-y-4">
            {/* Old Data Card */}
            {activity.details.oldData && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="solar:arrow-left-line-duotone" className="text-red-600 dark:text-red-400" />
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">Previous Data</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><strong>Name:</strong> {activity.details.oldData.customData?.["First Name"] || ''} {activity.details.oldData.customData?.["Last Name"] || ''}</div>
                  <div><strong>Email:</strong> {activity.details.oldData.customData?.["Email"] || 'N/A'}</div>
                  <div><strong>Phone:</strong> {activity.details.oldData.customData?.["Phone"] || 'N/A'}</div>
                  <div><strong>Company:</strong> {activity.details.oldData.customData?.["Company"] || 'N/A'}</div>
                  <div><strong>Priority:</strong> {activity.details.oldData.customData?.["Lead Priority"] || 'N/A'}</div>
                  <div><strong>Property Type:</strong> {activity.details.oldData.customData?.["Property Type"] || 'N/A'}</div>
                  <div><strong>Configuration:</strong> {activity.details.oldData.customData?.["Configuration"] || 'N/A'}</div>
                  <div><strong>Funding Mode:</strong> {activity.details.oldData.customData?.["Funding Mode"] || 'N/A'}</div>
                  <div><strong>Gender:</strong> {activity.details.oldData.customData?.["Gender"] || 'N/A'}</div>
                  <div><strong>Budget:</strong> {activity.details.oldData.customData?.["Budget"] || 'N/A'}</div>
                  {activity.details.oldData.currentStatus && (
                    <div><strong>Status:</strong> {activity.details.oldData.currentStatus.name || 'N/A'}</div>
                  )}
                </div>
              </div>
            )}

            {/* New Data Card */}
            {activity.details.newData && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="solar:arrow-right-line-duotone" className="text-green-600 dark:text-green-400" />
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-200">Updated Data</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><strong>Name:</strong> {activity.details.newData.customData?.["First Name"] || ''}</div>
                  <div><strong>Phone:</strong> {activity.details.newData.customData?.["Phone"] || ''}</div>
                  <div><strong>Company:</strong> {activity.details.newData.customData?.["Company"] || 'N/A'}</div>
                  <div><strong>Priority:</strong> {activity.details.newData.customData?.["Lead Priority"] || ''}</div>
                  <div><strong>Property Type:</strong> {activity.details.newData.customData?.["Property Type"] || ''}</div>
                  <div><strong>Configuration:</strong> {activity.details.newData.customData?.["Configuration"] || ''}</div>
                  <div><strong>Funding Mode:</strong> {activity.details.newData.customData?.["Funding Mode"] || ''}</div>
                  <div><strong>Gender:</strong> {activity.details.newData.customData?.["Gender"] || ''}</div>
                  <div><strong>Budget:</strong> {activity.details.newData.customData?.["Budget"] || ''}</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'created':
        return 'New lead created with initial data';

      default:
        return JSON.stringify(activity.details);
    }
  };

  return (
    <Card>
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3">
          <Icon icon="solar:clock-circle-line-duotone" className="text-purple-600 dark:text-purple-400 text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Activity Timeline</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track all changes and activities for this lead</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="solar:info-circle-line-duotone" className="mx-auto text-3xl text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No Activities Found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Activities will appear here as they are recorded
            </p>
          </div>
        ) : (
          <div className="relative">
            {activities.map((activity, index) => (
              <div key={activity._id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                )}

                {/* Timeline dot */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  getActionColor(activity.action) === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                  getActionColor(activity.action) === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  getActionColor(activity.action) === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20' :
                  getActionColor(activity.action) === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                  'bg-gray-100 dark:bg-gray-900/20'
                }`}>
                  <Icon
                    icon={getActionIcon(activity.action)}
                    className={`text-sm ${
                      getActionColor(activity.action) === 'green' ? 'text-green-600 dark:text-green-400' :
                      getActionColor(activity.action) === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      getActionColor(activity.action) === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      getActionColor(activity.action) === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatActionText(activity)}
                    </span>
                    <Badge
                      color={
                        getActionColor(activity.action) === 'green' ? 'green' :
                        getActionColor(activity.action) === 'blue' ? 'blue' :
                        getActionColor(activity.action) === 'orange' ? 'orange' :
                        getActionColor(activity.action) === 'purple' ? 'purple' :
                        'gray'
                      }
                      size="sm"
                    >
                      {activity.action}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {formatDetails(activity)}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:clock-circle-line-duotone" className="w-3 h-3" />
                      <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:time-line-duotone" className="w-3 h-3" />
                      <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityTimeline;







