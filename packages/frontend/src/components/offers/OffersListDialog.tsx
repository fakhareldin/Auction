import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Check, Close, Reply } from '@mui/icons-material';
import { offerService } from '../../services/offer.service';

interface OffersListDialogProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

export default function OffersListDialog({
  open,
  onClose,
  listingId,
  listingTitle,
}: OffersListDialogProps) {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [sellerMessage, setSellerMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadOffers();
    }
  }, [open, listingId]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await offerService.getListingOffers(listingId);
      setOffers(data);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل العروض');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offerId: string) => {
    setActionLoading(true);
    try {
      await offerService.updateOffer(offerId, { status: 'ACCEPTED' });
      await loadOffers();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'حدث خطأ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (offerId: string) => {
    setActionLoading(true);
    try {
      await offerService.updateOffer(offerId, {
        status: 'REJECTED',
        sellerMessage: sellerMessage.trim() || undefined,
      });
      await loadOffers();
      setSellerMessage('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'حدث خطأ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCounter = async (offerId: string) => {
    if (!counterAmount || Number(counterAmount) <= 0) {
      setError('يرجى إدخال مبلغ صحيح للعرض المضاد');
      return;
    }

    setActionLoading(true);
    try {
      await offerService.updateOffer(offerId, {
        status: 'COUNTERED',
        counterAmount: Number(counterAmount),
        sellerMessage: sellerMessage.trim() || undefined,
      });
      await loadOffers();
      setReplyingTo(null);
      setCounterAmount('');
      setSellerMessage('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'حدث خطأ');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'COUNTERED':
        return 'info';
      case 'WITHDRAWN':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'قيد الانتظار';
      case 'ACCEPTED':
        return 'مقبول';
      case 'REJECTED':
        return 'مرفوض';
      case 'COUNTERED':
        return 'عرض مضاد';
      case 'WITHDRAWN':
        return 'مسحوب';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        العروض المستلمة
        <Typography variant="body2" color="text.secondary">
          {listingTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : offers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">لا توجد عروض على هذا الإعلان بعد</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {offers.map((offer) => (
              <Card key={offer.id} variant="outlined">
                <CardContent>
                  {/* Buyer Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#FF385C', mr: 2 }}>
                      {offer.buyer.firstName[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {offer.buyer.firstName} {offer.buyer.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(offer.createdAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusLabel(offer.status)}
                      color={getStatusColor(offer.status)}
                      size="small"
                    />
                  </Box>

                  {/* Offer Amount */}
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {Number(offer.amount).toLocaleString('ar-SA')} ج.س
                  </Typography>

                  {/* Buyer Message */}
                  {offer.message && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      "{offer.message}"
                    </Typography>
                  )}

                  {/* Counter Offer */}
                  {offer.counterAmount && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="600">
                        عرضك المضاد: {Number(offer.counterAmount).toLocaleString('ar-SA')} ج.س
                      </Typography>
                      {offer.sellerMessage && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          "{offer.sellerMessage}"
                        </Typography>
                      )}
                    </Alert>
                  )}

                  {/* Actions for Pending Offers */}
                  {offer.status === 'PENDING' && (
                    <Box sx={{ mt: 2 }}>
                      {replyingTo === offer.id ? (
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            label="العرض المضاد"
                            type="number"
                            value={counterAmount}
                            onChange={(e) => setCounterAmount(e.target.value)}
                            sx={{ mb: 1 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">ج.س</InputAdornment>,
                            }}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="رسالة (اختياري)"
                            multiline
                            rows={2}
                            value={sellerMessage}
                            onChange={(e) => setSellerMessage(e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              onClick={() => handleCounter(offer.id)}
                              disabled={actionLoading}
                              variant="contained"
                            >
                              إرسال العرض المضاد
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setReplyingTo(null);
                                setCounterAmount('');
                                setSellerMessage('');
                              }}
                              disabled={actionLoading}
                            >
                              إلغاء
                            </Button>
                          </Stack>
                        </Box>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<Check />}
                            onClick={() => handleAccept(offer.id)}
                            disabled={actionLoading}
                          >
                            قبول
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Reply />}
                            onClick={() => setReplyingTo(offer.id)}
                            disabled={actionLoading}
                          >
                            عرض مضاد
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Close />}
                            onClick={() => handleReject(offer.id)}
                            disabled={actionLoading}
                          >
                            رفض
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
}
