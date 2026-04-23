import { useQuery } from '@tanstack/react-query';
import { Alert, Card, DatePicker, Space, Table, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../../lib/api';
import type { LeadSourceReportItem } from '../../lib/types';

const { RangePicker } = DatePicker;
const chartPalette = ['#2563eb', '#06b6d4', '#8b5cf6', '#14b8a6', '#f59e0b', '#6366f1'];
const mockLeadSourceData: LeadSourceReportItem[] = [
  { source: 'facebook', count: 40 },
  { source: 'website', count: 15 },
  { source: 'manual', count: 10 },
  { source: 'referral', count: 8 },
];

export function ReportsPage() {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const startDate = dateRange?.[0]?.format('YYYY-MM-DD');
  const endDate = dateRange?.[1]?.format('YYYY-MM-DD');

  const leadSourceQuery = useQuery({
    queryKey: ['reports', 'lead-sources', startDate, endDate],
    queryFn: () =>
      api.reports.leadSources({
        start_date: startDate,
        end_date: endDate,
      }),
  });

  const leadSourceData = useMemo(
    () =>
      leadSourceQuery.data && leadSourceQuery.data.length > 0
        ? leadSourceQuery.data
        : mockLeadSourceData,
    [leadSourceQuery.data],
  );

  const usingMockData = !leadSourceQuery.isLoading && leadSourceData === mockLeadSourceData;

  const chartData = useMemo(
    () =>
      leadSourceData.map((item) => ({
        source: item.source,
        leads: item.count,
      })),
    [leadSourceData],
  );

  const totalLeads = useMemo(
    () => leadSourceData.reduce((sum, item) => sum + item.count, 0),
    [leadSourceData],
  );
  const topSource = leadSourceData[0]?.source ?? 'n/a';
  const avgPerSource = leadSourceData.length
    ? Math.round(totalLeads / leadSourceData.length)
    : 0;

  return (
    <Space direction="vertical" className="w-full" size="large">
      <div>
        <Typography.Title level={2} className="!mb-2">
          Reports & Analytics
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 text-slate-500">
          Fast, practical insights for lead source and sales tracking.
        </Typography.Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border border-slate-100 shadow-sm">
          <Typography.Text type="secondary">Total Leads</Typography.Text>
          <Typography.Title level={3} className="!mb-0 !mt-1">
            {totalLeads}
          </Typography.Title>
        </Card>
        <Card className="rounded-2xl border border-slate-100 shadow-sm">
          <Typography.Text type="secondary">Top Source</Typography.Text>
          <Typography.Title level={3} className="!mb-0 !mt-1 capitalize">
            {topSource}
          </Typography.Title>
        </Card>
        <Card className="rounded-2xl border border-slate-100 shadow-sm">
          <Typography.Text type="secondary">Avg / Source</Typography.Text>
          <Typography.Title level={3} className="!mb-0 !mt-1">
            {avgPerSource}
          </Typography.Title>
        </Card>
      </div>

      <Card
        title="Lead Source Performance"
        className="rounded-2xl border border-slate-100 shadow-sm"
        extra={
          <RangePicker
            allowClear
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
          />
        }
      >
        {usingMockData ? (
          <Alert
            className="mb-4"
            type="info"
            showIcon
            message="Showing demo data until live report data is available."
          />
        ) : null}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="source" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                }}
              />
              <Legend />
              <Bar dataKey="leads" name="Leads" radius={[10, 10, 0, 0]} barSize={44}>
                {chartData.map((entry) => (
                  <Cell
                    key={`source-${entry.source}`}
                    fill={chartPalette[Math.abs(entry.source.length) % chartPalette.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Lead Source Breakdown" className="rounded-2xl border border-slate-100 shadow-sm">
        <Table
          rowKey="source"
          loading={leadSourceQuery.isLoading}
          dataSource={leadSourceData}
          pagination={false}
          columns={[
            {
              title: 'Source',
              dataIndex: 'source',
              render: (value: string) => value || 'unknown',
            },
            {
              title: 'Total Leads',
              dataIndex: 'count',
              sorter: (a, b) => a.count - b.count,
              defaultSortOrder: 'descend',
            },
          ]}
        />
      </Card>
    </Space>
  );
}
