import { FacebookFilled, GlobalOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';

type IntegrationConfig = {
  facebook: {
    connected: boolean;
    pageName: string;
    formName: string;
  };
  web: {
    connected: boolean;
    formUrl: string;
  };
};

const STORAGE_KEY = 'crm.integration.config';

const defaultConfig: IntegrationConfig = {
  facebook: {
    connected: false,
    pageName: '',
    formName: '',
  },
  web: {
    connected: false,
    formUrl: '',
  },
};

export function IntegrationsPage() {
  const [config, setConfig] = useState<IntegrationConfig>(defaultConfig);
  const [showFacebookConnectForm, setShowFacebookConnectForm] = useState(false);
  const [showWebConnectForm, setShowWebConnectForm] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as IntegrationConfig;
      setConfig({
        facebook: {
          connected: parsed.facebook?.connected ?? false,
          pageName: parsed.facebook?.pageName ?? '',
          formName: parsed.facebook?.formName ?? '',
        },
        web: {
          connected: parsed.web?.connected ?? false,
          formUrl: parsed.web?.formUrl ?? '',
        },
      });
    } catch {
      setConfig(defaultConfig);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  return (
    <Space direction="vertical" size="large" className="w-full">
      <div>
        <h1 className="m-0 text-2xl font-semibold text-slate-800">Lead Source Configuration</h1>
        <p className="m-0 mt-2 text-slate-500">
          Configure integrations for lead capture. Connected sources show details; disconnected sources show a
          connect action.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title={(
            <div className="flex items-center gap-2">
              <FacebookFilled className="text-blue-600" />
              <span>Facebook Leads</span>
            </div>
          )}
          extra={config.facebook.connected ? <Tag color="success">Connected</Tag> : <Tag>Disconnected</Tag>}
        >
          {config.facebook.connected ? (
            <Space direction="vertical" size="middle" className="w-full">
              <div className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="m-0 text-xs uppercase tracking-wider text-slate-400">Page</p>
                <p className="m-0 mt-1 font-medium text-slate-700">{config.facebook.pageName || 'Not set'}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="m-0 text-xs uppercase tracking-wider text-slate-400">Form</p>
                <p className="m-0 mt-1 font-medium text-slate-700">{config.facebook.formName || 'Not set'}</p>
              </div>
              <Button
                onClick={() =>
                  setConfig((previous) => ({
                    ...previous,
                    facebook: { ...previous.facebook, connected: false },
                  }))
                }
              >
                Disconnect
              </Button>
            </Space>
          ) : (
            <Space direction="vertical" size="middle" className="w-full">
              {showFacebookConnectForm ? (
                <>
                  <Input
                    placeholder="Facebook page name"
                    value={config.facebook.pageName}
                    onChange={(event) =>
                      setConfig((previous) => ({
                        ...previous,
                        facebook: { ...previous.facebook, pageName: event.target.value },
                      }))
                    }
                  />
                  <Input
                    placeholder="Facebook form name"
                    value={config.facebook.formName}
                    onChange={(event) =>
                      setConfig((previous) => ({
                        ...previous,
                        facebook: { ...previous.facebook, formName: event.target.value },
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      onClick={() => {
                        setConfig((previous) => ({
                          ...previous,
                          facebook: { ...previous.facebook, connected: true },
                        }));
                        setShowFacebookConnectForm(false);
                      }}
                    >
                      Connect Facebook
                    </Button>
                    <Button onClick={() => setShowFacebookConnectForm(false)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <Button type="primary" onClick={() => setShowFacebookConnectForm(true)}>
                  Connect Facebook
                </Button>
              )}
            </Space>
          )}
        </Card>

        <Card
          title={(
            <div className="flex items-center gap-2">
              <GlobalOutlined className="text-cyan-600" />
              <span>Website Leads</span>
            </div>
          )}
          extra={config.web.connected ? <Tag color="success">Connected</Tag> : <Tag>Disconnected</Tag>}
        >
          {config.web.connected ? (
            <Space direction="vertical" size="middle" className="w-full">
              <div className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="m-0 text-xs uppercase tracking-wider text-slate-400">Webhook / Form URL</p>
                <p className="m-0 mt-1 font-medium text-slate-700 break-all">{config.web.formUrl || 'Not set'}</p>
              </div>
              <Button
                onClick={() =>
                  setConfig((previous) => ({
                    ...previous,
                    web: { ...previous.web, connected: false },
                  }))
                }
              >
                Disconnect
              </Button>
            </Space>
          ) : (
            <Space direction="vertical" size="middle" className="w-full">
              {showWebConnectForm ? (
                <>
                  <Input
                    placeholder="Website form or webhook URL"
                    value={config.web.formUrl}
                    onChange={(event) =>
                      setConfig((previous) => ({
                        ...previous,
                        web: { ...previous.web, formUrl: event.target.value },
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      onClick={() => {
                        setConfig((previous) => ({
                          ...previous,
                          web: { ...previous.web, connected: true },
                        }));
                        setShowWebConnectForm(false);
                      }}
                    >
                      Connect Web
                    </Button>
                    <Button onClick={() => setShowWebConnectForm(false)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <Button type="primary" onClick={() => setShowWebConnectForm(true)}>
                  Connect Web
                </Button>
              )}
            </Space>
          )}
        </Card>
      </div>
    </Space>
  );
}
