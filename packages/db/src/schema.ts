import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'contacted',
  'qualified',
  'won',
  'lost',
]);

export const taskStatusEnum = pgEnum('task_status', [
  'todo',
  'in_progress',
  'done',
]);

export const entityTypeEnum = pgEnum('entity_type', [
  'lead',
  'customer',
  'property',
  'task',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  authUserId: uuid('auth_user_id').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  source: text('source'),
  status: leadStatusEnum('status').notNull().default('new'),
  assignedUserId: uuid('assigned_user_id').references(() => users.id),
  createdByUserId: uuid('created_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  leadId: uuid('lead_id').references(() => leads.id),
  ownerUserId: uuid('owner_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  address: text('address').notNull(),
  price: integer('price'),
  description: text('description'),
  ownerUserId: uuid('owner_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  status: taskStatusEnum('status').notNull().default('todo'),
  done: boolean('done').notNull().default(false),
  assignedUserId: uuid('assigned_user_id').references(() => users.id),
  createdByUserId: uuid('created_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  entityType: entityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  createdByUserId: uuid('created_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  customers: many(customers),
  properties: many(properties),
  createdTasks: many(tasks),
  notes: many(notes),
}));

export const leadRelations = relations(leads, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [leads.assignedUserId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [leads.createdByUserId],
    references: [users.id],
  }),
  customers: many(customers),
}));

export const customerRelations = relations(customers, ({ one }) => ({
  lead: one(leads, {
    fields: [customers.leadId],
    references: [leads.id],
  }),
  owner: one(users, {
    fields: [customers.ownerUserId],
    references: [users.id],
  }),
}));

export const propertyRelations = relations(properties, ({ one }) => ({
  owner: one(users, {
    fields: [properties.ownerUserId],
    references: [users.id],
  }),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  assignedUser: one(users, {
    fields: [tasks.assignedUserId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [tasks.createdByUserId],
    references: [users.id],
  }),
}));

export type LeadStatus = (typeof leadStatusEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type NoteEntityType = (typeof entityTypeEnum.enumValues)[number];
