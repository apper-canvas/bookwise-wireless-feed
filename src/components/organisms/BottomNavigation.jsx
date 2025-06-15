import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const BottomNavigation = () => {
  const location = useLocation();
  const navItems = Object.values(routes).filter(route => !route.hideInNav);

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2 flex-shrink-0 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="flex flex-col items-center py-2 px-3 min-w-0 flex-1"
            >
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full transition-colors ${
                    isActive ? 'bg-primary/10' : 'hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={20}
                    className={`transition-colors ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  />
                </motion.div>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
              </div>
              
              <span className={`text-xs mt-1 transition-colors truncate ${
                isActive ? 'text-primary font-medium' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;