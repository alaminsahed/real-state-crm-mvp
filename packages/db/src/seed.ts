import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import {
  type InferInsertModel,
  customers,
  getDb,
  leads,
  notes,
  properties,
  tasks,
  users,
} from './index';

const devUserId = '11111111-1111-1111-1111-111111111111';
const devAuthUserId =
  process.env.SEED_AUTH_USER_ID ?? 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

const demoUsers = [
  {
    id: devUserId,
    authUserId: devAuthUserId,
    email: 'dev@demo.crm',
    fullName: 'dev',
  },
] satisfies Array<InferInsertModel<typeof users> & { id: string; authUserId: string }>;

const demoLeads = [
  {
    id: '33333333-3333-3333-3333-333333333331',
    fullName: 'Farhan Rahman',
    email: 'farhan.rahman@mail.com',
    phone: '+8801711111111',
    source: 'Facebook Ads',
    status: 'new',
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
  {
    id: '33333333-3333-3333-3333-333333333332',
    fullName: 'Nusrat Jahan',
    email: 'nusrat.jahan@mail.com',
    phone: '+8801722222222',
    source: 'Website Form',
    status: 'qualified',
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    fullName: 'Mehedi Hasan',
    email: 'mehedi.hasan@mail.com',
    phone: '+8801733333333',
    source: 'Referral',
    status: 'contacted',
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    fullName: 'Rima Sultana',
    email: 'rima.sultana@mail.com',
    phone: '+8801744444444',
    source: 'WhatsApp',
    status: 'won',
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
] satisfies Array<InferInsertModel<typeof leads> & { id: string }>;

const demoCustomers = [
  {
    id: '44444444-4444-4444-4444-444444444441',
    fullName: 'Rima Sultana',
    email: 'rima.sultana@mail.com',
    phone: '+8801744444444',
    leadId: demoLeads[3].id,
    ownerUserId: devUserId,
  },
  {
    id: '44444444-4444-4444-4444-444444444442',
    fullName: 'Tanvir Alam',
    email: 'tanvir.alam@mail.com',
    phone: '+8801755555555',
    leadId: null,
    ownerUserId: devUserId,
  },
] satisfies Array<InferInsertModel<typeof customers> & { id: string }>;

const demoProperties = [
  {
    id: '55555555-5555-5555-5555-555555555551',
    title: '3 Bed Apartment in Bashundhara',
    address: 'Block C, Bashundhara R/A, Dhaka',
    price: 12500000,
    description: 'Ready flat, south-facing, near gate.',
    ownerUserId: devUserId,
  },
  {
    id: '55555555-5555-5555-5555-555555555552',
    title: 'Lake View Duplex in Dhanmondi',
    address: 'Road 8A, Dhanmondi, Dhaka',
    price: 32000000,
    description: 'Premium duplex with terrace and lake view.',
    ownerUserId: devUserId,
  },
  {
    id: '55555555-5555-5555-5555-555555555553',
    title: 'Commercial Office Space in Gulshan',
    address: 'Gulshan Avenue, Dhaka',
    price: 48000000,
    description: 'High footfall area suitable for corporate office.',
    ownerUserId: devUserId,
  },
] satisfies Array<InferInsertModel<typeof properties> & { id: string }>;

const demoTasks = [
  {
    id: '66666666-6666-6666-6666-666666666661',
    title: 'Follow up with Farhan',
    description: 'Call after 6 PM to discuss financing options.',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'todo',
    done: false,
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
  {
    id: '66666666-6666-6666-6666-666666666662',
    title: 'Send property shortlist to Nusrat',
    description: 'Include Bashundhara and Dhanmondi options.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    done: false,
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
  {
    id: '66666666-6666-6666-6666-666666666663',
    title: 'Collect legal docs for Rima deal',
    description: 'Coordinate with legal team and seller.',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'done',
    done: true,
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
  {
    id: '66666666-6666-6666-6666-666666666664',
    title: 'Schedule site visit for Mehedi',
    description: 'Weekend visit for Gulshan commercial listing.',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'todo',
    done: false,
    assignedUserId: devUserId,
    createdByUserId: devUserId,
  },
] satisfies Array<InferInsertModel<typeof tasks> & { id: string }>;

const demoNotes = [
  {
    id: '77777777-7777-7777-7777-777777777771',
    content: 'Interested in apartments with flexible payment plan.',
    entityType: 'lead',
    entityId: demoLeads[0].id,
    createdByUserId: devUserId,
  },
  {
    id: '77777777-7777-7777-7777-777777777772',
    content: 'Customer wants handover within 3 months.',
    entityType: 'customer',
    entityId: demoCustomers[0].id,
    createdByUserId: devUserId,
  },
  {
    id: '77777777-7777-7777-7777-777777777773',
    content: 'Price is slightly negotiable if closed this month.',
    entityType: 'property',
    entityId: demoProperties[1].id,
    createdByUserId: devUserId,
  },
  {
    id: '77777777-7777-7777-7777-777777777774',
    content: 'Task done, waiting for signed documents.',
    entityType: 'task',
    entityId: demoTasks[2].id,
    createdByUserId: devUserId,
  },
] satisfies Array<InferInsertModel<typeof notes> & { id: string }>;

async function seed() {
  const db = getDb();

  await db.transaction(async (tx) => {
    await tx.delete(notes).where(inArray(notes.id, demoNotes.map((item) => item.id)));
    await tx.delete(tasks).where(inArray(tasks.id, demoTasks.map((item) => item.id)));
    await tx
      .delete(customers)
      .where(inArray(customers.id, demoCustomers.map((item) => item.id)));
    await tx
      .delete(properties)
      .where(inArray(properties.id, demoProperties.map((item) => item.id)));
    await tx.delete(leads).where(inArray(leads.id, demoLeads.map((item) => item.id)));
    await tx.delete(users).where(inArray(users.id, demoUsers.map((item) => item.id)));

    await tx.insert(users).values(demoUsers);
    await tx.insert(leads).values(demoLeads);
    await tx.insert(customers).values(demoCustomers);
    await tx.insert(properties).values(demoProperties);
    await tx.insert(tasks).values(demoTasks);
    await tx.insert(notes).values(demoNotes);
  });

  console.log('Seed completed.');
  console.log(
    `Users: ${demoUsers.length}, Leads: ${demoLeads.length}, Customers: ${demoCustomers.length}, Properties: ${demoProperties.length}, Tasks: ${demoTasks.length}, Notes: ${demoNotes.length}`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
