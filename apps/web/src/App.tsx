import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { RequireAuth } from './features/auth/RequireAuth';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { CustomersPage } from './features/customers/CustomersPage';
import { LeadDetailPage } from './features/leads/LeadDetailPage';
import { LeadsPage } from './features/leads/LeadsPage';
import { IntegrationsPage } from './features/integrations/IntegrationsPage';
import { PropertiesPage } from './features/properties/PropertiesPage';
import { TasksPage } from './features/tasks/TasksPage';
import { AppLayout } from './layouts/AppLayout';

function AppShell() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={(
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        )}
      />
    </Routes>
  );
}

export default App;
