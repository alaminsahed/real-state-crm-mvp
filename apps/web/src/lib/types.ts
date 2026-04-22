export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type EntityType = 'lead' | 'customer' | 'property' | 'task';

export interface Lead {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  assignedUserId: string | null;
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  leadId: string | null;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number | null;
  description: string | null;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: TaskStatus;
  done: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  entityType: EntityType;
  entityId: string;
  createdAt: string;
}
