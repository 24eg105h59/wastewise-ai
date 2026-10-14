import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminSidebar } from './components/AdminSidebar';
import { StaffSidebar } from './components/StaffSidebar';

import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import StaffExpiring from './pages/StaffExpiring';
import Scanner from './pages/Scanner';
import Inventory from './pages/Inventory';
import RiskCenter from './pages/RiskCenter';
import ExpiryMonitor from './pages/ExpiryMonitor';
import WasteManagement from './pages/WasteManagement';
import GuardAI from './pages/GuardAI';
import Analytics from './pages/Analytics';
import AdminTasks from './pages/AdminTasks';
import StaffTasks from './pages/StaffTasks';
import AdminGuardAI from './pages/AdminGuardAI';
import StaffGuardAI from './pages/StaffGuardAI';
import AdminStorage from './pages/AdminStorage';
import StaffReportIssue from './pages/StaffReportIssue';
import AdminStaff from './pages/AdminStaff';
import Profile from './pages/Profile';
import { ChefHat, Utensils } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-800">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        <header className="h-12 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 font-bold">
              <ChefHat className="w-3.5 h-3.5 text-amber-600" />
              HD Bakers & Kitchen
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline">Executive Kitchen Command & Zero-Waste Protocol</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kitchen Online • HACCP Safe
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-[#f8f9fa]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const StaffLayout = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-800">
      <StaffSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        <header className="h-12 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-900 border border-orange-200/80 font-bold">
              <Utensils className="w-3.5 h-3.5 text-orange-600" />
              Prep Station & Line
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline">HD Bakers Brigade Duty</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Station Active
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-[#f8f9fa]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/scanner" element={<Scanner />} />
              <Route path="/admin/inventory" element={<Inventory />} />
              <Route path="/admin/expiry" element={<ExpiryMonitor />} />
              <Route path="/admin/risk" element={<RiskCenter />} />
              <Route path="/admin/storage" element={<AdminStorage />} />
              <Route path="/admin/waste" element={<WasteManagement />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/assistant" element={<AdminGuardAI />} />
              <Route path="/admin/tasks" element={<AdminTasks />} />
              <Route path="/admin/alerts" element={<AdminDashboard />} /> {/* Placeholder */}
              <Route path="/admin/staff" element={<AdminStaff />} />
              <Route path="/admin/reports" element={<AdminDashboard />} /> {/* Placeholder */}
              <Route path="/admin/settings" element={<AdminDashboard />} /> {/* Placeholder */}
              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Staff Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
            <Route element={<StaffLayout />}>
              <Route path="/staff/home" element={<StaffDashboard />} />
              <Route path="/staff/scanner" element={<Scanner />} />
              <Route path="/staff/inventory" element={<Inventory />} />
              <Route path="/staff/expiring" element={<StaffExpiring />} />
              <Route path="/staff/tasks" element={<StaffTasks />} />
              <Route path="/staff/report" element={<StaffReportIssue />} />
              <Route path="/staff/assistant" element={<StaffGuardAI />} />
              <Route path="/staff/notifications" element={<StaffDashboard />} /> {/* Placeholder */}
              <Route path="/staff/profile" element={<Profile />} />
              <Route path="/staff/*" element={<Navigate to="/staff/home" replace />} />
            </Route>
          </Route>
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
