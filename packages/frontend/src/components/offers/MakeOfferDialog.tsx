import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  InputAdornment,
} from '@mui/material';
import { offerService } from '../../services/offer.service';

interface MakeOfferDialogProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
}

export default function MakeOfferDialog({
  open,
  onClose,
  listingId,
  listingTitle,
  listingPrice,
}: MakeOfferDialogProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (Number(amount) >= Number(listingPrice)) {
      setError('يجب أن يكون المبلغ المعروض أقل من السعر المطلوب');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await offerService.createOffer({
        listingId,
        amount: Number(amount),
        message: message.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset form
        setAmount('');
        setMessage('');
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'حدث خطأ أثناء إرسال العرض');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setAmount('');
      setMessage('');
      setError('');
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>تقديم عرض سعر</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, pt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            الإعلان: <strong>{listingTitle}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            السعر المطلوب: <strong>{Number(listingPrice).toLocaleString('ar-SA')} ج.س</strong>
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            تم إرسال عرضك بنجاح! سيتم إشعارك عند رد البائع.
          </Alert>
        )}

        <TextField
          fullWidth
          label="المبلغ المعروض *"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading || success}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">ج.س</InputAdornment>,
          }}
          helperText="قدم سعراً أقل من السعر المطلوب"
        />

        <TextField
          fullWidth
          label="رسالة للبائع (اختياري)"
          multiline
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading || success}
          placeholder="مثال: أود شراء هذا المنتج، هل يمكنك قبول هذا السعر؟"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || success}
          sx={{
            bgcolor: '#FF385C',
            '&:hover': { bgcolor: '#E61E4D' },
          }}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال العرض'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
