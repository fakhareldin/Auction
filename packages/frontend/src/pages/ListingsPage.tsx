import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Pagination,
  InputAdornment,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList,
  Close,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { listingService } from '../services/listing.service';
import { categoryService } from '../services/category.service';
import type { Listing, Category, ListingCondition } from '@haraj/shared';
import { CITIES } from '../constants/cities';

export default function ListingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadListings();
  }, [page, sortBy, sortOrder]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const filters: any = {
        page,
        limit: 12,
        sortBy,
        sortOrder,
      };

      if (search) filters.search = search;
      if (selectedCategory) filters.categoryId = selectedCategory;
      if (selectedCity) filters.city = selectedCity;
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (condition) filters.condition = condition;

      const response = await listingService.getListings(filters);
      setListings(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    updateSearchParams();
    loadListings();
    if (isMobile) setDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedCity('');
    setMinPrice('');
    setMaxPrice('');
    setCondition('');
    setPage(1);
    setSearchParams({});
    loadListings();
  };

  const updateSearchParams = () => {
    const params: any = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedCity) params.city = selectedCity;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (condition) params.condition = condition;
    if (page > 1) params.page = page.toString();
    if (sortBy !== 'createdAt') params.sortBy = sortBy;
    if (sortOrder !== 'desc') params.sortOrder = sortOrder;
    setSearchParams(params);
  };

  const FilterContent = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="800">
            الفلاتر
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <Close />
          </IconButton>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="ابحث عن أي شيء..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>الفئة</InputLabel>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="الفئة">
          <MenuItem value="">جميع الفئات</MenuItem>
          {categories
            .filter((cat) => !cat.parentId)
            .map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nameAr}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>المدينة</InputLabel>
        <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} label="المدينة">
          <MenuItem value="">جميع المدن</MenuItem>
          {CITIES.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>الحالة</InputLabel>
        <Select value={condition} onChange={(e) => setCondition(e.target.value)} label="الحالة">
          <MenuItem value="">جميع الحالات</MenuItem>
          <MenuItem value="NEW">جديد</MenuItem>
          <MenuItem value="USED_LIKE_NEW">مستعمل كالجديد</MenuItem>
          <MenuItem value="USED_GOOD">مستعمل بحالة جيدة</MenuItem>
          <MenuItem value="USED_FAIR">مستعمل بحالة مقبولة</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        السعر
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          placeholder="من"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          size="small"
        />
        <TextField
          placeholder="إلى"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          size="small"
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>ترتيب حسب</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          label="ترتيب حسب"
        >
          <MenuItem value="createdAt">الأحدث</MenuItem>
          <MenuItem value="price">السعر</MenuItem>
          <MenuItem value="viewCount">الأكثر مشاهدة</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>الترتيب</InputLabel>
        <Select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          label="الترتيب"
        >
          <MenuItem value="desc">تنازلي</MenuItem>
          <MenuItem value="asc">تصاعدي</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        onClick={handleSearch}
        sx={{
          mb: 1.5,
          borderRadius: 3,
          py: 1.5,
          fontWeight: 700,
        }}
      >
        🔍 تطبيق الفلاتر
      </Button>
      <Button
        variant="outlined"
        fullWidth
        onClick={handleClearFilters}
        sx={{
          borderRadius: 3,
          py: 1.5,
          fontWeight: 600,
        }}
      >
        مسح الكل
      </Button>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color="primary.main" gutterBottom>
              🔍 استكشف الإعلانات
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ابحث عن ما تريد من بين آلاف الإعلانات
            </Typography>
          </Box>
          {isMobile && (
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={() => setDrawerOpen(true)}
              sx={{ borderRadius: 3 }}
            >
              الفلاتر
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Paper sx={{ position: 'sticky', top: 20 }}>
                <FilterContent />
              </Paper>
            </Grid>
          )}

          {/* Listings Grid */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography>جاري التحميل...</Typography>
              </Box>
            ) : listings.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {listings.map((listing) => (
                    <Grid item xs={12} sm={6} lg={4} key={listing.id}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: theme.palette.mode === 'light'
                              ? '0 12px 40px rgba(0,0,0,0.12)'
                              : '0 12px 40px rgba(0,0,0,0.4)',
                            borderColor: 'primary.main',
                          },
                        }}
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        <CardMedia
                          component="div"
                          sx={{
                            height: 220,
                            bgcolor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {listing.images && listing.images[0] ? (
                            <img
                              src={listing.images[0].url}
                              alt={listing.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <CategoryIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                          )}
                        </CardMedia>
                        <CardContent>
                          <Typography variant="h6" gutterBottom noWrap fontWeight="600">
                            {listing.title}
                          </Typography>
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
                              minHeight: 40,
                            }}
                          >
                            {listing.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                              {Number(listing.price).toLocaleString('ar-SA')} ر.س
                            </Typography>
                            {listing.negotiable && <Chip label="قابل للتفاوض" size="small" color="secondary" />}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            📍 {listing.city}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => {
                        setPage(value);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper
                sx={{
                  p: 8,
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Typography variant="h1">🔍</Typography>
                </Box>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                  لم نجد نتائج
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  جرب تغيير الفلاتر أو البحث بكلمات مختلفة
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{ borderRadius: 3 }}
                >
                  مسح جميع الفلاتر
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300 }}>
          <FilterContent />
        </Box>
      </Drawer>
    </Box>
  );
}
