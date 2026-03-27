import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services/message.service';
import Joi from 'joi';
import { AppError } from '../middlewares/error.middleware';

// Validation schemas
const createMessageSchema = Joi.object({
  receiverId: Joi.string().required(),
  content: Joi.string().min(1).max(5000).required(),
  listingId: Joi.string().optional(),
});

export const messageController = {
  /**
   * Send a message
   */
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.id;

      // Validate input
      const { error, value } = createMessageSchema.validate(req.body);
      if (error) {
        throw new AppError(400, error.details[0].message, 'VALIDATION_ERROR');
      }

      const message = await messageService.createMessage(senderId, value);

      res.status(201).json({
        success: true,
        data: message,
        message: 'تم إرسال الرسالة بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get conversation with another user
   */
  async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { otherUserId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const conversation = await messageService.getConversation(
        userId,
        otherUserId,
        page,
        limit
      );

      res.json({
        success: true,
        ...conversation,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all conversations
   */
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const conversations = await messageService.getConversations(userId);

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark messages as read
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;

      const result = await messageService.markAsRead(userId, conversationId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get unread count
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await messageService.getUnreadCount(userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a message
   */
  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { messageId } = req.params;

      const result = await messageService.deleteMessage(userId, messageId);

      res.json({
        success: true,
        data: result,
        message: 'تم حذف الرسالة بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },
};
