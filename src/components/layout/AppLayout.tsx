import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { FiltersProvider } from '@/contexts/FiltersContext';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <FiltersProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="pl-64">
          <AppHeader />
          <main className="p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </FiltersProvider>
  );
}
