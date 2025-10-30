import { conversations, messages } from "@/utils/db/schema";

export type Conversation = typeof conversations._.inferSelect;
export type NewConversation = typeof conversations._.inferInsert;
export type Message = typeof messages._.inferSelect;
export type NewMessage = typeof messages._.inferInsert;