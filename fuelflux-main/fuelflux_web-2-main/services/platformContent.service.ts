import backendApi from '@/lib/backendApi';

export interface PlatformStats {
  id?: string;
  fuel_stations: number;
  active_vehicles: number;
  total_transactions: number;
  connected_users: number;
  liters_telemetered_millions: number;
  uptime_percentage: number;
  checkout_speed_sec: number;
  hero_headline?: string | null;
  hero_subheadline?: string | null;
  updated_at?: string | null;
}

export interface PlatformTestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  highlight: string;
  stars: number;
  initials: string;
  avatar_url?: string | null;
  is_active: boolean;
  display_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LiveDbCounts {
  pumps: number;
  vehicles: number;
  transactions: number;
  users: number;
}

export interface AdminStatsResponse {
  success: boolean;
  data: {
    stats: PlatformStats;
    live_database_counts: LiveDbCounts;
  };
}

export const platformContentService = {
  /**
   * Public: Get platform statistics for landing page and apps
   */
  async getPublicStats(): Promise<PlatformStats> {
    const res = await backendApi.get('/platform/stats');
    return res.data?.stats;
  },

  /**
   * Public: Get active testimonials for landing page
   */
  async getPublicTestimonials(): Promise<PlatformTestimonialItem[]> {
    const res = await backendApi.get('/platform/testimonials');
    return res.data?.testimonials || [];
  },

  /**
   * Admin: Get statistics plus live DB counts
   */
  async adminGetStats(): Promise<AdminStatsResponse['data']> {
    const res = await backendApi.get('/admin/platform/stats');
    return res.data?.data;
  },

  /**
   * Admin: Update platform statistics
   */
  async adminUpdateStats(payload: Partial<PlatformStats>): Promise<PlatformStats> {
    const res = await backendApi.put('/admin/platform/stats', payload);
    return res.data?.data?.stats;
  },

  /**
   * Admin: Get all testimonials (active & inactive)
   */
  async adminGetTestimonials(): Promise<PlatformTestimonialItem[]> {
    const res = await backendApi.get('/admin/platform/testimonials');
    return res.data?.data?.testimonials || [];
  },

  /**
   * Admin: Create a new testimonial
   */
  async adminCreateTestimonial(payload: {
    author: string;
    role: string;
    company: string;
    quote: string;
    highlight: string;
    stars: number;
    initials?: string;
    avatar_url?: string;
    is_active?: boolean;
    display_order?: number;
  }): Promise<PlatformTestimonialItem> {
    const res = await backendApi.post('/admin/platform/testimonials', payload);
    return res.data?.data?.testimonial;
  },

  /**
   * Admin: Update a testimonial
   */
  async adminUpdateTestimonial(
    id: string,
    payload: Partial<PlatformTestimonialItem>
  ): Promise<PlatformTestimonialItem> {
    const res = await backendApi.put(`/admin/platform/testimonials/${id}`, payload);
    return res.data?.data?.testimonial;
  },

  /**
   * Admin: Delete a testimonial
   */
  async adminDeleteTestimonial(id: string): Promise<void> {
    await backendApi.delete(`/admin/platform/testimonials/${id}`);
  },
};
