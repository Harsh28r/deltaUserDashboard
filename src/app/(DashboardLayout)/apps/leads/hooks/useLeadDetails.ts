import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { API_BASE_URL } from '@/lib/config';
import { Lead, Activity, AlertMessage } from '../types';

export const useLeadDetails = (leadId: string) => {
  const { token } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  const fetchLeadDetails = async () => {
    if (!token || !leadId) return;

    try {
      setIsLoading(true);
      setAlertMessage(null);

      const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setLead(data.lead);
        setActivities(data.activities || []);
      } else {
        setAlertMessage({
          type: 'error',
          message: `Failed to fetch lead details: ${response.status} ${response.statusText}`
        });
      }
    } catch (error) {
      console.error("Error fetching lead details:", error);
      setAlertMessage({
        type: 'error',
        message: 'Network error: Failed to fetch lead details. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [token, leadId]);

  const refreshLead = () => {
    fetchLeadDetails();
  };

  return {
    lead,
    activities,
    isLoading,
    alertMessage,
    setAlertMessage,
    refreshLead
  };
};
