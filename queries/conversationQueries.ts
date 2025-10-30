import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import conversationRepository from '@/server/models/conversations/conversations.query';

// Query keys for conversation-related queries
const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (userId?: string, teamId?: string, limit: number = 20, offset: number = 0) => 
    [...conversationKeys.lists(), { userId, teamId, limit, offset }] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  messages: (conversationId: string) => [...conversationKeys.all, 'messages', conversationId] as const,
};

// Query: Get conversations by user
export function useConversationsByUser(userId: string, limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: conversationKeys.list(userId, undefined, limit, offset),
    queryFn: () => conversationRepository.getConversationsByUser(userId, limit, offset),
    enabled: !!userId,
  });
}

// Query: Get conversations by team
export function useConversationsByTeam(teamId: string, limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: conversationKeys.list(undefined, teamId, limit, offset),
    queryFn: () => conversationRepository.getConversationsByTeam(teamId, limit, offset),
    enabled: !!teamId,
  });
}

// Query: Get conversation by ID
export function useConversationById(id: string) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: () => conversationRepository.getConversationById(id),
    enabled: !!id,
  });
}

// Query: Get messages for a conversation
export function useMessages(conversationId: string, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => conversationRepository.getMessages(conversationId, limit, offset),
    enabled: !!conversationId,
  });
}

// Mutation: Create conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (conversationData: Omit<Parameters<typeof conversationRepository.createConversation>[0], 'id' | 'createdAt' | 'updatedAt'>) => 
      conversationRepository.createConversation(conversationData),
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(newConversation.id) });
    },
  });
}

// Mutation: Update conversation
export function useUpdateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof conversationRepository.updateConversation>[1] }) => 
      conversationRepository.updateConversation(id, updates),
    onSuccess: (updatedConversation) => {
      if (updatedConversation) {
        queryClient.invalidateQueries({ queryKey: conversationKeys.detail(updatedConversation.id) });
        queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      }
    },
  });
}

// Mutation: Delete conversation
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => conversationRepository.deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

// Mutation: Add message to conversation
export function useAddMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageData: Omit<Parameters<typeof conversationRepository.addMessage>[0], 'id' | 'createdAt' | 'updatedAt'>) => 
      conversationRepository.addMessage(messageData),
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(newMessage.conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(newMessage.conversationId) });
    },
  });
}

export { conversationKeys };