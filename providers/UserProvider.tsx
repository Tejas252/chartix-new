"use client";

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
}