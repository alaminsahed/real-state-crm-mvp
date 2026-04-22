import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Collapse, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export function LeadsPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletedLeadIds, setDeletedLeadIds] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const queryClient = useQueryClient();

  const leads = useQuery({ queryKey: ['leads'], queryFn: api.leads.list });

  const createLead = useMutation({
    mutationFn: api.leads.create,
    onSuccess: () => {
      form.resetFields();
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const updateLead = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.leads.update(id, { status: status as 'new' | 'contacted' | 'qualified' | 'won' | 'lost' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const editLead = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { fullName: string; email?: string; phone?: string; source?: string };
    }) => api.leads.update(id, values),
    onSuccess: () => {
      editForm.resetFields();
      setEditingLeadId(null);
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const filteredLeads = useMemo(() => {
    const normalizedName = nameFilter.trim().toLowerCase();
    const normalizedEmail = emailFilter.trim().toLowerCase();
    const normalizedPhone = phoneFilter.trim().toLowerCase();
    const normalizedSource = sourceFilter.trim().toLowerCase();

    return (leads.data ?? []).filter((lead) => {
      if (deletedLeadIds.has(lead.id)) {
        return false;
      }

      const matchesName = (lead.fullName ?? '').toLowerCase().includes(normalizedName);
      const matchesEmail = (lead.email ?? '').toLowerCase().includes(normalizedEmail);
      const matchesPhone = (lead.phone ?? '').toLowerCase().includes(normalizedPhone);
      const matchesSource =
        normalizedSource === 'all' ? true : (lead.source ?? 'other').toLowerCase() === normalizedSource;
      const matchesStatus = statusFilter === 'all' ? true : lead.status === statusFilter;

      return matchesName && matchesEmail && matchesPhone && matchesSource && matchesStatus;
    });
  }, [deletedLeadIds, emailFilter, leads.data, nameFilter, phoneFilter, sourceFilter, statusFilter]);

  const sourceOptions = useMemo(() => {
    const dynamicSources = new Set((leads.data ?? []).map((lead) => (lead.source ?? 'other').toLowerCase()));
    const baseSources = ['facebook', 'web', 'instagram', 'whatsapp', 'referral', 'other'];
    return ['all', ...baseSources.filter((source) => !dynamicSources.has(source)), ...Array.from(dynamicSources)];
  }, [leads.data]);

  const leadSourceSelectOptions = [
    { label: 'facebook', value: 'facebook' },
    { label: 'web', value: 'web' },
    { label: 'instagram', value: 'instagram' },
    { label: 'whatsapp', value: 'whatsapp' },
    { label: 'referral', value: 'referral' },
    { label: 'other', value: 'other' },
  ];

  return (
    <Space direction="vertical" className="w-full" size="large">
      <div className="flex justify-end gap-2">
        <Button onClick={() => navigate('/integrations')}>Config</Button>
        <Button
          type="primary"
          onClick={() => {
            form.setFieldValue('source', 'facebook');
            setIsCreateModalOpen(true);
          }}
        >
          Add Lead
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
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
                <Select
                  value={sourceFilter}
                  onChange={setSourceFilter}
                  options={sourceOptions.map((source) => ({
                    label: source === 'all' ? 'All source' : source,
                    value: source,
                  }))}
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: 'All status', value: 'all' },
                    { label: 'New', value: 'new' },
                    { label: 'Contacted', value: 'contacted' },
                    { label: 'Qualified', value: 'qualified' },
                    { label: 'Won', value: 'won' },
                    { label: 'Lost', value: 'lost' },
                  ]}
                />
                <Button
                  onClick={() => {
                    setNameFilter('');
                    setEmailFilter('');
                    setPhoneFilter('');
                    setSourceFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Card title="Leads" className="crm-leads-card">
        <Table
          className="crm-leads-table"
          rowKey="id"
          loading={leads.isLoading}
          dataSource={filteredLeads}
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
              title: 'Source',
              dataIndex: 'source',
              render: (value: string | null) => {
                const source = (value ?? 'other').toLowerCase();
                const color =
                  source === 'facebook'
                    ? 'blue'
                    : source === 'web'
                      ? 'cyan'
                      : source === 'instagram'
                        ? 'purple'
                        : source === 'whatsapp'
                          ? 'green'
                          : 'default';
                return <Tag color={color}>{source}</Tag>;
              },
            },
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
            {
              title: 'Action',
              key: 'action',
              width: 120,
              render: (_value, row) => (
                <Space size={0}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    aria-label={`Edit ${row.fullName}`}
                    onClick={() => {
                      editForm.setFieldsValue({
                        fullName: row.fullName,
                        email: row.email,
                        phone: row.phone,
                        source: (row.source ?? 'other').toLowerCase(),
                      });
                      setEditingLeadId(row.id);
                      setIsEditModalOpen(true);
                    }}
                  />
                  <Popconfirm
                    title="Delete lead?"
                    description="This removes the lead from this view."
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    onConfirm={() =>
                      setDeletedLeadIds((prev) => {
                        const next = new Set(prev);
                        next.add(row.id);
                        return next;
                      })
                    }
                  >
                    <Button danger type="text" icon={<DeleteOutlined />} aria-label={`Delete ${row.fullName}`} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Create Lead"
        open={isCreateModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsCreateModalOpen(false);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ source: 'facebook' }}
          onFinish={(values) => createLead.mutate(values)}
        >
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
            <Select options={leadSourceSelectOptions} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={createLead.isPending}>
            Create
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Edit Lead"
        open={isEditModalOpen}
        onCancel={() => {
          editForm.resetFields();
          setEditingLeadId(null);
          setIsEditModalOpen(false);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={(values) => {
            if (!editingLeadId) {
              return;
            }
            editLead.mutate({ id: editingLeadId, values });
          }}
        >
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
            <Select options={leadSourceSelectOptions} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={editLead.isPending}>
            Save
          </Button>
        </Form>
      </Modal>
    </Space>
  );
}
