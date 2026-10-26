import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobile: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleSidebar: () =>
    set((state) => {
      const next = !state.isCollapsed;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('fuelflux_sidebar_collapsed', String(next));
        } catch {}
      }
      return { isCollapsed: next };
    }),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setCollapsed: (collapsed) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fuelflux_sidebar_collapsed', String(collapsed));
      } catch {}
    }
    set({ isCollapsed: collapsed });
  },
  setMobileOpen: (open) => set({ isMobileOpen: open }),
}));
