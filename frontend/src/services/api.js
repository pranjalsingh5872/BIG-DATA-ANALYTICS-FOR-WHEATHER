import axios from 'axios';

// Automatically use direct backend URL during Vite dev (port 5173) or live Render backend in production
const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5173' ? 'http://127.0.0.1:8000/api/v1' : 'https://weather-backend-onve.onrender.com/api/v1');

export const api = {
  // Summary & KPIs
  getSummary: async () => {
    const res = await axios.get(`${API_BASE}/analytics/summary`);
    return res.data;
  },

  // Chart analytics
  getCharts: async () => {
    const res = await axios.get(`${API_BASE}/analytics/charts`);
    return res.data;
  },

  // Events list & filter
  getEvents: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/events/`, { params });
    return res.data;
  },

  // Event detail with explainable TrustScore and H3 hex polygon
  getEventDetail: async (id) => {
    const res = await axios.get(`${API_BASE}/events/${id}`);
    return res.data;
  },

  // H3 Clusters for national tactical map
  getH3Clusters: async () => {
    const res = await axios.get(`${API_BASE}/events/clusters/h3`);
    return res.data;
  },

  // Citizen report submission
  submitCitizenReport: async (data) => {
    const res = await axios.post(`${API_BASE}/ingest/citizen`, data);
    return res.data;
  },

  // 100% Real Live Meteorological Telemetry Sync
  syncLiveTelemetry: async (wipeOld = false) => {
    const res = await axios.post(`${API_BASE}/ingest/sync-live-telemetry?wipe_old=${wipeOld}`);
    return res.data;
  },

  // Twitter/X Live Weather Stream Sync (#IMD, #WeatherUpdate)
  syncTwitterFeed: async () => {
    const res = await axios.post(`${API_BASE}/ingest/sync-twitter`);
    return res.data;
  },

  // Geolocation & Reverse Geocoding
  reverseGeocode: async (lat, lon) => {
    const res = await axios.get(`${API_BASE}/events/geo/reverse`, { params: { lat, lon } });
    return res.data;
  },

  detectLocationByIp: async () => {
    const res = await axios.get(`${API_BASE}/events/geo/detect-ip`);
    return res.data;
  },

  // Operator review queue
  getReviewQueue: async () => {
    const res = await axios.get(`${API_BASE}/review/queue`);
    return res.data;
  },

  seedPendingReview: async () => {
    const res = await axios.post(`${API_BASE}/review/seed-pending`);
    return res.data;
  },

  // Operator decision (Verify / Reject / Escalate)
  submitOperatorDecision: async (eventId, decision, reason, notes) => {
    const res = await axios.post(`${API_BASE}/review/${eventId}`, {
      decision,
      reason,
      operator_name: 'Lead Disaster Operator',
      notes
    });
    return res.data;
  },

  // Grievances
  getGrievances: async (status = 'All') => {
    const res = await axios.get(`${API_BASE}/grievances/`, { params: { status } });
    return res.data;
  },

  submitGrievance: async (data) => {
    const res = await axios.post(`${API_BASE}/grievances/`, data);
    return res.data;
  },

  resolveGrievance: async (id, resolutionNote, status = 'RESOLVED') => {
    const res = await axios.put(`${API_BASE}/grievances/${id}/resolve`, {
      resolution_note: resolutionNote,
      status,
      operator_name: 'Grievance Review Board'
    });
    return res.data;
  },

  appealGrievance: async (id, appealNote) => {
    const res = await axios.post(`${API_BASE}/grievances/${id}/appeal`, {
      appeal_note: appealNote
    });
    return res.data;
  },

  // CAP Emergency Alert Broadcast
  broadcastCapAlert: async (data) => {
    const res = await axios.post(`${API_BASE}/alerts/broadcast-cap`, data);
    return res.data;
  },

  getAlertHistory: async () => {
    const res = await axios.get(`${API_BASE}/alerts/history`);
    return res.data;
  },

  // AI Weather & Cyclone Disaster Prediction
  getCycloneForecast: async () => {
    const res = await axios.get(`${API_BASE}/forecast/cyclone-monsoon`);
    return res.data;
  },

  // PDF Incident Brief URL
  getPdfDownloadUrl: (eventId) => {
    return `${API_BASE}/export/pdf/${eventId}`;
  }
};

