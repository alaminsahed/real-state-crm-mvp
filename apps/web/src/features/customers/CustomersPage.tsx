import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Collapse, Form, Input, Modal, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { api } from '../../lib/api';
import type { Customer } from '../../lib/types';
import { NotesTimeline } from '../notes/NotesTimeline';

export function CustomersPage() {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const customers = useQuery({ queryKey: ['customers'], queryFn: api.customers.list });

  const createCustomer = useMutation({
    mutationFn: api.customers.create,
    onSuccess: () => {
      form.resetFields();
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const filteredCustomers = useMemo(() => {
    const normalizedName = nameFilter.trim().toLowerCase();
    const normalizedEmail = emailFilter.trim().toLowerCase();
    const normalizedPhone = phoneFilter.trim().toLowerCase();

    return (customers.data ?? []).filter((customer) => {
      const matchesName = (customer.fullName ?? '').toLowerCase().includes(normalizedName);
      const matchesEmail = (customer.email ?? '').toLowerCase().includes(normalizedEmail);
      const matchesPhone = (customer.phone ?? '').toLowerCase().includes(normalizedPhone);

      return matchesName && matchesEmail && matchesPhone;
    });
  }, [customers.data, emailFilter, nameFilter, phoneFilter]);

  return (
    <Space direction="vertical" className="w-full" size="large">
      <div className="flex justify-end">
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Add Customer
        </Button>
      </div>
      <Collapse
        className="crm-leads-filters"
        defaultActiveKey={['filters']}
        items={[
          {
            key: 'filters',
            label: 'Filters',
            children: (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Input
                  placeholder="Filter by name"
                  value={nameFilter}
                  onChange={(event) => setNameFilter(event.target.value)}
                />
                <Input
                  placeholder="Filter by email"
                  value={emailFilter}
                  onChange={(event) => setEmailFilter(event.target.value)}
                />
                <Input
                  placeholder="Filter by phone"
                  value={phoneFilter}
                  onChange={(event) => setPhoneFilter(event.target.value)}
                />
                <Button
                  onClick={() => {
                    setNameFilter('');
                    setEmailFilter('');
                    setPhoneFilter('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Card title="Customers" className="crm-leads-card">
        <Table
          className="crm-leads-table"
          rowKey="id"
          loading={customers.isLoading}
          dataSource={filteredCustomers}
          columns={[
            {
              title: 'Name',
              dataIndex: 'fullName',
              render: (_value, row) => (
                <Button type="link" onClick={() => setSelected(row)}>
                  {row.fullName}
                </Button>
              ),
            },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Phone', dataIndex: 'phone' },
          ]}
        />
      </Card>

      {selected && (
        <Card title="Customer Profile">
          <p>
            <strong>Name:</strong> {selected.fullName}
          </p>
          <p>
            <strong>Email:</strong> {selected.email ?? '-'}
          </p>
          <p>
            <strong>Phone:</strong> {selected.phone ?? '-'}
          </p>
          <NotesTimeline entityType="customer" entityId={selected.id} />
        </Card>
      )}

      <Modal
        title="Create Customer"
        open={isCreateModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsCreateModalOpen(false);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={(values) => createCustomer.mutate(values)}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={createCustomer.isPending}>
            Create
          </Button>
        </Form>
      </Modal>
    </Space>
  );
}
