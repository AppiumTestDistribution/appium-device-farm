import React, { useState } from 'react';
import ProfileSidebar from './sections/ProfileSidebar';
import PasswordAuth from './sections/PasswordAuth';
import ApiTokens from './sections/ApiToken';

type ProfileSection = 'password' | 'apiTokens';

const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ProfileSection>('password');

  const renderSection = () => {
    switch (activeSection) {
      case 'password':
        return <PasswordAuth />;
      case 'apiTokens':
        return <ApiTokens />;
      default:
        return <PasswordAuth />; // Default to password section
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Left Sidebar */}
      <div className="w-1/4 border-r border-gray-700 p-6">
        <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>

      {/* Right Content Area */}
      <div className="w-3/4 p-10">{renderSection()}</div>
    </div>
  );
};

export default ProfilePage;
