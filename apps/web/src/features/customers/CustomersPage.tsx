import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Input, List, Space, Typography } from 'antd';
import { useState } from 'react';
import { api } from '../../lib/api';
import type { Customer } from '../../lib/types';
import { NotesTimeline } from '../notes/NotesTimeline';

export function CustomersPage() {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const customers = useQuery({ queryKey: ['customers'], queryFn: api.customers.list });

  const createCustomer = useMutation({
    mutationFn: api.customers.create,
    onSuccess: () => {
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return (
    <Space direction="vertical" className="w-full" size="large">
      <Card title="Create Customer">
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
          <button className="ant-btn ant-btn-primary" type="submit">
            Create
          </button>
        </Form>
      </Card>

      <Card title="Customers">
        <List
          bordered
          dataSource={customers.data ?? []}
          renderItem={(item) => (
            <List.Item onClick={() => setSelected(item)} className="cursor-pointer">
              <Space direction="vertical" size={0}>
                <Typography.Text strong>{item.fullName}</Typography.Text>
                <Typography.Text type="secondary">{item.email ?? 'No email'}</Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {selected && (
        <Card title="Customer Profile">
          <p><strong>Name:</strong> {selected.fullName}</p>
          <p><strong>Email:</strong> {selected.email ?? '-'}</p>
          <p><strong>Phone:</strong> {selected.phone ?? '-'}</p>
          <NotesTimeline entityType="customer" entityId={selected.id} />
        </Card>
      )}
    </Space>
  );
}
