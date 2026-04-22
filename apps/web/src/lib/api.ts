import type { Customer, Lead, Note, Property, Task } from './types';
import { getValidAccessToken } from './supabaseAuth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getValidAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  leads: {
    list: () => request<Lead[]>('/leads'),
    get: (id: string) => request<Lead>(`/leads/${id}`),
    create: (body: Partial<Lead> & { fullName: string }) =>
      request<Lead>('/leads', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Lead>) =>
      request<Lead>(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    convert: (id: string) =>
      request<Customer>(`/leads/${id}/convert`, { method: 'POST' }),
  },
  customers: {
    list: () => request<Customer[]>('/customers'),
    create: (body: Partial<Customer> & { fullName: string }) =>
      request<Customer>('/customers', { method: 'POST', body: JSON.stringify(body) }),
  },
  properties: {
    list: () => request<Property[]>('/properties'),
    create: (body: Partial<Property> & { title: string; address: string }) =>
      request<Property>('/properties', { method: 'POST', body: JSON.stringify(body) }),
  },
  tasks: {
    list: () => request<Task[]>('/tasks'),
    create: (body: Partial<Task> & { title: string }) =>
      request<Task>('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Task>) =>
      request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  },
  notes: {
    list: (entityType: string, entityId: string) =>
      request<Note[]>(`/notes?entity_type=${entityType}&entity_id=${entityId}`),
    create: (body: { content: string; entityType: string; entityId: string }) =>
      request<Note>('/notes', { method: 'POST', body: JSON.stringify(body) }),
  },
};
