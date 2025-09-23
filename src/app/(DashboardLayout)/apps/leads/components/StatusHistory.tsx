import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Lead } from '../types';

interface StatusHistoryProps {
  lead: Lead;
}

const StatusHistory: React.FC<StatusHistoryProps> = ({ lead }) => {
  return (
    <Card>
      <div className="flex items-center mb-4">
        <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg mr-3">
          <Icon icon="solar:history-line-duotone" className="text-orange-600 dark:text-orange-400 text-xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status Timeline</h3>
      </div>

      <div className="space-y-4">
        {!lead.currentStatus && (!lead.statusHistory || lead.statusHistory.length === 0) ? (
          <div className="text-center py-4">
            <Icon icon="solar:info-circle-line-duotone" className="mx-auto text-2xl text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No status information available</p>
          </div>
        ) : (
          <div className="relative">
            {/* Current Status - Show first */}
            {lead.currentStatus && (
              <div className="relative flex gap-4 pb-6">
                {/* Timeline line */}
                {lead.statusHistory && lead.statusHistory.length > 0 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                )}

                {/* Timeline dot */}
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Icon icon="solar:check-circle-line-duotone" className="text-green-600 dark:text-green-400 text-sm" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge color="green" size="sm">
                      {lead.currentStatus.name}
                    </Badge>
                    <Badge color="blue" size="sm">
                      Current
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current status of this lead
                  </p>
                </div>
              </div>
            )}

            {/* Status History - Show in reverse order (newest first) */}
            {lead.statusHistory && lead.statusHistory.length > 0 && (
              <>
                {lead.statusHistory.slice().reverse().map((historyItem, index) => (
                  <div key={historyItem._id} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {index < lead.statusHistory.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                    )}

                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Icon icon="solar:history-line-duotone" className="text-blue-600 dark:text-blue-400 text-sm" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge color="blue" size="sm">
                          {historyItem.status?.name || 'Unknown Status'}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {historyItem.changedAt ? new Date(historyItem.changedAt).toLocaleString() : 'Unknown Date'}
                        </span>
                      </div>

                      {historyItem.data && Object.keys(historyItem.data).length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {Object.entries(historyItem.data).map(([key, value]) => (
                              <div key={key} className="flex justify-between py-1">
                                <span className="font-medium">{key}:</span>
                                <span className="text-right max-w-[200px] truncate">{String(value) || 'N/A'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatusHistory;
