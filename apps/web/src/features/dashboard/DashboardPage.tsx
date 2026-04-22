import {
  ArrowUpOutlined,
  HomeOutlined,
  RiseOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Statistic, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function DashboardPage() {
  const leads = useQuery({ queryKey: ['leads'], queryFn: api.leads.list });
  const customers = useQuery({ queryKey: ['customers'], queryFn: api.customers.list });
  const tasks = useQuery({ queryKey: ['tasks'], queryFn: api.tasks.list });
  const properties = useQuery({ queryKey: ['properties'], queryFn: api.properties.list });

  const totalLeads = leads.data?.length ?? 0;
  const totalCustomers = customers.data?.length ?? 0;
  const totalTasks = tasks.data?.length ?? 0;
  const totalProperties = properties.data?.length ?? 0;
  const doneTasks = tasks.data?.filter((task) => task.done).length ?? 0;
  const conversionRate = totalLeads > 0 ? Math.round((totalCustomers / totalLeads) * 100) : 0;
  const avgPropertyPrice = totalProperties > 0
    ? Math.round(
      (properties.data?.reduce((sum, property) => sum + (property.price ?? 0), 0) ?? 0) / totalProperties,
    )
    : 0;

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card
        className="overflow-hidden border-0"
        bodyStyle={{
          background:
            'linear-gradient(120deg, rgba(14,116,144,1) 0%, rgba(30,64,175,1) 45%, rgba(15,23,42,1) 100%)',
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={16}>
            <Tag color="cyan" className="mb-3 border-0 px-3 py-1 text-xs font-semibold">
              Premium Demo Experience
            </Tag>
            <h1 className="m-0 text-3xl font-semibold leading-tight text-white">
              Showcase your modern real estate pipeline in one cinematic view.
            </h1>
            <p className="mb-0 mt-3 max-w-2xl text-base text-blue-100">
              Beautiful analytics, active inventory, and sales momentum indicators designed to impress
              clients and investors during product demos.
            </p>
          </Col>
          <Col xs={24} lg={8}>
            <Card className="border-0 bg-white/10 backdrop-blur-sm" bodyStyle={{ padding: 18 }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-slate-100">Monthly Growth</span>
                <ArrowUpOutlined className="text-emerald-300" />
              </div>
              <p className="m-0 text-3xl font-semibold text-white">+18.4%</p>
              <p className="m-0 mt-2 text-xs text-blue-100">Compared to previous month</p>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <Statistic
              title="Active Leads"
              value={totalLeads}
              loading={leads.isLoading}
              prefix={<UsergroupAddOutlined className="text-cyan-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <Statistic
              title="Customers Won"
              value={totalCustomers}
              loading={customers.isLoading}
              prefix={<TeamOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <Statistic
              title="Live Properties"
              value={totalProperties}
              loading={properties.isLoading}
              prefix={<HomeOutlined className="text-violet-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <Statistic
              title="Open Tasks"
              value={totalTasks}
              loading={tasks.isLoading}
              prefix={<ScheduleOutlined className="text-amber-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Pipeline Health" className="rounded-2xl border border-slate-100 shadow-sm">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Lead to customer conversion</span>
                  <span className="font-semibold text-slate-700">{conversionRate}%</span>
                </div>
                <Progress percent={conversionRate} strokeColor="#2563eb" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Task completion rate</span>
                  <span className="font-semibold text-slate-700">
                    {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
                  </span>
                </div>
                <Progress
                  percent={totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}
                  strokeColor="#16a34a"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Portfolio Snapshot" className="rounded-2xl border border-slate-100 shadow-sm">
            <Space direction="vertical" size="middle" className="w-full">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="m-0 text-xs uppercase tracking-wider text-slate-400">Average property value</p>
                <p className="m-0 mt-1 text-xl font-semibold text-slate-800">
                  ${avgPropertyPrice.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="m-0 text-xs uppercase tracking-wider text-slate-400">Engagement trend</p>
                <p className="m-0 mt-1 flex items-center gap-2 text-xl font-semibold text-slate-800">
                  Strong <RiseOutlined className="text-emerald-500" />
                </p>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
