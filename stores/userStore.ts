import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      
      if (user) {
        set({ 
          user: {
            id: user.id,
            email: user.email || null,
            name: user.user_metadata?.name || user.email?.split('@')[0] || null,
            imageUrl: user.user_metadata?.avatar_url || null,
          },
          isLoading: false 
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));