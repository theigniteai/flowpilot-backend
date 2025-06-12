const BASE_URL = 'https://flowpilot-backend-z59q.onrender.com/api/leads';

export const fetchLeads = () => fetch(BASE_URL).then(res => res.json());
export const addLead = (data) =>
  fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateLead = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteLead = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });

export const getStats = () => fetch(`${BASE_URL}/stats`).then(res => res.json());
