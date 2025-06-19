
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart3,
  Users,
  GitBranch,
  Mail,
  FileText,
  Scale,
  Settings,
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['admin', 'manager', 'commercial'] },
  { name: 'Prospects', href: '/prospects', icon: Users, roles: ['admin', 'manager', 'commercial'] },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch, roles: ['admin', 'manager', 'commercial'] },
  { name: 'Marketing', href: '/marketing', icon: Mail, roles: ['admin', 'manager'] },
  { name: 'Reporting', href: '/reporting', icon: FileText, roles: ['admin', 'manager'] },
  { name: 'Comparateur', href: '/comparateur', icon: Scale, roles: ['admin', 'manager', 'commercial'] },
];

const adminNavigation = [
  { name: 'Utilisateurs', href: '/admin/users', icon: UserCog, roles: ['admin'] },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings, roles: ['admin'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user.role)
  );

  const filteredAdminNavigation = adminNavigation.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-gray-900">Premunia CRM</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 h-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}

        {filteredAdminNavigation.length > 0 && (
          <>
            <div className={cn("pt-4 mt-4 border-t border-gray-200", collapsed && "border-none pt-2")}>
              {!collapsed && (
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Admin
                </p>
              )}
            </div>
            {filteredAdminNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3 mb-3")}>
          <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          )}
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors",
            collapsed ? "w-8 h-8 p-0" : "w-full justify-start"
          )}
          title={collapsed ? "Se déconnecter" : undefined}
        >
          <LogOut className={cn("w-4 h-4", !collapsed && "mr-2")} />
          {!collapsed && "Se déconnecter"}
        </Button>
      </div>
    </div>
  );
}
