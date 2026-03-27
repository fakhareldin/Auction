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
  CircularProgress,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { listingService } from '../services/listing.service';
import { categoryService } from '../services/category.service';
import { useAuth } from '../hooks/useAuth';
import type { Category, Listing } from '@haraj/shared';
import { CITIES } from '../constants/cities';

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, id]);

  const loadData = async () => {
    try {
      const [categoriesData, listingData] = await Promise.all([
        categoryService.getAllCategories(),
        listingService.getListingById(id!),
      ]);

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // Check if user owns this listing
      if (listingData.userId !== user?.id) {
        setError('ليس لديك صلاحية لتعديل هذا الإعلان');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      // Populate form with existing data
      setTitle(listingData.title);
      setDescription(listingData.description);
      setPrice(listingData.price.toString());
      setNegotiable(listingData.negotiable);
      setCondition(listingData.condition);
      setCategoryId(listingData.categoryId);
      setCity(listingData.city);
      setDistrict(listingData.district || '');
      setExistingImages(listingData.images || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 10) {
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

    setNewImages([...newImages, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const handleRemoveExistingImage = async (imageId: string) => {
    try {
      await listingService.deleteImage(imageId);
      setExistingImages(existingImages.filter(img => img.id !== imageId));
    } catch (err) {
      setError('حدث خطأ أثناء حذف الصورة');
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
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

    setSubmitting(true);
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

      await listingService.updateListing(id!, listingData);

      // Upload new images if any
      if (newImages.length > 0) {
        await listingService.uploadImages(id!, newImages);
      }

      setSuccess('تم تحديث الإعلان بنجاح!');
      setTimeout(() => {
        navigate(`/listings/${id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الإعلان');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            تعديل الإعلان
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            قم بتحديث تفاصيل إعلانك
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
                  <Select value={condition} onChange={(e) => setCondition(e.target.value)} label="الحالة">
                    <MenuItem value="NEW">جديد</MenuItem>
                    <MenuItem value="USED_LIKE_NEW">مستعمل كالجديد</MenuItem>
                    <MenuItem value="USED_GOOD">مستعمل بحالة جيدة</MenuItem>
                    <MenuItem value="USED_FAIR">مستعمل بحالة مقبولة</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>الفئة</InputLabel>
                  <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} label="الفئة">
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
                  <Select value={city} onChange={(e) => setCity(e.target.value)} label="المدينة">
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
                  placeholder="مثال: الملقا"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </Grid>

              {/* Images */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  الصور (حتى 10 صور)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  الحجم الأقصى لكل صورة 5 ميجابايت. الصيغ المدعومة: JPG, PNG, WebP
                </Typography>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="600" gutterBottom>
                      الصور الحالية ({existingImages.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {existingImages.map((image) => (
                        <Grid item xs={6} sm={4} md={3} key={image.id}>
                          <Card sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="150"
                              image={image.url}
                              alt="Listing image"
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
                              onClick={() => handleRemoveExistingImage(image.id)}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Add New Images */}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  disabled={existingImages.length + newImages.length >= 10}
                >
                  إضافة صور جديدة
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageSelect}
                  />
                </Button>

                {newImagePreviews.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight="600" gutterBottom>
                      صور جديدة ({newImagePreviews.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {newImagePreviews.map((preview, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Card sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="150"
                              image={preview}
                              alt={`New ${index + 1}`}
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
                              onClick={() => handleRemoveNewImage(index)}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(`/listings/${id}`)}
                    disabled={submitting}
                  >
                    إلغاء
                  </Button>
                  <Button variant="contained" size="large" type="submit" disabled={submitting}>
                    {submitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
