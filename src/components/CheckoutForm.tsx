import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, Box, CircularProgress, Alert } from '@mui/material';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // CORRECCIÓN: URL de retorno apunta a /dashboard (con 'h')
        return_url: `${window.location.origin}/dashboard`, 
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || 'Ocurrió un error');
    } else {
      setMessage("Ocurrió un error inesperado.");
    }

    setIsLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
      <PaymentElement id="payment-element" />
      <Button
        disabled={isLoading || !stripe || !elements}
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Pagar ahora"}
      </Button>

      {message && <Alert severity="error">{message}</Alert>}
    </Box>
  );
};