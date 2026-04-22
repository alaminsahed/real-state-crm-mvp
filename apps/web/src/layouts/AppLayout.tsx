import {
  ApartmentOutlined,
  BellOutlined,
  DashboardOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Layout, Menu } from "antd";
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

const { Header, Sider, Content } = Layout;

const items = [
  {
    key: "/dashboard",
    label: <Link to="/dashboard">Dashboard</Link>,
    icon: <DashboardOutlined />,
  },
  {
    key: "/leads",
    label: <Link to="/leads">Leads</Link>,
    icon: <UserOutlined />,
  },
  {
    key: "/customers",
    label: <Link to="/customers">Customers</Link>,
    icon: <TeamOutlined />,
  },
  {
    key: "/properties",
    label: <Link to="/properties">Properties</Link>,
    icon: <ApartmentOutlined />,
  },
  {
    key: "/tasks",
    label: <Link to="/tasks">Tasks</Link>,
    icon: <UnorderedListOutlined />,
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const selectedKey = useMemo(() => {
    const exact = items.find((item) => location.pathname.startsWith(item.key));
    return exact?.key ?? "/dashboard";
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Layout className="crm-app-shell min-h-screen bg-slate-50">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={260}
        className="crm-app-sider shadow-xl"
        style={{
          background:
            "linear-gradient(180deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
        }}
      >
        <div className="px-5 py-6">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-cyan-200">
              Demo Edition
            </p>
            <p className="m-0 mt-1 text-lg font-semibold text-white">
              Real Estate CRM
            </p>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          className="bg-transparent px-2"
        />
      </Sider>
      <Layout>
        <Header className="crm-app-header border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
          <div className="flex h-full items-center justify-between gap-4">
            <div></div>
            <div className="flex items-center gap-3">
              <Badge dot>
                <Button shape="circle" icon={<BellOutlined />} />
              </Badge>
              <div className="hidden text-right md:block">
                <p className="m-0 text-xs uppercase tracking-wider text-slate-400">
                  Signed in
                </p>
                <p className="m-0 text-sm font-medium text-slate-700">
                  {session?.user.email ?? "agent@demo.com"}
                </p>
              </div>
              <Avatar className="bg-blue-600">
                {(session?.user.email ?? "D").charAt(0).toUpperCase()}
              </Avatar>
              <Button
                className="crm-logout-btn"
                onClick={() => void handleLogout()}
              >
                Log out
              </Button>
            </div>
          </div>
        </Header>
        <Content className="crm-app-content p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </Content>
        <div className="crm-app-footer px-8 pb-6 text-center text-xs text-slate-400">
          Built for high-impact product demo screens
        </div>
      </Layout>
    </Layout>
  );
}
