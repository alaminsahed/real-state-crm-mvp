import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Descriptions, Select, Space } from 'antd';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { NotesTimeline } from '../notes/NotesTimeline';

export function LeadDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();

  const lead = useQuery({
    queryKey: ['lead', id],
    queryFn: () => api.leads.get(id),
    enabled: Boolean(id),
  });

  const updateLead = useMutation({
    mutationFn: (status: string) => api.leads.update(id, { status: status as never }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const convertLead = useMutation({
    mutationFn: () => api.leads.convert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const row = lead.data;
  const whatsappUrl = row?.phone
    ? `https://wa.me/${row.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${row.fullName}, let's discuss your property needs.`)}`
    : undefined;

  return (
    <Space direction="vertical" className="w-full" size="large">
      <Card title="Lead Details" loading={lead.isLoading}>
        {row && (
          <>
            <Descriptions column={1}>
              <Descriptions.Item label="Name">{row.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{row.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{row.phone}</Descriptions.Item>
              <Descriptions.Item label="Source">{row.source}</Descriptions.Item>
            </Descriptions>

            <Space>
              <Select
                value={row.status}
                onChange={(status) => updateLead.mutate(status)}
                options={[
                  { value: 'new' },
                  { value: 'contacted' },
                  { value: 'qualified' },
                  { value: 'won' },
                  { value: 'lost' },
                ]}
                style={{ width: 160 }}
              />
              <Button type="primary" onClick={() => convertLead.mutate()} loading={convertLead.isPending}>
                Convert to Customer
              </Button>
              {whatsappUrl && (
                <Button href={whatsappUrl} target="_blank" rel="noreferrer">
                  Open WhatsApp
                </Button>
              )}
            </Space>
          </>
        )}
      </Card>

      {id && <NotesTimeline entityType="lead" entityId={id} />}
    </Space>
  );
}
