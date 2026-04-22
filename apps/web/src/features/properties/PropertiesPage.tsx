import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EnvironmentOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Form, Input, InputNumber, Modal, Space, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { api } from '../../lib/api';

export function PropertiesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [titleFilter, setTitleFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const properties = useQuery({ queryKey: ['properties'], queryFn: api.properties.list });

  const createProperty = useMutation({
    mutationFn: api.properties.create,
    onSuccess: () => {
      form.resetFields();
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const filteredProperties = useMemo(() => {
    const normalizedTitle = titleFilter.trim().toLowerCase();
    const normalizedAddress = addressFilter.trim().toLowerCase();

    return (properties.data ?? []).filter((property) => {
      const matchesTitle = (property.title ?? '').toLowerCase().includes(normalizedTitle);
      const matchesAddress = (property.address ?? '').toLowerCase().includes(normalizedAddress);
      const matchesMinPrice = minPriceFilter == null ? true : (property.price ?? 0) >= minPriceFilter;

      return matchesTitle && matchesAddress && matchesMinPrice;
    });
  }, [addressFilter, minPriceFilter, properties.data, titleFilter]);

  return (
    <Space direction="vertical" className="w-full" size="large">
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => setIsCreateModalOpen(true)}
          icon={<PlusOutlined />}
        >
          Add Property
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
                  placeholder="Filter by title"
                  value={titleFilter}
                  onChange={(event) => setTitleFilter(event.target.value)}
                />
                <Input
                  placeholder="Filter by address"
                  value={addressFilter}
                  onChange={(event) => setAddressFilter(event.target.value)}
                />
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Minimum price"
                  value={minPriceFilter}
                  onChange={(value) => setMinPriceFilter(value)}
                />
                <Button
                  onClick={() => {
                    setTitleFilter('');
                    setAddressFilter('');
                    setMinPriceFilter(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Card
        title="Property Catalog"
        extra={<Tag color="blue">{properties.data?.length ?? 0} items</Tag>}
        className="crm-leads-card rounded-2xl border border-slate-100 shadow-sm"
      >
        <Table
          className="crm-leads-table"
          rowKey="id"
          loading={properties.isLoading}
          dataSource={filteredProperties}
          pagination={{ pageSize: 6 }}
          columns={[
            {
              title: 'Listing',
              dataIndex: 'title',
              render: (value) => (
                <Space size={8}>
                  <HomeOutlined className="text-blue-500" />
                  <span className="font-medium text-slate-700">{value}</span>
                </Space>
              ),
            },
            {
              title: 'Address',
              dataIndex: 'address',
              render: (value) => (
                <Space size={8}>
                  <EnvironmentOutlined className="text-slate-400" />
                  <span className="text-slate-600">{value}</span>
                </Space>
              ),
            },
            {
              title: 'Price',
              dataIndex: 'price',
              render: (value) => (
                <Tag color="geekblue" className="rounded-full px-3 py-1">
                  ${(value ?? 0).toLocaleString()}
                </Tag>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Create Property"
        open={isCreateModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsCreateModalOpen(false);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={(values) => createProperty.mutate(values)}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input placeholder="Modern waterfront villa" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Address is required' }]}
          >
            <Input placeholder="Downtown district, New York" />
          </Form.Item>
          <Form.Item name="price" label="Price (USD)">
            <InputNumber className="w-full" min={0} placeholder="1200000" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Short highlight for demo listing..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={createProperty.isPending} icon={<PlusOutlined />}>
            Create Listing
          </Button>
        </Form>
      </Modal>
    </Space>
  );
}
