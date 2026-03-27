import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import { Edit, PhotoCamera, Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CITIES } from '../constants/cities';
import { userService } from '../services/user.service';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [stats, setStats] = useState({ listingsCount: 0, favoritesCount: 0, messagesCount: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Initialize form with user data
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setCity(user.city || '');
      setPhoneNumber(user.phoneNumber || '');
      setBio(user.bio || '');
    }

    // Load user statistics
    loadStats();
  }, [isAuthenticated, user, navigate]);

  const loadStats = async () => {
    try {
      const userStats = await userService.getUserStats();
      setStats(userStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateProfile({
        firstName,
        lastName,
        city,
        phoneNumber: phoneNumber || undefined,
        bio: bio || undefined,
      });

      setSuccess('تم تحديث الملف الشخصي بنجاح!');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setCity(user.city || '');
      setPhoneNumber(user.phoneNumber || '');
      setBio(user.bio || '');
    }
    setEditing(false);
    setError('');
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              الملف الشخصي
            </Typography>
            {!editing && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
              >
                تعديل
              </Button>
            )}
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

          {/* Avatar Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#FF385C',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </Avatar>
              {editing && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'grey.200' },
                  }}
                  component="label"
                >
                  <PhotoCamera />
                  <input type="file" hidden accept="image/*" />
                </IconButton>
              )}
            </Box>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Form */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الاسم الأول"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!editing}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="اسم العائلة"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!editing}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                value={user.email}
                disabled
                helperText="لا يمكن تغيير البريد الإلكتروني"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="رقم الجوال"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!editing}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="المدينة"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!editing}
                SelectProps={{ native: true }}
              >
                <option value="">اختر المدينة</option>
                {CITIES.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                عضو منذ {new Date(user.createdAt || '').toLocaleDateString('ar-SA')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="نبذة عني (اختياري)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!editing}
                multiline
                rows={4}
                placeholder="اكتب نبذة مختصرة عنك..."
              />
            </Grid>

            {editing && (
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      bgcolor: '#FF385C',
                      '&:hover': { bgcolor: '#E61E4D' },
                    }}
                  >
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Statistics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {stats.listingsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  إعلاناتي
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {stats.favoritesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  المفضلة
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {stats.messagesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  الرسائل
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
