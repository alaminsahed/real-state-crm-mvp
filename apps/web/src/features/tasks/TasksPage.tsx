import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Checkbox, DatePicker, Form, Input, List, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { api } from '../../lib/api';
import { NotesTimeline } from '../notes/NotesTimeline';
import { useState } from 'react';
import type { Task } from '../../lib/types';

export function TasksPage() {
  const [selected, setSelected] = useState<Task | null>(null);
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleTask = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      api.tasks.update(id, { done, status: done ? 'done' : 'todo' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return (
    <Space direction="vertical" className="w-full" size="large">
      <Card title="Create Task">
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
          <Button type="primary" htmlType="submit">Create</Button>
        </Form>
      </Card>

      <Card title="Tasks">
        <List
          bordered
          dataSource={tasks.data ?? []}
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelected(item)}
              actions={[
                <Checkbox
                  key="done"
                  checked={item.done}
                  onChange={(event) => {
                    event.stopPropagation();
                    toggleTask.mutate({ id: item.id, done: event.target.checked });
                  }}
                >
                  Done
                </Checkbox>,
              ]}
            >
              <Space>
                <span>{item.title}</span>
                <Tag color={item.done ? 'green' : 'blue'}>{item.status}</Tag>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {selected && <NotesTimeline entityType="task" entityId={selected.id} />}
    </Space>
  );
}
