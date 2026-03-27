import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  alpha,
  Stack,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
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
  Message,
  Close,
  Menu as MenuIcon,
  KeyboardArrowDown,
  TrendingUp,
  LocalOffer,
  DashboardCustomize,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../contexts/ThemeContext';
import { categoryService } from '../../services/category.service';
import { messageService } from '../../services/message.service';
import type { Category as CategoryType } from '@haraj/shared';

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadCategories();
    if (isAuthenticated) {
      loadUnreadCount();
      // Refresh unread count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories().catch(() => []);
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData.filter((cat: any) => !cat.parentId));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const result = await messageService.getUnreadCount();
      setUnreadCount(result.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleSearch = () => {
    navigate(`/listings?search=${searchQuery}`);
  };

  const handleLogout = async () => {
    await logout();
    setAnchorEl(null);
  };

  const getCategoryIcon = (nameAr: string) => {
    const iconProps = { sx: { fontSize: 24 } };
    if (nameAr.includes('سيارات')) return <DirectionsCar {...iconProps} />;
    if (nameAr.includes('عقارات')) return <HomeIcon {...iconProps} />;
    if (nameAr.includes('إلكترونيات')) return <Computer {...iconProps} />;
    if (nameAr.includes('أثاث')) return <Chair {...iconProps} />;
    if (nameAr.includes('أزياء')) return <Checkroom {...iconProps} />;
    if (nameAr.includes('رياضة')) return <SportsBasketball {...iconProps} />;
    if (nameAr.includes('خدمات')) return <Build {...iconProps} />;
    if (nameAr.includes('وظائف')) return <Work {...iconProps} />;
    if (nameAr.includes('حيوانات')) return <Pets {...iconProps} />;
    return <Category {...iconProps} />;
  };

  return (
    <>
      {/* Premium Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ gap: { xs: 1.5, md: 3 }, px: { xs: 0, md: 2 }, py: 1.5 }}>
            {/* Mobile Menu */}
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: 1.5,
                mr: { xs: 'auto', md: 0 },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF385C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(255, 56, 92, 0.25)',
                }}
              >
                <LocalOffer sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              {!isMobile && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF385C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    حراج
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      display: 'block',
                      lineHeight: 1,
                    }}
                  >
                    اشتري وبيع بسهولة
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Categories Menu - Desktop */}
            {!isMobile && (
              <Button
                endIcon={<KeyboardArrowDown />}
                onClick={(e) => setCategoryAnchor(e.currentTarget)}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  color: 'text.primary',
                  fontWeight: 600,
                  bgcolor: alpha('#000', 0.03),
                  '&:hover': {
                    bgcolor: alpha('#000', 0.06),
                  },
                }}
              >
                <DashboardCustomize sx={{ mr: 1.5, fontSize: 22 }} />
                الفئات
              </Button>
            )}

            <Menu
              anchorEl={categoryAnchor}
              open={Boolean(categoryAnchor)}
              onClose={() => setCategoryAnchor(null)}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  mt: 1,
                  minWidth: 280,
                  maxHeight: 500,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate('/listings');
                  setCategoryAnchor(null);
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  '&:hover': { bgcolor: alpha('#FF385C', 0.08) },
                }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <TrendingUp sx={{ color: '#FF385C', fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary="جميع الإعلانات"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem' }}
                />
              </MenuItem>
              <Divider />
              {categories.map((cat) => (
                <MenuItem
                  key={cat.id}
                  onClick={() => {
                    navigate(`/listings?category=${cat.id}`);
                    setCategoryAnchor(null);
                  }}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    '&:hover': { bgcolor: alpha('#FF385C', 0.04) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    {getCategoryIcon(cat.nameAr)}
                  </ListItemIcon>
                  <ListItemText
                    primary={cat.nameAr}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                  />
                </MenuItem>
              ))}
            </Menu>

            {/* Search Bar - Desktop */}
            {!isMobile && (
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  maxWidth: 600,
                  borderRadius: 10,
                  px: 2,
                  py: 0.5,
                  bgcolor: alpha('#000', 0.03),
                  border: '2px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'white',
                    borderColor: alpha('#FF385C', 0.3),
                  },
                  '&:focus-within': {
                    bgcolor: 'white',
                    borderColor: '#FF385C',
                    boxShadow: `0 0 0 4px ${alpha('#FF385C', 0.1)}`,
                  },
                }}
              >
                <SearchIcon sx={{ color: '#FF385C', fontSize: 24, mr: 1.5 }} />
                <TextField
                  placeholder="ابحث عن سيارات، عقارات، أثاث، وظائف..."
                  variant="standard"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&::placeholder': {
                        color: 'text.secondary',
                      },
                    },
                  }}
                />
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ mr: 1 }}
                  >
                    <Close sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    borderRadius: 8,
                    px: 3,
                    py: 1,
                    minWidth: 80,
                    bgcolor: '#FF385C',
                    fontWeight: 700,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#E61E4D',
                      boxShadow: 'none',
                    },
                  }}
                >
                  بحث
                </Button>
              </Paper>
            )}

            {/* Right Side Actions */}
            <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="center" sx={{ ml: 'auto' }}>
              {/* Theme Toggle */}
              <Tooltip title={mode === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                  }}
                >
                  {mode === 'light' ? (
                    <DarkMode sx={{ color: 'primary.main', fontSize: 22 }} />
                  ) : (
                    <LightMode sx={{ color: 'primary.main', fontSize: 22 }} />
                  )}
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <>
                  {/* Add Listing Button */}
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/listings/create')}
                    sx={{
                      borderRadius: 10,
                      px: 3,
                      py: 1.2,
                      bgcolor: '#FF385C',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(255, 56, 92, 0.3)',
                      display: { xs: 'none', lg: 'flex' },
                      mr: 2,
                      '&:hover': {
                        bgcolor: '#E61E4D',
                        boxShadow: '0 6px 20px rgba(255, 56, 92, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    أضف إعلان
                  </Button>

                  {/* Messages */}
                  <Tooltip title="الرسائل">
                    <IconButton
                      onClick={() => navigate('/messages')}
                      sx={{
                        bgcolor: alpha('#FF385C', 0.08),
                        '&:hover': { bgcolor: alpha('#FF385C', 0.15) },
                      }}
                    >
                      <Badge badgeContent={unreadCount} color="error">
                        <Message sx={{ color: '#FF385C', fontSize: 22 }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Favorites */}
                  <Tooltip title="المفضلة">
                    <IconButton
                      onClick={() => navigate('/favorites')}
                      sx={{
                        bgcolor: alpha('#FF385C', 0.08),
                        display: { xs: 'none', sm: 'flex' },
                        '&:hover': { bgcolor: alpha('#FF385C', 0.15) },
                      }}
                    >
                      <Favorite sx={{ color: '#FF385C', fontSize: 22 }} />
                    </IconButton>
                  </Tooltip>

                  {/* User Menu */}
                  <Tooltip title="الحساب">
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        border: '2px solid',
                        borderColor: alpha('#FF385C', 0.2),
                        p: 0.5,
                        '&:hover': {
                          borderColor: '#FF385C',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#FF385C',
                          fontWeight: 700,
                        }}
                      >
                        {user?.firstName?.[0] || 'م'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      sx: {
                        borderRadius: 3,
                        mt: 1.5,
                        minWidth: 220,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, bgcolor: alpha('#FF385C', 0.05) }}>
                      <Typography variant="subtitle2" fontWeight="700">
                        {user?.firstName} {user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        navigate('/profile');
                        setAnchorEl(null);
                      }}
                      sx={{ py: 1.5, px: 2.5 }}
                    >
                      <AccountCircle sx={{ mr: 2, color: '#FF385C', fontSize: 24 }} />
                      <Typography variant="body2" fontWeight={600}>الملف الشخصي</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/my-listings');
                        setAnchorEl(null);
                      }}
                      sx={{ py: 1.5, px: 2.5 }}
                    >
                      <Category sx={{ mr: 2, color: '#FF385C', fontSize: 24 }} />
                      <Typography variant="body2" fontWeight={600}>إعلاناتي</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/favorites');
                        setAnchorEl(null);
                      }}
                      sx={{ py: 1.5, px: 2.5, display: { sm: 'none' } }}
                    >
                      <Favorite sx={{ mr: 2, color: '#FF385C', fontSize: 24 }} />
                      <Typography variant="body2" fontWeight={600}>المفضلة</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        color: 'error.main',
                        '&:hover': { bgcolor: alpha('#d32f2f', 0.08) },
                      }}
                    >
                      <LogoutIcon sx={{ mr: 2, fontSize: 24 }} />
                      <Typography variant="body2" fontWeight={600}>تسجيل الخروج</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="text"
                    startIcon={!isMobile && <LoginIcon sx={{ ml: 1 }} />}
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: 10,
                      px: 3,
                      py: 1.2,
                      color: 'text.primary',
                      fontWeight: 600,
                      gap: 1,
                      '&:hover': {
                        bgcolor: alpha('#FF385C', 0.05),
                      },
                    }}
                  >
                    {isMobile ? <LoginIcon /> : 'دخول'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderRadius: 10,
                      px: 3.5,
                      py: 1.2,
                      bgcolor: '#FF385C',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(255, 56, 92, 0.3)',
                      '&:hover': {
                        bgcolor: '#E61E4D',
                        boxShadow: '0 6px 20px rgba(255, 56, 92, 0.4)',
                      },
                    }}
                  >
                    {isMobile ? 'تسجيل' : 'إنشاء حساب'}
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>

          {/* Mobile Search Bar */}
          {isMobile && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 10,
                  px: 2,
                  py: 1,
                  bgcolor: alpha('#000', 0.03),
                  border: '2px solid transparent',
                  '&:focus-within': {
                    bgcolor: 'white',
                    borderColor: '#FF385C',
                  },
                }}
              >
                <SearchIcon sx={{ color: '#FF385C', mr: 1 }} />
                <TextField
                  placeholder="ابحث..."
                  variant="standard"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: '0.9rem' },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    borderRadius: 8,
                    minWidth: 60,
                    bgcolor: '#FF385C',
                    '&:hover': { bgcolor: '#E61E4D' },
                  }}
                >
                  بحث
                </Button>
              </Paper>
            </Box>
          )}
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 3, bgcolor: alpha('#FF385C', 0.08) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF385C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalOffer sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="900" sx={{ color: '#FF385C' }}>
                  حراج
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  اشتري وبيع بسهولة
                </Typography>
              </Box>
            </Box>
          </Box>

          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate('/listings');
                  setMobileMenuOpen(false);
                }}
                sx={{ py: 1.5, px: 2.5 }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <TrendingUp sx={{ color: '#FF385C', fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary="جميع الإعلانات"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem' }}
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem>
              <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ px: 2.5 }}>
                الفئات
              </Typography>
            </ListItem>

            {categories.slice(0, 8).map((cat) => (
              <ListItem key={cat.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(`/listings?category=${cat.id}`);
                    setMobileMenuOpen(false);
                  }}
                  sx={{ py: 1.5, px: 2.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    {getCategoryIcon(cat.nameAr)}
                  </ListItemIcon>
                  <ListItemText
                    primary={cat.nameAr}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
