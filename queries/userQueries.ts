import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import usersRepository from '@/server/models/users/users.query';

// Query keys for user-related queries
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (limit: number, offset: number) => [...userKeys.lists(), { limit, offset }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  byClerkId: (clerkId: string) => [...userKeys.all, 'clerkId', clerkId] as const,
  byEmail: (email: string) => [...userKeys.all, 'email', email] as const,
};

// Query: Get all users
export function useUsers(limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: userKeys.list(limit, offset),
    queryFn: () => usersRepository.getAllUsers(limit, offset),
  });
}

// Query: Get user by ID
export function useUserById(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersRepository.getUserById(id),
    enabled: !!id,
  });
}

// Query: Get user by Clerk ID
export function useUserByClerkId(clerkId: string) {
  return useQuery({
    queryKey: userKeys.byClerkId(clerkId),
    queryFn: () => usersRepository.getUserByClerkId(clerkId),
    enabled: !!clerkId,
  });
}

// Query: Get user by email
export function useUserByEmail(email: string) {
  return useQuery({
    queryKey: userKeys.byEmail(email),
    queryFn: () => usersRepository.getUserByEmail(email),
    enabled: !!email,
  });
}

// Mutation: Create user
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Parameters<typeof usersRepository.createUser>[0]) => 
      usersRepository.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Mutation: Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof usersRepository.updateUser>[1] }) => 
      usersRepository.updateUser(id, updates),
    onSuccess: (updatedUser) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser?.id || '') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Mutation: Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => usersRepository.deleteUser(id),
    onSuccess: (_, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export { userKeys };