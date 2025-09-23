import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { API_BASE_URL } from '@/lib/config';
import { LeadStatus, LeadSource, Project, User, ChannelPartner, CPSourcing } from '../types';

export const useLeadData = () => {
  const { token } = useAuth();
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [channelPartners, setChannelPartners] = useState<ChannelPartner[]>([]);
  const [cpSourcingOptions, setCPSourcingOptions] = useState<CPSourcing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeadData = async () => {
    if (!token) return;

    try {
      setIsLoading(true);

      const [statusesResponse, sourcesResponse, projectsResponse, channelPartnersResponse, cpSourcingResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/lead-statuses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/lead-sources`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/channel-partner`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/cp-sourcing/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (statusesResponse.ok) {
        const statusesData = await statusesResponse.json();
        setLeadStatuses(statusesData.leadStatuses || statusesData || []);
      }

      if (sourcesResponse.ok) {
        const sourcesData = await sourcesResponse.json();
        setLeadSources(sourcesData.leadSources || sourcesData || []);
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        const projectsArray = projectsData.projects || projectsData || [];
        setProjects(projectsArray);

        // Derive users from projects
        const allUsers = new Map<string, User>();
        projectsArray.forEach((project: Project) => {
          if (project.owner) {
            allUsers.set(project.owner._id, project.owner);
          }
          if (project.members && Array.isArray(project.members)) {
            project.members.forEach((member) => {
              allUsers.set(member._id, member);
            });
          }
          if (project.managers && Array.isArray(project.managers)) {
            project.managers.forEach((manager) => {
              allUsers.set(manager._id, manager);
            });
          }
        });
        setUsers(Array.from(allUsers.values()));
      }

      if (channelPartnersResponse.ok) {
        const channelPartnersData = await channelPartnersResponse.json();
        setChannelPartners(channelPartnersData.channelPartners || channelPartnersData || []);
      }

      if (cpSourcingResponse.ok) {
        const cpSourcingData = await cpSourcingResponse.json();
        setCPSourcingOptions(cpSourcingData.cpSourcing || cpSourcingData || []);
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [token]);

  return {
    leadStatuses,
    leadSources,
    projects,
    users,
    channelPartners,
    cpSourcingOptions,
    isLoading
  };
};
