import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Add,
  Visibility,
  LocalOffer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../services/listing.service';
import { Listing, ListingStatus } from '@haraj/shared';
import { useAuth } from '../hooks/useAuth';

export default function MyListingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadListings();
  }, [isAuthenticated, navigate, page]);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listingService.getMyListings(page, 20);
      setListings(response.data);
      setHasMore(response.pagination.page < response.pagination.pages);
    } catch (err: any) {
      setError('حدث خطأ أثناء تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, listingId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleEdit = (listingId: string) => {
    navigate(`/listings/${listingId}/edit`);
    handleMenuClose();
  };

  const handleView = (listingId: string) => {
    navigate(`/listings/${listingId}`);
    handleMenuClose();
  };

  const handleDelete = async (listingId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      handleMenuClose();
      return;
    }

    try {
      await listingService.deleteListing(listingId);
      setSuccess('تم حذف الإعلان بنجاح');
      setListings(listings.filter((l) => l.id !== listingId));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('حدث خطأ أثناء حذف الإعلان');
    } finally {
      handleMenuClose();
    }
  };

  const getStatusColor = (status: ListingStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'SOLD':
        return 'default';
      case 'DRAFT':
        return 'warning';
      case 'EXPIRED':
        return 'error';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ListingStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'SOLD':
        return 'مباع';
      case 'DRAFT':
        return 'مسودة';
      case 'EXPIRED':
        return 'منتهي';
      case 'REJECTED':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'NEW':
        return 'جديد';
      case 'USED_LIKE_NEW':
        return 'مستعمل كالجديد';
      case 'USED_GOOD':
        return 'مستعمل حالة جيدة';
      case 'USED_FAIR':
        return 'مستعمل حالة مقبولة';
      default:
        return condition;
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (currentTab === 'all') return true;
    if (currentTab === 'active') return listing.status === 'ACTIVE';
    if (currentTab === 'sold') return listing.status === 'SOLD';
    if (currentTab === 'draft') return listing.status === 'DRAFT';
    return true;
  });

  const stats = {
    all: listings.length,
    active: listings.filter((l) => l.status === 'ACTIVE').length,
    sold: listings.filter((l) => l.status === 'SOLD').length,
    draft: listings.filter((l) => l.status === 'DRAFT').length,
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            إعلاناتي
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/listings/create')}
            sx={{
              bgcolor: '#FF385C',
              '&:hover': { bgcolor: '#E61E4D' },
            }}
          >
            إضافة إعلان جديد
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label={`الكل (${stats.all})`} value="all" />
            <Tab label={`نشط (${stats.active})`} value="active" />
            <Tab label={`مباع (${stats.sold})`} value="sold" />
            <Tab label={`مسودات (${stats.draft})`} value="draft" />
          </Tabs>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              لا توجد إعلانات
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {currentTab === 'all'
                ? 'لم تقم بإضافة أي إعلانات بعد'
                : `لا توجد إعلانات ${
                    currentTab === 'active'
                      ? 'نشطة'
                      : currentTab === 'sold'
                      ? 'مباعة'
                      : 'مسودات'
                  }`}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/listings/create')}
              sx={{
                bgcolor: '#FF385C',
                '&:hover': { bgcolor: '#E61E4D' },
              }}
            >
              إضافة إعلان جديد
            </Button>
          </Box>
        )}

        {/* Listings Grid */}
        {!loading && filteredListings.length > 0 && (
          <Grid container spacing={3}>
            {filteredListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        listing.images && listing.images.length > 0
                          ? listing.images[0].url
                          : 'https://via.placeholder.com/400x300?text=لا+توجد+صورة'
                      }
                      alt={listing.title}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleView(listing.id)}
                    />
                    <Chip
                      label={getStatusLabel(listing.status)}
                      color={getStatusColor(listing.status)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    />
                    {listing.isFeatured && (
                      <Chip
                        label="مميز"
                        color="warning"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                        }}
                      />
                    )}
                  </Box>

                  {/* Content */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleView(listing.id)}
                    >
                      {listing.title}
                    </Typography>

                    <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                      {Number(listing.price).toLocaleString('ar-SA')} ج.س
                      {listing.negotiable && (
                        <Chip label="قابل للتفاوض" size="small" sx={{ mr: 1 }} />
                      )}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip label={listing.city} size="small" variant="outlined" />
                      <Chip label={getConditionLabel(listing.condition)} size="small" variant="outlined" />
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Visibility fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {listing.viewCount}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(listing.createdAt).toLocaleDateString('ar-SA')}
                      </Typography>
                    </Stack>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(listing.id)}
                    >
                      تعديل
                    </Button>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, listing.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedListing && handleView(selectedListing)}>
            <Visibility fontSize="small" sx={{ mr: 1 }} />
            عرض الإعلان
          </MenuItem>
          <MenuItem onClick={() => selectedListing && handleEdit(selectedListing)}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            تعديل
          </MenuItem>
          <MenuItem
            onClick={() => selectedListing && handleDelete(selectedListing)}
            sx={{ color: 'error.main' }}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} />
            حذف
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}
