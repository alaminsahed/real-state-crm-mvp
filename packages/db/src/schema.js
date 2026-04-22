"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRelations = exports.propertyRelations = exports.customerRelations = exports.leadRelations = exports.userRelations = exports.notes = exports.tasks = exports.properties = exports.customers = exports.leads = exports.users = exports.entityTypeEnum = exports.taskStatusEnum = exports.leadStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.leadStatusEnum = (0, pg_core_1.pgEnum)('lead_status', [
    'new',
    'contacted',
    'qualified',
    'won',
    'lost',
]);
exports.taskStatusEnum = (0, pg_core_1.pgEnum)('task_status', [
    'todo',
    'in_progress',
    'done',
]);
exports.entityTypeEnum = (0, pg_core_1.pgEnum)('entity_type', [
    'lead',
    'customer',
    'property',
    'task',
]);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    authUserId: (0, pg_core_1.uuid)('auth_user_id').notNull().unique(),
    email: (0, pg_core_1.text)('email').notNull(),
    fullName: (0, pg_core_1.text)('full_name'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.leads = (0, pg_core_1.pgTable)('leads', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    email: (0, pg_core_1.text)('email'),
    phone: (0, pg_core_1.text)('phone'),
    source: (0, pg_core_1.text)('source'),
    status: (0, exports.leadStatusEnum)('status').notNull().default('new'),
    assignedUserId: (0, pg_core_1.uuid)('assigned_user_id').references(() => exports.users.id),
    createdByUserId: (0, pg_core_1.uuid)('created_by_user_id').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.customers = (0, pg_core_1.pgTable)('customers', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    email: (0, pg_core_1.text)('email'),
    phone: (0, pg_core_1.text)('phone'),
    leadId: (0, pg_core_1.uuid)('lead_id').references(() => exports.leads.id),
    ownerUserId: (0, pg_core_1.uuid)('owner_user_id').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.properties = (0, pg_core_1.pgTable)('properties', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    title: (0, pg_core_1.text)('title').notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    price: (0, pg_core_1.integer)('price'),
    description: (0, pg_core_1.text)('description'),
    ownerUserId: (0, pg_core_1.uuid)('owner_user_id').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description'),
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }),
    status: (0, exports.taskStatusEnum)('status').notNull().default('todo'),
    done: (0, pg_core_1.boolean)('done').notNull().default(false),
    assignedUserId: (0, pg_core_1.uuid)('assigned_user_id').references(() => exports.users.id),
    createdByUserId: (0, pg_core_1.uuid)('created_by_user_id').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.notes = (0, pg_core_1.pgTable)('notes', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    content: (0, pg_core_1.text)('content').notNull(),
    entityType: (0, exports.entityTypeEnum)('entity_type').notNull(),
    entityId: (0, pg_core_1.uuid)('entity_id').notNull(),
    createdByUserId: (0, pg_core_1.uuid)('created_by_user_id').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    leads: many(exports.leads),
    customers: many(exports.customers),
    properties: many(exports.properties),
    createdTasks: many(exports.tasks),
    notes: many(exports.notes),
}));
exports.leadRelations = (0, drizzle_orm_1.relations)(exports.leads, ({ one, many }) => ({
    assignedUser: one(exports.users, {
        fields: [exports.leads.assignedUserId],
        references: [exports.users.id],
    }),
    createdByUser: one(exports.users, {
        fields: [exports.leads.createdByUserId],
        references: [exports.users.id],
    }),
    customers: many(exports.customers),
}));
exports.customerRelations = (0, drizzle_orm_1.relations)(exports.customers, ({ one }) => ({
    lead: one(exports.leads, {
        fields: [exports.customers.leadId],
        references: [exports.leads.id],
    }),
    owner: one(exports.users, {
        fields: [exports.customers.ownerUserId],
        references: [exports.users.id],
    }),
}));
exports.propertyRelations = (0, drizzle_orm_1.relations)(exports.properties, ({ one }) => ({
    owner: one(exports.users, {
        fields: [exports.properties.ownerUserId],
        references: [exports.users.id],
    }),
}));
exports.taskRelations = (0, drizzle_orm_1.relations)(exports.tasks, ({ one }) => ({
    assignedUser: one(exports.users, {
        fields: [exports.tasks.assignedUserId],
        references: [exports.users.id],
    }),
    createdByUser: one(exports.users, {
        fields: [exports.tasks.createdByUserId],
        references: [exports.users.id],
    }),
}));
//# sourceMappingURL=schema.js.map