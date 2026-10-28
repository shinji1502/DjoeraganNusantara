import React from 'react';
import { Outlet } from 'react-router-dom';
import { DemoRoleSwitcher } from '../components/common/DemoRoleSwitcher';
import { NavbarPublic } from '../components/common/NavbarPublic';
import { FooterPublic } from '../components/common/FooterPublic';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] bg-grid-squares text-[#1C1917] overflow-x-clip font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="sticky top-0 z-50 shadow-2xs">
        <DemoRoleSwitcher />
        <NavbarPublic />
      </div>
      <main className="flex-1 w-full overflow-x-clip">
        <Outlet />
      </main>
      <FooterPublic />
    </div>
  );
};
