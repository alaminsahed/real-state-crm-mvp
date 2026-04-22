import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Select, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export function LeadsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const leads = useQuery({ queryKey: ['leads'], queryFn: api.leads.list });

  const createLead = useMutation({
    mutationFn: api.leads.create,
    onSuccess: () => {
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const updateLead = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.leads.update(id, { status: status as 'new' | 'contacted' | 'qualified' | 'won' | 'lost' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return (
    <Space direction="vertical" className="w-full" size="large">
      <Card title="Create Lead">
        <Form form={form} layout="vertical" onFinish={(values) => createLead.mutate(values)}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="source" label="Source">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={createLead.isPending}>
            Create
          </Button>
        </Form>
      </Card>

      <Card title="Leads">
        <Table
          rowKey="id"
          loading={leads.isLoading}
          dataSource={leads.data ?? []}
          columns={[
            {
              title: 'Name',
              dataIndex: 'fullName',
              render: (_value, row) => (
                <Button type="link" onClick={() => navigate(`/leads/${row.id}`)}>
                  {row.fullName}
                </Button>
              ),
            },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Phone', dataIndex: 'phone' },
            {
              title: 'Status',
              dataIndex: 'status',
              render: (value, row) => (
                <Select
                  value={value}
                  onChange={(status) => updateLead.mutate({ id: row.id, status })}
                  options={[
                    { value: 'new' },
                    { value: 'contacted' },
                    { value: 'qualified' },
                    { value: 'won' },
                    { value: 'lost' },
                  ]}
                  style={{ width: 140 }}
                />
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
