'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Badge,
  Table,
  TextInput,
  Label,
  Spinner,
  Alert,
} from 'flowbite-react';
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconLogin,
  IconLogout,
  IconSearch,
} from '@tabler/icons-react';
import { getMyAttendanceHistory } from '@/app/api/attendance/attendanceService';
import type { Attendance, Pagination } from '@/app/(DashboardLayout)/types/attendance';
import {
  formatHours,
  getStatusColor,
  getStatusText,
  formatDateForAPI,
} from '@/utils/attendanceUtils';

const MyAttendanceHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState('');
  
  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Set default date range (last 30 days) and fetch initial data
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setStartDate(formatDateForAPI(thirtyDaysAgo));
    setEndDate(formatDateForAPI(today));
    
    // Initial fetch with default dates
    fetchHistoryWithDates(formatDateForAPI(thirtyDaysAgo), formatDateForAPI(today), 1);
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (currentPage > 1 && startDate && endDate) {
      fetchHistory();
    }
  }, [currentPage]);

  // Fetch attendance history with specific dates
  const fetchHistoryWithDates = async (start: string, end: string, page: number) => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyAttendanceHistory({
        startDate: start || undefined,
        endDate: end || undefined,
        page: page,
        limit: 30,
      });
      setAttendance(response.attendance);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance history with current state
  const fetchHistory = async () => {
    await fetchHistoryWithDates(startDate, endDate, currentPage);
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchHistory();
  };

  // Handle quick date ranges
  const setQuickDateRange = (days: number) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    
    setStartDate(formatDateForAPI(pastDate));
    setEndDate(formatDateForAPI(today));
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance History</h1>
        <p className="text-gray-600 dark:text-gray-400">View your attendance records and work hours</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters Card */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Date */}
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <TextInput
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              icon={() => <IconCalendar size={20} />}
            />
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <TextInput
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              icon={() => <IconCalendar size={20} />}
            />
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <Button onClick={handleApplyFilters} className="w-full">
              <IconSearch className="mr-2" size={16} />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Quick Date Ranges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button size="xs" color="light" onClick={() => setQuickDateRange(7)}>
            Last 7 Days
          </Button>
          <Button size="xs" color="light" onClick={() => setQuickDateRange(30)}>
            Last 30 Days
          </Button>
          <Button size="xs" color="light" onClick={() => setQuickDateRange(90)}>
            Last 90 Days
          </Button>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="xl" />
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No attendance records found for the selected period
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Check-In</Table.HeadCell>
                  <Table.HeadCell>Check-Out</Table.HeadCell>
                  <Table.HeadCell>Total Hours</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {attendance.map((record) => (
                    <React.Fragment key={record._id}>
                      <Table.Row className="bg-white dark:bg-gray-800">
                        <Table.Cell className="font-medium">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Table.Cell>
                        <Table.Cell>
                          {record.checkInTime || record.checkIn?.time ? (
                            <div className="flex items-center space-x-2">
                              <IconLogin size={16} className="text-green-600" />
                              <span>
                                {new Date(record.checkInTime || record.checkIn!.time).toLocaleTimeString(
                                  'en-US',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {record.checkOutTime || record.checkOut?.time ? (
                            <div className="flex items-center space-x-2">
                              <IconLogout size={16} className="text-red-600" />
                              <span>
                                {new Date(
                                  record.checkOutTime || record.checkOut!.time
                                ).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </Table.Cell>
                        <Table.Cell className="font-semibold">
                          {formatHours(record.totalHours)}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color={getStatusColor(record.status)}>
                            {getStatusText(record.status)}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="xs"
                            color="light"
                            onClick={() => toggleRowExpansion(record._id)}
                          >
                            {expandedRow === record._id ? 'Hide' : 'Details'}
                          </Button>
                        </Table.Cell>
                      </Table.Row>

                      {/* Expanded Row */}
                      {expandedRow === record._id && (
                        <Table.Row>
                          <Table.Cell colSpan={6} className="bg-gray-50 dark:bg-gray-900">
                            <div className="p-4 space-y-4">
                              {/* Locations */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Check-In Location */}
                                {(record.checkInLocation || record.checkIn?.location) && (
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <IconLogin size={18} className="mr-2 text-green-600" />
                                      Check-In Location
                                    </h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      <IconMapPin size={16} className="inline mr-1" />
                                      {(record.checkInLocation || record.checkIn?.location)?.address}
                                    </div>
                                    {record.checkIn?.notes && (
                                      <div className="text-sm text-gray-500 mt-1">
                                        Note: {record.checkIn.notes}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Check-Out Location */}
                                {(record.checkOutLocation || record.checkOut?.location) && (
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <IconLogout size={18} className="mr-2 text-red-600" />
                                      Check-Out Location
                                    </h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      <IconMapPin size={16} className="inline mr-1" />
                                      {(record.checkOutLocation || record.checkOut?.location)?.address}
                                    </div>
                                    {record.checkOut?.notes && (
                                      <div className="text-sm text-gray-500 mt-1">
                                        Note: {record.checkOut.notes}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Work Locations */}
                              {record.workLocations && record.workLocations.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center">
                                    <IconMapPin size={18} className="mr-2 text-purple-600" />
                                    Work Locations ({record.workLocations.length})
                                  </h4>
                                  <div className="space-y-2">
                                    {record.workLocations.map((location, index) => (
                                      <div
                                        key={index}
                                        className="text-sm bg-white dark:bg-gray-800 p-2 rounded"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="font-medium">{location.activity}</div>
                                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                              <IconMapPin size={14} className="inline mr-1" />
                                              {location.location.address}
                                            </div>
                                            {location.notes && (
                                              <div className="text-gray-500 text-xs mt-1">{location.notes}</div>
                                            )}
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            {new Date(location.time).toLocaleTimeString('en-US', {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Manual Entry Info */}
                              {record.isManualEntry && (
                                <Alert color="info">
                                  <div className="text-sm">
                                    This is a manual entry created by{' '}
                                    <span className="font-semibold">
                                      {typeof record.manualEntryBy === 'object' ? record.manualEntryBy.name : record.manualEntryBy || 'Unknown'}
                                    </span>
                                    {record.manualEntryReason && (
                                      <>
                                        <br />
                                        Reason: {record.manualEntryReason}
                                      </>
                                    )}
                                  </div>
                                </Alert>
                              )}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </React.Fragment>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
                  records
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    color="light"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-3">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <Button
                    size="sm"
                    color="light"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default MyAttendanceHistoryPage;

