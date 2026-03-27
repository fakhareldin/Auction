import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  IconButton,
  Breadcrumbs,
  Link,
  Badge,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  Message,
  Phone,
  LocationOn,
  Category as CategoryIcon,
  NavigateNext,
  LocalOffer,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { listingService } from '../services/listing.service';
import { offerService } from '../services/offer.service';
import { useAuth } from '../hooks/useAuth';
import type { Listing } from '@haraj/shared';
import MakeOfferDialog from '../components/offers/MakeOfferDialog';
import OffersListDialog from '../components/offers/OffersListDialog';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [makeOfferOpen, setMakeOfferOpen] = useState(false);
  const [offersListOpen, setOffersListOpen] = useState(false);
  const [offersCount, setOffersCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadListing();
    }
  }, [id]);

  const loadListing = async () => {
    try {
      const data = await listingService.getListingById(id!);
      setListing(data);

      // If user is the owner, load offers count
      if (user?.id === data.userId) {
        loadOffersCount();
      }
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOffersCount = async () => {
    try {
      const offers = await offerService.getListingOffers(id!);
      const pendingCount = offers.filter((o: any) => o.status === 'PENDING').length;
      setOffersCount(pendingCount);
    } catch (error) {
      console.error('Error loading offers count:', error);
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      NEW: '🆕 جديد',
      USED_LIKE_NEW: '✨ مستعمل كالجديد',
      USED_GOOD: '👍 مستعمل بحالة جيدة',
      USED_FAIR: '👌 مستعمل بحالة مقبولة',
    };
    return labels[condition] || condition;
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/messages?user=${listing?.userId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" color="text.secondary">⏳ جاري التحميل...</Typography>
        </Box>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 4,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="700">
              😕 الإعلان غير موجود
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              عذراً، لم نتمكن من العثور على الإعلان المطلوب
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/listings')}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 4,
                fontWeight: 700,
              }}
            >
              🔍 العودة للإعلانات
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const isOwner = user?.id === listing.userId;
  const images = listing.images || [];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
          <Link underline="hover" color="primary.main" href="/" sx={{ cursor: 'pointer', fontWeight: 500 }}>
            الرئيسية
          </Link>
          <Link underline="hover" color="primary.main" href="/listings" sx={{ cursor: 'pointer', fontWeight: 500 }}>
            الإعلانات
          </Link>
          <Typography color="text.primary" fontWeight="600">{listing.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={3}>
          {/* Images Section */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                overflow: 'hidden',
                borderRadius: 4,
                bgcolor: 'background.paper',
              }}
            >
              {/* Main Image */}
              <Box
                sx={{
                  height: 500,
                  bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]?.url}
                    alt={listing.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <CategoryIcon sx={{ fontSize: 100, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      لا توجد صور
                    </Typography>
                  </Box>
                )}

                {/* Share & Favorite Buttons */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                  <IconButton
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'background.paper', boxShadow: 4 },
                    }}
                    onClick={handleShare}
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'background.paper', boxShadow: 4 },
                    }}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Box>
              </Box>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                  {images.map((image, index) => (
                    <Box
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 100,
                        height: 100,
                        flexShrink: 0,
                        cursor: 'pointer',
                        border: selectedImage === index ? 3 : 1,
                        borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`${listing.title} ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            {/* Description */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mt: 3,
                borderRadius: 4,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main">
                📝 الوصف
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 2, mt: 2 }}>
                {listing.description}
              </Typography>
            </Paper>

            {/* Details */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mt: 3,
                borderRadius: 4,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main" sx={{ mb: 3 }}>
                📋 التفاصيل
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    الحالة
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {getConditionLabel(listing.condition)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    السعر قابل للتفاوض
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {listing.negotiable ? 'نعم' : 'لا'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    المدينة
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    📍 {listing.city}
                  </Typography>
                </Grid>
                {listing.district && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      الحي
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {listing.district}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    تاريخ النشر
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {new Date(listing.createdAt).toLocaleDateString('ar-SA')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    رقم الإعلان
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ fontSize: '0.9rem' }}>
                    {listing.id.substring(0, 8)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Price Card */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                position: 'sticky',
                top: 20,
                borderRadius: 4,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h3" color="primary.main" fontWeight="900" gutterBottom>
                {Number(listing.price).toLocaleString('ar-SA')} ج.س
              </Typography>

              {listing.negotiable && (
                <Chip
                  label="💬 السعر قابل للتفاوض"
                  color="secondary"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                />
              )}

              <Divider sx={{ my: 2 }} />

              {/* Seller Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                  {listing.user?.firstName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {listing.user?.firstName} {listing.user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    عضو منذ {new Date(listing.user?.createdAt || '').getFullYear()}
                  </Typography>
                </Box>
              </Box>

              {!isOwner ? (
                <>
                  {listing.negotiable && listing.status === 'ACTIVE' && (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<LocalOffer />}
                      onClick={() => setMakeOfferOpen(true)}
                      sx={{
                        mb: 2,
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 700,
                        bgcolor: 'secondary.main',
                        boxShadow: 4,
                        '&:hover': {
                          bgcolor: 'secondary.dark',
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      💰 تقديم عرض سعر
                    </Button>
                  )}
                  <Button
                    variant={listing.negotiable ? 'outlined' : 'contained'}
                    fullWidth
                    size="large"
                    startIcon={<Message />}
                    onClick={handleContactSeller}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      ...(!listing.negotiable && {
                        boxShadow: 4,
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s',
                      }),
                    }}
                  >
                    💬 تواصل مع البائع
                  </Button>
                  {listing.user?.phoneNumber && (
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      startIcon={<Phone />}
                      href={`tel:${listing.user.phoneNumber}`}
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 700,
                      }}
                    >
                      📞 اتصل الآن
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {listing.negotiable && (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={
                        <Badge badgeContent={offersCount} color="error">
                          <Visibility />
                        </Badge>
                      }
                      onClick={() => setOffersListOpen(true)}
                      sx={{
                        mb: 2,
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 700,
                        bgcolor: 'secondary.main',
                        boxShadow: 4,
                        '&:hover': {
                          bgcolor: 'secondary.dark',
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      👁️ عرض العروض ({offersCount})
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/listings/${listing.id}/edit`)}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                    }}
                  >
                    ✏️ تعديل الإعلان
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    color="error"
                    startIcon={<Delete />}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                    }}
                  >
                    🗑️ حذف الإعلان
                  </Button>
                </>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Safety Tips */}
              <Card
                sx={{
                  bgcolor: theme.palette.mode === 'light'
                    ? alpha(theme.palette.warning.main, 0.05)
                    : alpha(theme.palette.warning.main, 0.1),
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'light'
                    ? alpha(theme.palette.warning.main, 0.2)
                    : alpha(theme.palette.warning.main, 0.3),
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="700" gutterBottom color="warning.main">
                    🛡️ نصائح السلامة
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 2 }}>
                    ✓ التقي بالبائع في مكان عام آمن
                    <br />
                    ✓ افحص المنتج قبل الدفع
                    <br />
                    ✓ لا تدفع مقدماً أو تحول مبالغ
                    <br />
                    ✓ تجنب المعاملات المشبوهة
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Make Offer Dialog (for buyers) */}
      {!isOwner && listing && (
        <MakeOfferDialog
          open={makeOfferOpen}
          onClose={() => setMakeOfferOpen(false)}
          listingId={listing.id}
          listingTitle={listing.title}
          listingPrice={Number(listing.price)}
        />
      )}

      {/* Offers List Dialog (for sellers) */}
      {isOwner && listing && (
        <OffersListDialog
          open={offersListOpen}
          onClose={() => {
            setOffersListOpen(false);
            loadOffersCount(); // Refresh count when closing
          }}
          listingId={listing.id}
          listingTitle={listing.title}
        />
      )}
    </Box>
  );
}
