export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  conversationId: string;
  createdAt: Date;
}

export interface MessageWithUser extends Message {
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

export interface SendMessageDto {
  receiverId: string;
  content: string;
}
