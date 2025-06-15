import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from '@/components/organisms/BottomNavigation';

const Layout = () => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes('/book/') && location.pathname !== '/';

  return (  
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-surface-50">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;