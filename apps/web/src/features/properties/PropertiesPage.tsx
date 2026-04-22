import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EnvironmentOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Space, Table, Tag, Typography } from 'antd';
import { api } from '../../lib/api';

export function PropertiesPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const properties = useQuery({ queryKey: ['properties'], queryFn: api.properties.list });

  const createProperty = useMutation({
    mutationFn: api.properties.create,
    onSuccess: () => {
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return (
    <Space direction="vertical" className="w-full" size="large">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600 px-6 py-7 text-white">
            <Tag color="cyan" className="mb-3 border-0 px-3 py-1 text-xs font-semibold">
              Featured Inventory
            </Tag>
            <h2 className="m-0 text-2xl font-semibold">Create premium listings in seconds.</h2>
            <p className="mb-0 mt-3 max-w-xl text-blue-100">
              Use this showcase-ready module to onboard inventory and present your portfolio with a polished,
              investor-friendly vibe.
            </p>
            <div className="mt-6 flex items-center gap-2 text-blue-50">
              <HomeOutlined />
              <span>{properties.data?.length ?? 0} properties in catalog</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <Typography.Title level={5} className="!mb-4 !mt-0">
              Add New Property
            </Typography.Title>
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
              <Button
                type="primary"
                htmlType="submit"
                loading={createProperty.isPending}
                icon={<PlusOutlined />}
                className="w-full"
              >
                Create Listing
              </Button>
            </Form>
          </div>
        </div>
      </Card>

      <Card
        title="Property Catalog"
        extra={<Tag color="blue">{properties.data?.length ?? 0} items</Tag>}
        className="rounded-2xl border border-slate-100 shadow-sm"
      >
        <Table
          rowKey="id"
          loading={properties.isLoading}
          dataSource={properties.data ?? []}
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
    </Space>
  );
}
