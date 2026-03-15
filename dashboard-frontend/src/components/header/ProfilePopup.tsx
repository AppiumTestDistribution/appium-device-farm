import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout, Person, Group, Devices, People } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  isAdmin: boolean;
  onLogout: () => void;
  isAuthDisabled: boolean;
}

interface Menu {
  route: string;
  icon: React.ReactNode;
  label: string;
}

export default function ProfilePopup({
  isOpen,
  onClose,
  username,
  isAdmin,
  onLogout,
  isAuthDisabled,
}: ProfilePopupProps) {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const defaultMenus = [
    {
      route: '/profile',
      icon: <Person className="text-gray-400" sx={{ fontSize: 18 }} />,
      label: 'Profile',
    },
  ];

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  useEffect(() => {
    if (isAuthDisabled) {
      setMenuItems([
        {
          route: '/devices',
          icon: <Devices className="text-gray-400" sx={{ fontSize: 18 }} />,
          label: 'Manage Devices',
        },
      ]);
    } else if (isAdmin) {
      setMenuItems([
        ...defaultMenus,
        {
          route: '/users',
          icon: <People className="text-gray-400" sx={{ fontSize: 18 }} />,
          label: 'Users',
        },
        {
          route: '/teams',
          icon: <Group className="text-gray-400" sx={{ fontSize: 18 }} />,
          label: 'Teams',
        },
        {
          route: '/devices',
          icon: <Devices className="text-gray-400" sx={{ fontSize: 18 }} />,
          label: 'Manage Devices',
        },
      ]);
    } else {
      setMenuItems(defaultMenus);
    }
  }, [isAuthDisabled, isAdmin]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[#0F172A] border border-gray-700 shadow-lg z-50 rounded-md"
          >
            <div className="p-1.5">
              {menuItems.map((menu, i) => (
                <button
                  key={`menu-item-${i}`}
                  onClick={() => handleNavigation(menu.route)}
                  className="w-full px-2.5 py-1.5 text-left text-gray-300 hover:bg-gray-700/50 flex items-center gap-2.5 transition-colors text-[13px]"
                >
                  {menu.icon}
                  <span>{menu.label}</span>
                </button>
              ))}
            </div>

            {!isAuthDisabled && (
              <div className="border-t border-gray-700/50 p-1.5">
                <button
                  onClick={onLogout}
                  className="w-full px-2.5 py-1.5 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors text-[13px]"
                >
                  <Logout className="text-red-400" sx={{ fontSize: 18 }} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
