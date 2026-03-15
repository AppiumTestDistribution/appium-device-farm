import React from 'react';

type ProfileSection = 'password' | 'apiTokens';

interface ProfileSidebarProps {
  activeSection: ProfileSection;
  setActiveSection: (section: ProfileSection) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'password', label: 'Password & Authentication' },
    { id: 'apiTokens', label: 'API Tokens' },
    // Add more sections here if needed
  ];

  return (
    <nav>
      <h2 className="text-xl font-semibold mb-6 text-gray-100">Profile Settings</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item.id} className="mb-3">
            <button
              onClick={() => setActiveSection(item.id as ProfileSection)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ease-in-out 
                          ${
                            activeSection === item.id
                              ? 'bg-blue-600 text-white font-medium shadow-md'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ProfileSidebar;
