import conversationRepository from "./conversations.query";
import { NewConversation } from "./conversations.type";

export const createNewConversation = async (data: Omit<NewConversation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await conversationRepository.createConversation({
        title: data.title,
        userId: data.userId,
        teamId: data.teamId,
        fileId: data.fileId,
    });

    return result;
};