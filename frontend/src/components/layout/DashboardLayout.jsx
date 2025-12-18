import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  UserCog, 
  UserCheck, 
  Briefcase, 
  MessageSquare, 
  IdCard, 
  Bell, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search,
  Home,
  ClipboardList
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const adminMenuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { label: 'Residents', icon: <Users className="w-5 h-5" />, path: '/admin/residents' },
    { label: 'Employees', icon: <UserCog className="w-5 h-5" />, path: '/admin/employees' },
    { label: 'Special Employees', icon: <UserCheck className="w-5 h-5" />, path: '/admin/special-employees' },
    { label: 'Job Management', icon: <Briefcase className="w-5 h-5" />, path: '/admin/jobs' },
    { label: 'Requests & Complaints', icon: <MessageSquare className="w-5 h-5" />, path: '/admin/requests' },
    { label: 'Digital ID System', icon: <IdCard className="w-5 h-5" />, path: '/admin/digital-id' },
    { label: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/admin/notifications' },
    { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/admin/reports' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
  ];

  const employeeMenuItems = [
    { label: 'My Jobs', icon: <Briefcase className="w-5 h-5" />, path: '/employee/dashboard' },
    { label: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/employee/notifications' },
  ];

  const residentMenuItems = [
    { label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/resident/dashboard' },
    { label: 'My Requests', icon: <ClipboardList className="w-5 h-5" />, path: '/resident/requests' },
    { label: 'Digital ID', icon: <IdCard className="w-5 h-5" />, path: '/resident/digital-id' },
    { label: 'Profile', icon: <Users className="w-5 h-5" />, path: '/resident/profile' },
  ];

  const getMenuItems = () => {
    if (user?.role === 'admin') return adminMenuItems;
    if (user?.role === 'special-employee') return adminMenuItems;
    if (user?.role === 'employee') return employeeMenuItems;
    if (user?.role === 'resident') return residentMenuItems;
    return [];
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="hidden sm:block">Property Management</span>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="hidden md:block flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search residents, employees, jobs..."
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-gray-900">{user?.name}</p>
                  <p className="text-gray-500 capitalize">{user?.role?.replace('-', ' ')}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white">{user?.name.charAt(0)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className="lg:pl-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
