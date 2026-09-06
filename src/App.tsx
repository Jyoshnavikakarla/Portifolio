import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminRegister } from '@/pages/admin/AdminRegister';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProjects } from '@/pages/admin/AdminProjects';
import { AdminCertificates } from '@/pages/admin/AdminCertificates';
import { AdminAchievements } from '@/pages/admin/AdminAchievements';
import { AdminSocial } from '@/pages/admin/AdminSocial';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminMessages } from '@/pages/admin/AdminMessages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/dashboard/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
          <Route path="/admin/dashboard/certificates" element={<AdminLayout><AdminCertificates /></AdminLayout>} />
          <Route path="/admin/dashboard/achievements" element={<AdminLayout><AdminAchievements /></AdminLayout>} />
          <Route path="/admin/dashboard/social" element={<AdminLayout><AdminSocial /></AdminLayout>} />
          <Route path="/admin/dashboard/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="/admin/dashboard/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
