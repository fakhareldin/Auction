import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  alpha,
  Stack,
  Divider,
  Grid,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LocalOffer,
  Email,
  Lock,
  Person,
  Phone,
  LocationOn,
  PersonAdd,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CITIES } from '../constants/cities';

export default function RegisterPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { register, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    city: '',
    phoneNumber: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'فشل إنشاء الحساب';
      setLocalError(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
          : 'linear-gradient(135deg, #1e40af 0%, #6b21a8 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
          }}
        >
          {/* Logo */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1,
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF385C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255, 56, 92, 0.25)',
              }}
            >
              <LocalOffer sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF385C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                حراج
              </Typography>
              <Typography variant="caption" color="text.secondary">
                اشتري وبيع بسهولة
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h3"
            fontWeight="900"
            gutterBottom
            sx={{
              mt: 3,
              mb: 1,
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #f1f5f9 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ✨ انضم إلى حراج السودان
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
            أنشئ حسابك الآن وابدأ رحلتك في البيع والشراء بكل سهولة
          </Typography>

          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {localError || error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="الاسم الأول"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="اسم العائلة"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  label="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="كلمة المرور"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="city"
                  label="المدينة"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                >
                  {CITIES.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="رقم الجوال (اختياري)"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  startIcon={<PersonAdd />}
                  sx={{
                    borderRadius: 3,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                    boxShadow: 4,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  {isLoading ? '⏳ جاري إنشاء الحساب...' : '🚀 إنشاء حساب جديد'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Divider sx={{ my: 4 }}>أو</Divider>

          <Typography variant="body1" color="text.secondary">
            لديك حساب بالفعل؟{' '}
            <Link
              component="button"
              onClick={() => navigate('/login')}
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              تسجيل الدخول 🔐
            </Link>
          </Typography>

          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{
              mt: 3,
              color: 'text.secondary',
              fontWeight: 600,
              borderRadius: 3,
              py: 1.5,
              px: 4,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            🏠 العودة إلى الصفحة الرئيسية
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
