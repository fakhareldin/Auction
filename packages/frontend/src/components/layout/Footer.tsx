import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? '#0f172a' : '#020617',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 8,
        borderTop: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#1e293b' : '#0f172a',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              عن حراج
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              منصة حراج السودان هي أكبر موقع للإعلانات المبوبة في السودان. نوفر لك فرصة بيع وشراء السلع والخدمات بكل سهولة وأمان.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  '&:hover': { bgcolor: 'primary.main' },
                }}
                href="https://facebook.com"
                target="_blank"
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  '&:hover': { bgcolor: 'primary.main' },
                }}
                href="https://twitter.com"
                target="_blank"
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  '&:hover': { bgcolor: 'primary.main' },
                }}
                href="https://instagram.com"
                target="_blank"
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  '&:hover': { bgcolor: 'primary.main' },
                }}
                href="https://youtube.com"
                target="_blank"
              >
                <YouTube />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              روابط سريعة
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                الرئيسية
              </Link>
              <Link
                component={RouterLink}
                to="/listings"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                تصفح الإعلانات
              </Link>
              <Link
                component={RouterLink}
                to="/listings/create"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                إضافة إعلان
              </Link>
              <Link
                component={RouterLink}
                to="/my-listings"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                إعلاناتي
              </Link>
              <Link
                component={RouterLink}
                to="/messages"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                الرسائل
              </Link>
            </Stack>
          </Grid>

          {/* Help & Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              المساعدة والدعم
            </Typography>
            <Stack spacing={1}>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                كيفية الاستخدام
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                الأسئلة الشائعة
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                شروط الاستخدام
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                اتصل بنا
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              تواصل معنا
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  +249 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  info@haraj-sudan.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: 'primary.main', mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  الخرطوم، السودان
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © {currentYear} حراج السودان. جميع الحقوق محفوظة.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />}
          >
            <Link
              href="#"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.main' },
                transition: 'color 0.2s',
              }}
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="#"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.main' },
                transition: 'color 0.2s',
              }}
            >
              شروط الاستخدام
            </Link>
            <Link
              href="#"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.main' },
                transition: 'color 0.2s',
              }}
            >
              خريطة الموقع
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
