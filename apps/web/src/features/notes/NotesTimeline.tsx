import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Timeline } from 'antd';
import { api } from '../../lib/api';
import type { EntityType } from '../../lib/types';

export function NotesTimeline({ entityType, entityId }: { entityType: EntityType; entityId: string }) {
  const [form] = Form.useForm<{ content: string }>();
  const queryClient = useQueryClient();

  const notes = useQuery({
    queryKey: ['notes', entityType, entityId],
    queryFn: () => api.notes.list(entityType, entityId),
    enabled: Boolean(entityId),
  });

  const createNote = useMutation({
    mutationFn: (content: string) => api.notes.create({ content, entityType, entityId }),
    onSuccess: () => {
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['notes', entityType, entityId] });
    },
  });

  return (
    <Card title="Notes" className="mt-6">
      <Form
        form={form}
        layout="inline"
        onFinish={(values) => createNote.mutate(values.content)}
        className="mb-4"
      >
        <Form.Item name="content" rules={[{ required: true, message: 'Enter note' }]} className="w-full">
          <Input.TextArea rows={2} placeholder="Add note" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={createNote.isPending}>
            Add Note
          </Button>
        </Form.Item>
      </Form>

      <Timeline
        items={(notes.data ?? []).map((note) => ({
          children: `${new Date(note.createdAt).toLocaleString()} - ${note.content}`,
        }))}
      />
    </Card>
  );
}
