'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Fuel,
  Video,
  Users,
  Receipt,
  Car,
  ShieldCheck,
  Notebook,
  Layers,
  Landmark,
  Wallet,
  FileText,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  UserRound,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useAuthStore } from '@/stores/auth.store';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleSidebar, setMobileOpen } = useSidebarStore();
  const { logout } = useAuthStore();
  const { t } = useLanguage();

  const navItems = [
    { label: t('dashOverview'), href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5 shrink-0" /> },
    { label: t('dashMyPumps'), href: '/dashboard/pumps', icon: <Fuel className="h-5 w-5 shrink-0" /> },
    { label: t('dashLiveMonitor'), href: '/dashboard/live', icon: <Video className="h-5 w-5 shrink-0" /> },
    { label: t('dashEmployeesShift'), href: '/dashboard/employees', icon: <Users className="h-5 w-5 shrink-0" /> },
    { label: t('dashSalesRegister'), href: '/dashboard/sales', icon: <Receipt className="h-5 w-5 shrink-0" /> },
    { label: t('dashVehicleLogs'), href: '/dashboard/vehicles', icon: <Car className="h-5 w-5 shrink-0" /> },
    { label: t('dashHydrotesting'), href: '/dashboard/hydrotesting', icon: <ShieldCheck className="h-5 w-5 shrink-0" /> },
    { label: t('dashCreditApprovals'), href: '/dashboard/credit-approvals', icon: <Notebook className="h-5 w-5 shrink-0" /> },
    { label: t('dashCreditCustomers'), href: '/dashboard/udhaar', icon: <UserRound className="h-5 w-5 shrink-0" /> },
    { label: t('dashCompliance'), href: '/dashboard/compliance', icon: <Notebook className="h-5 w-5 shrink-0" /> },
    { label: t('dashInventory'), href: '/dashboard/inventory', icon: <Layers className="h-5 w-5 shrink-0" /> },
    { label: t('dashAccounting'), href: '/dashboard/accounting', icon: <Landmark className="h-5 w-5 shrink-0" /> },
    { label: t('dashSubscription'), href: '/dashboard/subscription', icon: <CreditCard className="h-5 w-5 shrink-0" /> },
    { label: t('dashVouchers'), href: '/dashboard/vouchers', icon: <QrCode className="h-5 w-5 shrink-0" /> },
    { label: t('dashWalletTerminal'), href: '/dashboard/wallet', icon: <Wallet className="h-5 w-5 shrink-0" /> },
    { label: t('dashReportsHub'), href: '/dashboard/reports', icon: <FileText className="h-5 w-5 shrink-0" /> },
    { label: t('dashAiAssistant'), href: '/dashboard/ai', icon: <Cpu className="h-5 w-5 shrink-0" /> },
    { label: t('dashSettings'), href: '/dashboard/settings', icon: <Settings className="h-5 w-5 shrink-0" /> },
  ];

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  const RenderContent = () => (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200 text-slate-700 shadow-xs">
      {/* Upper Logo & Toggle Panel */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 shrink-0">
              <img src="/logo.svg" alt="FuelFlux Logo" className="h-8.5 w-8.5 object-contain rounded-full shadow-xs" />
            </div>
            {!isCollapsed && (
              <span className="text-base font-bold tracking-tight text-slate-900 font-plus-jakarta shrink-0">
                Fuel<span className="text-orange-500">Flux</span>
              </span>
            )}
          </div>
          {/* Collapse toggle (Desktop only) */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer outline-none transition-colors border border-slate-200"
            title="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 outline-none
                  ${isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold'
                    : 'hover:bg-orange-50/80 text-slate-600 hover:text-orange-600'
                  }
                `}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="truncate font-medium text-xs sm:text-sm">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer Panel */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-xs sm:text-sm font-semibold tracking-wide text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all duration-200 cursor-pointer outline-none border border-transparent hover:border-rose-100"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span className="text-xs sm:text-sm font-medium">{t('navLogout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* A. DESKTOP PERMANENT SIDEBAR */}
      <aside className={`hidden lg:block h-screen fixed top-0 left-0 transition-[width] duration-300 ease-in-out z-30 ${sidebarWidth}`}>
        <RenderContent />
      </aside>

      {/* B. MOBILE DRAWER SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-64 h-full z-10"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-[-45px] p-2 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-lg cursor-pointer hover:bg-slate-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
              <div className="h-full w-full">
                <RenderContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
