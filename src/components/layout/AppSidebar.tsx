import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Package, 
  Upload, 
  Settings,
  ChevronDown,
  Building2,
  Map,
  UserCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_HIERARCHY } from '@/config/api';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  minRole?: number;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { 
    label: 'Hierarchy', 
    path: '/hierarchy', 
    icon: Building2,
    minRole: 3,
    children: [
      { label: 'Regions', path: '/hierarchy/regions' },
      { label: 'Areas', path: '/hierarchy/areas' },
      { label: 'Territories', path: '/hierarchy/territories' },
    ]
  },
  { label: 'DSR Performance', path: '/dsr', icon: Users, minRole: 2 },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Analytics', path: '/analytics', icon: TrendingUp },
  { label: 'Upload Data', path: '/upload', icon: Upload, minRole: 4 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const userRoleLevel = user ? ROLE_HIERARCHY[user.role] : 0;
  const [openGroups, setOpenGroups] = useState<string[]>(['Hierarchy']);

  const filteredNavItems = navItems.filter(
    item => !item.minRole || userRoleLevel >= item.minRole
  );

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => 
      prev.includes(label) 
        ? prev.filter(g => g !== label)
        : [...prev, label]
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-foreground">FMCG Analytics</h1>
            <p className="text-xs text-sidebar-muted">Sales Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              location.pathname.startsWith(item.path + '/');
            
            if (item.children) {
              const isGroupActive = item.children.some(
                child => location.pathname === child.path
              );
              const isOpen = openGroups.includes(item.label);

              return (
                <Collapsible
                  key={item.path}
                  open={isOpen}
                  onOpenChange={() => toggleGroup(item.label)}
                >
                  <CollapsibleTrigger className={cn(
                    'sidebar-link w-full justify-between',
                    isGroupActive && 'sidebar-link-active'
                  )}>
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </span>
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform',
                      isOpen && 'rotate-180'
                    )} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 pt-1 space-y-1">
                    {item.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => cn(
                          'sidebar-link text-sm py-1.5',
                          isActive && 'sidebar-link-active'
                        )}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'sidebar-link',
                  isActive && 'sidebar-link-active'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        {user && (
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
                <UserCircle className="h-6 w-6 text-sidebar-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-muted">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
