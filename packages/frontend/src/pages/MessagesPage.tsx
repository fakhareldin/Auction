import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Badge,
  InputAdornment,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  Search,
  MoreVert,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { messageService, type Conversation, type Message } from '../services/message.service';
import { socketService } from '../services/socket.service';
import { userService } from '../services/user.service';

export default function MessagesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadConversations();

    // Connect to socket
    socketService.connect();

    // Listen for new messages
    socketService.on('new-message', handleNewMessage);
    socketService.on('message-sent', handleMessageSent);
    socketService.on('user-typing', handleUserTyping);
    socketService.on('user-stopped-typing', handleUserStoppedTyping);
    socketService.on('messages-read', handleMessagesRead);

    return () => {
      socketService.off('new-message', handleNewMessage);
      socketService.off('message-sent', handleMessageSent);
      socketService.off('user-typing', handleUserTyping);
      socketService.off('user-stopped-typing', handleUserStoppedTyping);
      socketService.off('messages-read', handleMessagesRead);
      socketService.disconnect();
    };
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.otherUser.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle opening conversation from URL query parameter
  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId && conversations.length > 0) {
      // Find conversation with this user
      const conversation = conversations.find(
        (conv) => conv.otherUser.id === userId
      );

      if (conversation) {
        setSelectedConversation(conversation);
      } else {
        // Create new conversation
        loadUserAndStartConversation(userId);
      }
    }
  }, [searchParams, conversations]);

  const loadUserAndStartConversation = async (userId: string) => {
    try {
      const otherUser = await userService.getUserById(userId);
      const conversationId = [user!.id, userId].sort().join('_');

      // Create temporary conversation
      const newConversation: Conversation = {
        conversationId,
        otherUser: {
          id: otherUser.id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          avatar: otherUser.avatar,
        },
        lastMessage: {
          id: '',
          senderId: '',
          receiverId: '',
          content: 'ابدأ المحادثة...',
          isRead: true,
          createdAt: new Date().toISOString(),
        },
        unreadCount: 0,
      };

      setSelectedConversation(newConversation);
      setMessages([]);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const response = await messageService.getConversation(otherUserId);
      setMessages(response.data);

      // Mark as read
      if (selectedConversation) {
        socketService.markAsRead(selectedConversation.conversationId, otherUserId);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (selectedConversation) {
      const conversationId = [message.senderId, message.receiverId].sort().join('_');
      if (conversationId === selectedConversation.conversationId) {
        setMessages((prev) => [...prev, message]);
        socketService.markAsRead(conversationId, message.senderId);
      }
    }

    // Update conversations list
    loadConversations();
  };

  const handleMessageSent = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    loadConversations();
  };

  const handleUserTyping = (data: { conversationId: string; userId: string }) => {
    if (selectedConversation?.conversationId === data.conversationId) {
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    }
  };

  const handleUserStoppedTyping = (data: { conversationId: string; userId: string }) => {
    if (selectedConversation?.conversationId === data.conversationId) {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    }
  };

  const handleMessagesRead = () => {
    // Update UI to show messages as read
    loadConversations();
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || sending) return;

    setSending(true);
    const content = messageInput.trim();
    setMessageInput('');

    try {
      // Send via socket for real-time delivery
      socketService.sendMessage(selectedConversation.otherUser.id, content);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageInput(content); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (selectedConversation) {
      // Send typing indicator
      socketService.typingStart(
        selectedConversation.conversationId,
        selectedConversation.otherUser.id
      );

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketService.typingStop(
          selectedConversation.conversationId,
          selectedConversation.otherUser.id
        );
      }, 2000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter((conv) =>
    `${conv.otherUser.firstName} ${conv.otherUser.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          الرسائل
        </Typography>

        <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
          {/* Conversations List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Search */}
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="بحث في المحادثات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Divider />

              {/* Conversations */}
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredConversations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      لا توجد محادثات
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ابدأ محادثة جديدة من خلال التواصل مع البائعين في الإعلانات
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {filteredConversations.map((conversation) => (
                      <ListItem
                        key={conversation.conversationId}
                        button
                        selected={selectedConversation?.conversationId === conversation.conversationId}
                        onClick={() => setSelectedConversation(conversation)}
                        sx={{
                          '&.Mui-selected': {
                            bgcolor: '#FF385C15',
                            borderRight: '3px solid #FF385C',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="error"
                            badgeContent={conversation.unreadCount}
                            invisible={conversation.unreadCount === 0}
                          >
                            <Avatar
                              sx={{ bgcolor: '#FF385C' }}
                              src={conversation.otherUser.avatar}
                            >
                              {conversation.otherUser.firstName[0]}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={conversation.unreadCount > 0 ? 'bold' : 'normal'}
                              >
                                {conversation.otherUser.firstName} {conversation.otherUser.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(conversation.lastMessage.createdAt).toLocaleDateString('ar-SA')}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                              }}
                            >
                              {conversation.lastMessage.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Messages Thread */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {!selectedConversation ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      اختر محادثة لبدء المراسلة
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      اختر محادثة من القائمة لعرض الرسائل
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  {/* Conversation Header */}
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: '#FF385C' }}
                        src={selectedConversation.otherUser.avatar}
                      >
                        {selectedConversation.otherUser.firstName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedConversation.otherUser.firstName} {selectedConversation.otherUser.lastName}
                        </Typography>
                        {typingUsers.size > 0 && (
                          <Typography variant="caption" color="primary">
                            يكتب...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Messages */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      overflow: 'auto',
                      p: 2,
                      bgcolor: '#f9f9f9',
                    }}
                  >
                    <Stack spacing={2}>
                      {messages.map((message) => {
                        const isMine = message.senderId === user.id;
                        return (
                          <Box
                            key={message.id}
                            sx={{
                              display: 'flex',
                              justifyContent: isMine ? 'flex-end' : 'flex-start',
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: '70%',
                                bgcolor: isMine ? '#FF385C' : 'white',
                                color: isMine ? 'white' : 'text.primary',
                                p: 1.5,
                                borderRadius: 2,
                                boxShadow: 1,
                              }}
                            >
                              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {message.content}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  opacity: 0.8,
                                  textAlign: 'left',
                                }}
                              >
                                {new Date(message.createdAt).toLocaleTimeString('ar-SA', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {isMine && message.isRead && ' ✓✓'}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </Stack>
                  </Box>

                  {/* Message Input */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: 1,
                      borderColor: 'divider',
                      bgcolor: 'white',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="اكتب رسالتك..."
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        size="small"
                        disabled={sending}
                      />
                      <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sending}
                        sx={{
                          bgcolor: '#FF385C',
                          color: 'white',
                          '&:hover': { bgcolor: '#E61E4D' },
                          '&:disabled': { bgcolor: 'grey.300' },
                        }}
                      >
                        <Send />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
