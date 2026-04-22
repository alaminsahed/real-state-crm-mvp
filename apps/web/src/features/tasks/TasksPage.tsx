import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Checkbox, Collapse, DatePicker, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { api } from '../../lib/api';
import { NotesTimeline } from '../notes/NotesTimeline';
import { useMemo, useState } from 'react';
import type { Task } from '../../lib/types';

export function TasksPage() {
  const [selected, setSelected] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [titleFilter, setTitleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const tasks = useQuery({ queryKey: ['tasks'], queryFn: api.tasks.list });

  const createTask = useMutation({
    mutationFn: (values: { title: string; description?: string; dueDate?: dayjs.Dayjs }) =>
      api.tasks.create({
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      }),
    onSuccess: () => {
      form.resetFields();
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleTask = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      api.tasks.update(id, { done, status: done ? 'done' : 'todo' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const filteredTasks = useMemo(() => {
    const normalizedTitle = titleFilter.trim().toLowerCase();
    return (tasks.data ?? []).filter((task) => {
      const matchesTitle = (task.title ?? '').toLowerCase().includes(normalizedTitle);
      const taskStatus = task.status ?? (task.done ? 'done' : 'todo');
      const matchesStatus = statusFilter === 'all' ? true : taskStatus === statusFilter;
      return matchesTitle && matchesStatus;
    });
  }, [statusFilter, tasks.data, titleFilter]);

  return (
    <Space direction="vertical" className="w-full" size="large">
      <div className="flex justify-end">
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Add Task
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Input
                  placeholder="Filter by title"
                  value={titleFilter}
                  onChange={(event) => setTitleFilter(event.target.value)}
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: 'All status', value: 'all' },
                    { label: 'todo', value: 'todo' },
                    { label: 'done', value: 'done' },
                  ]}
                />
                <Button
                  onClick={() => {
                    setTitleFilter('');
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

      <Card title="Tasks" className="crm-leads-card">
        <Table
          className="crm-leads-table"
          rowKey="id"
          loading={tasks.isLoading}
          dataSource={filteredTasks}
          columns={[
            {
              title: 'Title',
              dataIndex: 'title',
              render: (_value, row) => (
                <Button type="link" onClick={() => setSelected(row)}>
                  {row.title}
                </Button>
              ),
            },
            { title: 'Description', dataIndex: 'description' },
            {
              title: 'Due Date',
              dataIndex: 'dueDate',
              render: (value) => (value ? dayjs(value).format('MMM D, YYYY') : '-'),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              render: (value, row) => <Tag color={row.done ? 'green' : 'blue'}>{value ?? (row.done ? 'done' : 'todo')}</Tag>,
            },
            {
              title: 'Done',
              key: 'done',
              width: 100,
              render: (_value, row) => (
                <Checkbox
                  checked={row.done}
                  onChange={(event) => toggleTask.mutate({ id: row.id, done: event.target.checked })}
                />
              ),
            },
          ]}
        />
      </Card>

      {selected && <NotesTimeline entityType="task" entityId={selected.id} />}

      <Modal
        title="Create Task"
        open={isCreateModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsCreateModalOpen(false);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={(values) => createTask.mutate(values)}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={createTask.isPending}>
            Create
          </Button>
        </Form>
      </Modal>
    </Space>
  );
}
