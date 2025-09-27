"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Label, TextInput, Alert, Select } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";

interface Project { _id: string; name: string; description?: string }

interface ChannelPartnerData {
  name: string;
  phone: string;
  firmName: string;
  location: string;
  address: string;
  mahareraNo?: string;
  pinCode: string;
  photo?: string;
}

interface LocalLocation { lat: number; lng: number }

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ChannelPartner {
  _id: string;
  name: string;
  phone: string;
}

interface Project {
  _id: string;
  name: string;
  location: string;
}

interface SourcingHistoryItem {
  _id: string;
  date: string;
  selfie: string;
  location: LocalLocation;
  notes: string;
}

interface CPSourcingRecord {
  _id: string;
  userId: User;
  channelPartnerId: ChannelPartner;
  projectId: Project;
  sourcingHistory: SourcingHistoryItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const EditCPSourcingPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { token, projectAccess } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [record, setRecord] = useState<CPSourcingRecord | null>(null);

  const [formData, setFormData] = useState<{
    projectId: string;
    channelPartnerData: ChannelPartnerData;
  }>({
    projectId: "",
    channelPartnerData: { name: "", phone: "", firmName: "", location: "", address: "", mahareraNo: "", pinCode: "", photo: "" },
  });

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      try {
        setIsLoading(true);
        console.log('[CP Edit] useEffect start', { hasToken: !!token, id });
        // Fetch projects
        console.log('[CP Edit] GET projects', API_ENDPOINTS.PROJECTS);
        const pResp = await fetch(API_ENDPOINTS.PROJECTS, { headers: { Authorization: `Bearer ${token}` } });
        console.log('[CP Edit] GET projects status', pResp.status);
        if (pResp.ok) {
          const pData = await pResp.json();
          setProjects(pData.projects || pData || []);
        } else {
          const txt = await pResp.text().catch(() => '');
          console.error('[CP Edit] GET projects failed', { status: pResp.status, body: txt });
        }
        // Fetch CP sourcing record
        console.log('[CP Edit] GET CP by id', API_ENDPOINTS.CP_SOURCING_BY_ID(id));
        const rResp = await fetch(API_ENDPOINTS.CP_SOURCING_BY_ID(id), { headers: { Authorization: `Bearer ${token}` } });
        console.log('[CP Edit] GET CP by id status', rResp.status);
        if (!rResp.ok) {
          const txt = await rResp.text().catch(() => '');
          console.error('[CP Edit] GET CP by id failed', { status: rResp.status, body: txt });
          throw new Error(`Failed to load CP sourcing (${rResp.status})`);
        }
        const recData = await rResp.json();
        console.log('[CP Edit] Raw API response:', recData);
        
        // Handle the actual API response structure
        let rec: CPSourcingRecord | null = null;
        if (recData.cpSourcings && Array.isArray(recData.cpSourcings)) {
          rec = recData.cpSourcings.find((item: CPSourcingRecord) => item._id === id);
        } else if (recData._id) {
          rec = recData;
        }
        
        console.log('[CP Edit] Found record:', rec);
        setRecord(rec);
        
        if (rec) {
          console.log('[CP Edit] Loaded record', {
            _id: rec._id,
            projectId: rec.projectId._id,
            cpName: rec.channelPartnerId.name,
            cpPhone: rec.channelPartnerId.phone,
            cpId: rec.channelPartnerId._id,
          });
          
          // Fetch full channel partner details
          console.log('[CP Edit] Fetching full channel partner details', API_ENDPOINTS.CHANNEL_PARTNER_BY_ID(rec.channelPartnerId._id));
          const cpResp = await fetch(API_ENDPOINTS.CHANNEL_PARTNER_BY_ID(rec.channelPartnerId._id), { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          
          let fullChannelPartnerData = null;
          if (cpResp.ok) {
            const cpData = await cpResp.json();
            fullChannelPartnerData = cpData.channelPartner || cpData;
            console.log('[CP Edit] Full channel partner data:', fullChannelPartnerData);
          } else {
            console.warn('[CP Edit] Failed to fetch full channel partner details:', cpResp.status);
          }
          
          // Get the latest sourcing history for location
          const latestHistory = rec.sourcingHistory && rec.sourcingHistory.length > 0 
            ? rec.sourcingHistory[rec.sourcingHistory.length - 1] 
            : null;
          
          setFormData({
            projectId: rec.projectId._id || "",
            channelPartnerData: {
              name: rec.channelPartnerId.name || "",
              phone: rec.channelPartnerId.phone || "",
              firmName: fullChannelPartnerData?.firmName || "",
              location: fullChannelPartnerData?.location || (latestHistory?.location ? `${latestHistory.location.lat}, ${latestHistory.location.lng}` : ""),
              address: fullChannelPartnerData?.address || "",
              mahareraNo: fullChannelPartnerData?.mahareraNo || "",
              pinCode: fullChannelPartnerData?.pinCode || "",
              photo: fullChannelPartnerData?.photo || latestHistory?.selfie || "",
            }
          });
        }
      } catch (e: any) {
        console.error('[CP Edit] useEffect error', e);
        setError(e?.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
        console.log('[CP Edit] useEffect end');
      }
    })();
  }, [token, id]);

  const selectableProjects = React.useMemo(() => {
    if (!projects) return [] as Project[];
    if (projectAccess?.canAccessAll) return projects;
    const assigned = projectAccess?.assignedProjects || [];
    const allowed = projectAccess?.allowedProjects || [];
    if (assigned.length > 0) return projects.filter(p => assigned.some((ap: any) => ap.id === p._id));
    return projects.filter(p => allowed.includes(p._id));
  }, [projects, projectAccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('channelPartnerData.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, channelPartnerData: { ...prev.channelPartnerData, [field]: value } } as any));
    } else {
      setFormData(prev => ({ ...prev, [name]: value } as any));
    }
    if (error) setError(null);
    if (status.type !== 'idle') setStatus({ type: 'idle' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;
    try {
      setIsSubmitting(true);
      setStatus({ type: 'idle' });
      const submit = new FormData();
      submit.append('projectId', formData.projectId);
      submit.append('channelPartnerData[name]', formData.channelPartnerData.name.trim());
      submit.append('channelPartnerData[phone]', formData.channelPartnerData.phone.trim());
      submit.append('channelPartnerData[firmName]', formData.channelPartnerData.firmName.trim());
      submit.append('channelPartnerData[location]', formData.channelPartnerData.location.trim());
      submit.append('channelPartnerData[address]', formData.channelPartnerData.address.trim());
      submit.append('channelPartnerData[mahareraNo]', (formData.channelPartnerData.mahareraNo || '').trim());
      submit.append('channelPartnerData[pinCode]', formData.channelPartnerData.pinCode.trim());
      console.log('[CP Edit] PUT submit URL', API_ENDPOINTS.UPDATE_CP_SOURCING(id));
      const resp = await fetch(API_ENDPOINTS.UPDATE_CP_SOURCING(id), { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: submit });
      console.log('[CP Edit] PUT submit status', resp.status);
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        console.error('[CP Edit] PUT failed', { status: resp.status, body });
        throw new Error(body?.message || `Update failed (${resp.status})`);
      }
      console.log('[CP Edit] PUT success');
      setStatus({ type: 'success', message: 'CP sourcing updated successfully!' });
      setTimeout(() => router.push('/apps/cp-sourcing'), 1200);
    } catch (err: any) {
      console.error('[CP Edit] handleSubmit error', err);
      setStatus({ type: 'error', message: err?.message || 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CP sourcing...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6">
        <Card className="max-w-3xl mx-auto">
          <div className="text-center py-10">
            <Icon icon="lucide:alert-triangle" className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900">Record Not Found</h2>
            <p className="text-sm text-gray-600 mt-1">The requested CP sourcing record could not be found.</p>
            <div className="mt-6">
              <Button color="gray" onClick={() => router.push('/apps/cp-sourcing')}>Back to CP Sourcing</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button color="gray" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit CP Sourcing</h1>
          <p className="text-gray-600">Update the sourcing record details</p>
        </div>
      </div>

      <Card className="max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {status.type === 'success' && (
            <Alert color="success" className="mb-4">
              <Icon icon="lucide:check-circle" className="w-4 h-4" />
              <span className="ml-2">{status.message}</span>
            </Alert>
          )}
          {status.type === 'error' && (
            <Alert color="failure" className="mb-4">
              <Icon icon="lucide:alert-circle" className="w-4 h-4" />
              <span className="ml-2">{status.message}</span>
            </Alert>
          )}

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Channel Partner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="channelPartnerData.name" value="Partner Name *" />
                <TextInput id="channelPartnerData.name" name="channelPartnerData.name" type="text" placeholder="Enter partner name" value={formData.channelPartnerData.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.phone" value="Phone Number *" />
                <TextInput id="channelPartnerData.phone" name="channelPartnerData.phone" type="tel" placeholder="Enter 10-digit phone number" value={formData.channelPartnerData.phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.firmName" value="Firm Name *" />
                <TextInput id="channelPartnerData.firmName" name="channelPartnerData.firmName" type="text" placeholder="Enter firm/company name" value={formData.channelPartnerData.firmName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.location" value="Location *" />
                <TextInput id="channelPartnerData.location" name="channelPartnerData.location" type="text" placeholder="Enter city/location" value={formData.channelPartnerData.location} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="channelPartnerData.address" value="Address *" />
                <TextInput id="channelPartnerData.address" name="channelPartnerData.address" type="text" placeholder="Enter complete address" value={formData.channelPartnerData.address} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.mahareraNo" value="MAHARERA Number (Optional)" />
                <TextInput id="channelPartnerData.mahareraNo" name="channelPartnerData.mahareraNo" type="text" placeholder="Enter MAHARERA registration number" value={formData.channelPartnerData.mahareraNo} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.pinCode" value="PIN Code *" />
                <TextInput id="channelPartnerData.pinCode" name="channelPartnerData.pinCode" type="text" placeholder="Enter 6-digit PIN code" value={formData.channelPartnerData.pinCode} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Project & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="projectId" value="Project *" />
                <Select id="projectId" name="projectId" value={formData.projectId} onChange={handleChange}>
                  <option value="">Select a project</option>
                  {selectableProjects.map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
                </Select>
              </div>
              <div>
                <Label value="Location (readonly)" />
                <div className="text-sm text-gray-600 mt-2">
                  {record?.sourcingHistory && record.sourcingHistory.length > 0 ? (
                    <span>
                      {record.sourcingHistory[record.sourcingHistory.length - 1].location.lat.toFixed(4)}, 
                      {record.sourcingHistory[record.sourcingHistory.length - 1].location.lng.toFixed(4)}
                    </span>
                  ) : (
                    <span>Not available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label value="Record ID" />
                <div className="text-sm text-gray-600 mt-2">{record?._id}</div>
              </div>
              <div>
                <Label value="Created By" />
                <div className="text-sm text-gray-600 mt-2">{record?.userId?.name} ({record?.userId?.email})</div>
              </div>
              <div>
                <Label value="Status" />
                <div className="text-sm text-gray-600 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${record?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {record?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div>
                <Label value="Created Date" />
                <div className="text-sm text-gray-600 mt-2">
                  {record?.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Not available'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" color="gray" onClick={() => router.push('/apps/cp-sourcing')} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" color="orange" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Updating...</>) : (<><Icon icon="lucide:save" className="w-4 h-4" />Update</>)}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditCPSourcingPage;


