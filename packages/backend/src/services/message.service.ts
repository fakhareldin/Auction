import prisma from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export interface CreateMessageDto {
  receiverId: string;
  content: string;
  listingId?: string; // Optional: for context
}

export const messageService = {
  /**
   * Create a new message
   */
  async createMessage(senderId: string, data: CreateMessageDto) {
    const { receiverId, content } = data;

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new AppError(404, 'المستخدم المستقبل غير موجود', 'RECEIVER_NOT_FOUND');
    }

    // Cannot send message to self
    if (senderId === receiverId) {
      throw new AppError(400, 'لا يمكنك إرسال رسالة لنفسك', 'CANNOT_MESSAGE_SELF');
    }

    // Create conversation ID (consistent order for both users)
    const conversationId = [senderId, receiverId].sort().join('_');

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return message;
  },

  /**
   * Get conversation between two users
   */
  async getConversation(userId: string, otherUserId: string, page = 1, limit = 50) {
    const conversationId = [userId, otherUserId].sort().join('_');

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          conversationId,
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.message.count({
        where: {
          conversationId,
        },
      }),
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      data: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string) {
    // Get unique conversation partners
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      distinct: ['conversationId'],
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Get conversation details
    const conversations = await Promise.all(
      messages.map(async (message) => {
        const otherUserId =
          message.senderId === userId ? message.receiverId : message.senderId;
        const otherUser =
          message.senderId === userId ? message.receiver : message.sender;

        // Get last message
        const lastMessage = await prisma.message.findFirst({
          where: {
            conversationId: message.conversationId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        // Get unread count
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: message.conversationId,
            receiverId: userId,
            isRead: false,
          },
        });

        return {
          conversationId: message.conversationId,
          otherUser,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    return conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || new Date(0);
      const bTime = b.lastMessage?.createdAt || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  },

  /**
   * Mark messages as read
   */
  async markAsRead(userId: string, conversationId: string) {
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  },

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string) {
    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return { count };
  },

  /**
   * Delete a message (soft delete by marking as deleted for user)
   */
  async deleteMessage(userId: string, messageId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new AppError(404, 'الرسالة غير موجودة', 'MESSAGE_NOT_FOUND');
    }

    // Only sender can delete
    if (message.senderId !== userId) {
      throw new AppError(403, 'ليس لديك صلاحية لحذف هذه الرسالة', 'FORBIDDEN');
    }

    // In a real app, you might want soft delete
    // For now, we'll actually delete
    await prisma.message.delete({
      where: { id: messageId },
    });

    return { success: true };
  },
};
