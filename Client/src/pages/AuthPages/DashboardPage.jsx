import React from 'react';
import HomeSetup from '../../components/Common_Features/HomeSetup';

const DashboardPage = () => {
  return (
    <>
      <div
        className="fixed inset-0 z-50 blur-sm bg-white/30 pointer-events-none"
      >
        {/* You can show a loading spinner or overlay text here if needed */}
      </div>

      {/* Actual content below gets blurred and unclickable */}
      <div className="blur-sm pointer-events-none">
        <HomeSetup />
      </div>
    </>
  );
};

export default DashboardPage;
