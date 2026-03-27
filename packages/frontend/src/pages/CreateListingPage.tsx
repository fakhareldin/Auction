import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  IconButton,
  Card,
  CardMedia,
  useTheme,
  alpha,
} from '@mui/material';
import { PhotoCamera, Close, AddCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../services/listing.service';
import { categoryService } from '../services/category.service';
import { useAuth } from '../hooks/useAuth';
import type { Category } from '@haraj/shared';
import { CITIES } from '../constants/cities';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [condition, setCondition] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCategories();
  }, [isAuthenticated]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 10) {
      setError('يمكنك رفع 10 صور كحد أقصى');
      return;
    }

    // Validate file size (5MB max per image)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidTypes = files.filter(file => !validTypes.includes(file.type));
    if (invalidTypes.length > 0) {
      setError('نوع الملف غير مدعوم. يرجى رفع صور بصيغة JPG, PNG أو WebP');
      return;
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    if (!title.trim()) {
      setError('العنوان مطلوب');
      return false;
    }

    if (title.length < 10) {
      setError('العنوان يجب أن يكون 10 أحرف على الأقل');
      return false;
    }

    if (!description.trim()) {
      setError('الوصف مطلوب');
      return false;
    }

    if (description.length < 20) {
      setError('الوصف يجب أن يكون 20 حرف على الأقل');
      return false;
    }

    if (!price || Number(price) <= 0) {
      setError('السعر يجب أن يكون أكبر من صفر');
      return false;
    }

    if (!condition) {
      setError('الحالة مطلوبة');
      return false;
    }

    if (!categoryId) {
      setError('الفئة مطلوبة');
      return false;
    }

    if (!city) {
      setError('المدينة مطلوبة');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const listingData = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        negotiable,
        condition,
        categoryId,
        city,
        district: district.trim() || undefined,
      };

      const newListing = await listingService.createListing(listingData);

      // Upload images if any
      if (images.length > 0) {
        await listingService.uploadImages(newListing.id, images);
      }

      setSuccess('تم إنشاء الإعلان بنجاح!');
      setTimeout(() => {
        navigate(`/listings/${newListing.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء الإعلان');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 4,
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h3"
            fontWeight="900"
            gutterBottom
            sx={{
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #f1f5f9 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            📢 إنشاء إعلان جديد
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
            املأ البيانات التالية لنشر إعلانك ومشاركته مع الآلاف من المشترين
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="عنوان الإعلان"
                  placeholder="مثال: آيفون 15 برو ماكس للبيع"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  helperText={`${title.length}/100`}
                  inputProps={{ maxLength: 100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="الوصف"
                  placeholder="اكتب وصفاً تفصيلياً للمنتج..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  multiline
                  rows={6}
                  helperText={`${description.length}/2000 - اكتب وصفاً دقيقاً يساعد المشترين`}
                  inputProps={{ maxLength: 2000 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              {/* Price */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="السعر (جنيه سوداني)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>ج.س</Typography>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              {/* Negotiable */}
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} />
                  }
                  label="السعر قابل للتفاوض"
                  sx={{ mt: 2 }}
                />
              </Grid>

              {/* Condition */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>الحالة</InputLabel>
                  <Select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    label="الحالة"
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    <MenuItem value="NEW">🆕 جديد</MenuItem>
                    <MenuItem value="USED_LIKE_NEW">✨ مستعمل كالجديد</MenuItem>
                    <MenuItem value="USED_GOOD">👍 مستعمل بحالة جيدة</MenuItem>
                    <MenuItem value="USED_FAIR">👌 مستعمل بحالة مقبولة</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>الفئة</InputLabel>
                  <Select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    label="الفئة"
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    {categories
                      .filter((cat) => !cat.parentId)
                      .map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.nameAr}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>المدينة</InputLabel>
                  <Select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    label="المدينة"
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    {CITIES.map((cityName) => (
                      <MenuItem key={cityName} value={cityName}>
                        {cityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* District */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الحي (اختياري)"
                  placeholder="مثال: بحري"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              {/* Images Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="700" gutterBottom color="primary.main">
                  📸 الصور (اختياري - حتى 10 صور)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  الحجم الأقصى لكل صورة 5 ميجابايت. الصيغ المدعومة: JPG, PNG, WebP
                </Typography>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  disabled={images.length >= 10}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                  }}
                >
                  اختر صور
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageSelect}
                  />
                </Button>

                {imagePreviews.length > 0 && (
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {imagePreviews.map((preview, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Card sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="150"
                            image={preview}
                            alt={`Preview ${index + 1}`}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'white',
                              '&:hover': { bgcolor: 'grey.200' },
                            }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    startIcon={<Cancel />}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      px: 4,
                      fontWeight: 600,
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    startIcon={<AddCircle />}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      px: 4,
                      fontWeight: 700,
                      boxShadow: 4,
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    {loading ? '⏳ جاري النشر...' : '🚀 نشر الإعلان'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Tips Card */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mt: 3,
            borderRadius: 4,
            bgcolor: theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.primary.main, 0.1),
            border: '1px solid',
            borderColor: theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.primary.main, 0.2),
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
            💡 نصائح لإعلان ناجح
          </Typography>
          <Typography variant="body2" component="div" sx={{ lineHeight: 2, color: 'text.primary' }}>
            ✓ اكتب عنواناً واضحاً ومحدداً
            <br />
            ✓ أضف وصفاً تفصيلياً يشمل المواصفات والحالة
            <br />
            ✓ ارفع صوراً واضحة من زوايا مختلفة
            <br />
            ✓ حدد سعراً مناسباً وواقعياً
            <br />
            ✓ كن صادقاً في وصف حالة المنتج
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
