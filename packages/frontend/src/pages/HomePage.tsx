import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  alpha,
  Stack,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  DirectionsCar,
  Home as HomeIcon,
  Computer,
  Chair,
  Checkroom,
  SportsBasketball,
  Build,
  Work,
  Pets,
  Category,
  AccountCircle,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Favorite,
  FavoriteBorder,
  Message,
  LocationOn,
  FilterList,
  Phone,
  WhatsApp,
  Star,
  Verified,
  ChatBubble,
  Close,
  Send,
  Menu as MenuIcon,
  KeyboardArrowDown,
  TrendingUp,
  LocalOffer,
  DashboardCustomize,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { listingService } from '../services/listing.service';
import { categoryService } from '../services/category.service';
import type { Listing, Category as CategoryType } from '@haraj/shared';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [listingsData, categoriesData] = await Promise.all([
        listingService.getListings({ page: 1, limit: 16 }).catch(() => ({
          data: [],
          pagination: { page: 1, limit: 16, total: 0, totalPages: 0 }
        })),
        categoryService.getAllCategories().catch(() => []),
      ]);
      setListings(listingsData.data || []);

      // Ensure categoriesData is an array before filtering
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData.filter((cat: any) => !cat.parentId));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setListings([]);
      setCategories([]);
    }
  };


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
            : 'linear-gradient(135deg, #1e40af 0%, #6b21a8 100%)',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <Typography
            variant="h2"
            fontWeight="900"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 2,
              textShadow: '0 2px 20px rgba(0,0,0,0.2)',
              lineHeight: 1.2,
            }}
          >
            🎯 السوق الأول في السودان
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              opacity: 0.95,
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 500,
              lineHeight: 1.6,
              textShadow: '0 1px 10px rgba(0,0,0,0.2)',
            }}
          >
            اشترِ أو بِع أي شيء بكل سهولة - من السيارات والعقارات إلى الإلكترونيات والأثاث
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate(isAuthenticated ? '/listings/create' : '/register')}
              sx={{
                borderRadius: 12,
                px: 6,
                py: 2.5,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 800,
                fontSize: '1.15rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : 'grey.100',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s',
              }}
            >
              🚀 ابدأ البيع مجاناً
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/listings')}
              sx={{
                borderRadius: 12,
                px: 6,
                py: 2.5,
                borderWidth: 2,
                borderColor: 'white',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.15rem',
                backdropFilter: 'blur(10px)',
                bgcolor: alpha('#fff', 0.05),
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: alpha('#fff', 0.15),
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s',
              }}
            >
              🔍 استكشف الإعلانات
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 3, md: 6 }}
            justifyContent="center"
            sx={{ flexWrap: 'wrap', gap: 2 }}
          >
            {[
              { value: '15,000+', label: 'إعلان متاح', icon: '📢' },
              { value: '8,500+', label: 'مستخدم نشط', icon: '👥' },
              { value: '99%', label: 'رضا العملاء', icon: '⭐' },
              { value: '24/7', label: 'دعم مستمر', icon: '💬' },
            ].map((stat, i) => (
              <Box
                key={i}
                sx={{
                  minWidth: 120,
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 3,
                  bgcolor: alpha('#fff', 0.1),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: alpha('#fff', 0.2),
                }}
              >
                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  {stat.icon}
                </Typography>
                <Typography variant="h4" fontWeight="900" sx={{ mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Listings Section */}
      <Container maxWidth="xl" sx={{ mt: -6, mb: 8, position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <Box sx={{ mb: 5, textAlign: { xs: 'center', md: 'right' } }}>
          <Typography
            variant="h3"
            fontWeight="900"
            gutterBottom
            sx={{
              color: 'primary.main',
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: '2rem',
                filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
              }}
            >
              ✨
            </Box>
            <Box component="span">إعلانات مختارة بعناية</Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              maxWidth: 600,
              mx: { xs: 'auto', md: 0 }
            }}
          >
            اكتشف أفضل العروض والفرص الحصرية المتاحة الآن
          </Typography>
        </Box>

        {/* Listings Grid */}
        <Grid container spacing={3}>
          {listings.length > 0 ? (
            listings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 12px 40px rgba(0,0,0,0.12)'
                        : '0 12px 40px rgba(0,0,0,0.4)',
                      '& .listing-image': {
                        transform: 'scale(1.08)',
                      },
                    },
                    transition: 'all 0.3s',
                  }}
                  onClick={() => navigate(`/listings/${listing.id}`)}
                >
                  {/* Image */}
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
                    <CardMedia
                      component="div"
                      className="listing-image"
                      sx={{
                        height: '100%',
                        bgcolor: 'grey.100',
                        backgroundImage: listing.images?.[0]
                          ? `url(${listing.images[0].url})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.4s',
                      }}
                    >
                      {!listing.images?.[0] && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <Category sx={{ fontSize: 60, color: 'grey.300' }} />
                        </Box>
                      )}
                    </CardMedia>

                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: 'white',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' },
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FavoriteBorder sx={{ color: '#FF385C', fontSize: 20 }} />
                    </IconButton>

                    {listing.negotiable && (
                      <Chip
                        label="قابل للتفاوض"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          bgcolor: alpha('#00C853', 0.95),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Location & Rating */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight="600">
                        {listing.city}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Star sx={{ fontSize: 14, color: '#FFB400' }} />
                      <Typography variant="caption" fontWeight="700">
                        4.8
                      </Typography>
                    </Stack>

                    {/* Title */}
                    <Typography
                      variant="subtitle1"
                      fontWeight="800"
                      gutterBottom
                      noWrap
                      sx={{ mb: 1 }}
                    >
                      {listing.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                        height: 40,
                        flexGrow: 1,
                      }}
                    >
                      {listing.description}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h6"
                        fontWeight="900"
                        sx={{ color: '#FF385C' }}
                      >
                        {Number(listing.price).toLocaleString('ar-SA')} ر.س
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Seller & Actions */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#FF385C',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                        }}
                      >
                        {listing.user?.firstName?.[0] || 'م'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="caption" fontWeight="700" noWrap>
                          {listing.user?.firstName || 'مستخدم'}
                        </Typography>
                      </Box>

                      <Tooltip title="واتساب">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha('#25D366', 0.1),
                            '&:hover': { bgcolor: alpha('#25D366', 0.2) },
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <WhatsApp sx={{ fontSize: 18, color: '#25D366' }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="اتصال">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha('#FF385C', 0.1),
                            '&:hover': { bgcolor: alpha('#FF385C', 0.2) },
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone sx={{ fontSize: 18, color: '#FF385C' }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 8,
                  textAlign: 'center',
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  border: '2px dashed',
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Typography variant="h1">📢</Typography>
                </Box>
                <Typography variant="h4" fontWeight="900" gutterBottom>
                  🌟 كن أول من يبدأ!
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  لا توجد إعلانات بعد. انشر إعلانك الأول الآن وابدأ رحلة البيع والشراء
                </Typography>
                {isAuthenticated && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/listings/create')}
                    sx={{
                      borderRadius: 12,
                      px: 6,
                      py: 2,
                      bgcolor: 'primary.main',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    🚀 انشر إعلانك المجاني
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Floating Chat */}
      {isAuthenticated && (
        <>
          <Fab
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 6,
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: 8,
              },
              zIndex: 1000,
            }}
            onClick={() => setShowChat(!showChat)}
          >
            <Badge badgeContent={3} color="error">
              <ChatBubble />
            </Badge>
          </Fab>

          {showChat && (
            <Paper
              elevation={12}
              sx={{
                position: 'fixed',
                bottom: 100,
                right: 24,
                width: 360,
                height: 520,
                borderRadius: 4,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1001,
              }}
            >
              <Box
                sx={{
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : 'linear-gradient(135deg, #1e40af 0%, #6b21a8 100%)',
                  color: 'white',
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha('#fff', 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ChatBubble sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="800">
                      💬 الرسائل
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
                      لديك 3 رسائل جديدة
                    </Typography>
                  </Box>
                </Stack>
                <IconButton size="small" onClick={() => setShowChat(false)} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>

              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {[
                  { name: 'أحمد محمد', msg: 'السيارة متوفرة؟', unread: 2 },
                  { name: 'فاطمة علي', msg: 'كم السعر النهائي؟', unread: 1 },
                  { name: 'خالد سعيد', msg: 'شكراً لك', unread: 0 },
                ].map((chat, i) => (
                  <Paper
                    key={i}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderColor: 'primary.main',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                        {chat.name[0]}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight="700" noWrap>
                          {chat.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {chat.msg}
                        </Typography>
                      </Box>
                      {chat.unread > 0 && (
                        <Badge badgeContent={chat.unread} color="error" />
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Box>

              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    placeholder="اكتب رسالة..."
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                      },
                    }}
                  />
                  <IconButton
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <Send />
                  </IconButton>
                </Stack>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
