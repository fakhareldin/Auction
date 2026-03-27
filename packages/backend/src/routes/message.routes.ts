import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Send a message
router.post('/', messageController.sendMessage);

// Get all conversations
router.get('/conversations', messageController.getConversations);

// Get conversation with specific user
router.get('/conversations/:otherUserId', messageController.getConversation);

// Mark conversation as read
router.patch('/conversations/:conversationId/read', messageController.markAsRead);

// Get unread count
router.get('/unread-count', messageController.getUnreadCount);

// Delete a message
router.delete('/:messageId', messageController.deleteMessage);

export default router;
