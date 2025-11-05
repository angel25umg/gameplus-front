import { useState } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { CheckoutForm } from '../components/CheckoutForm';
import { Alert, Box, CircularProgress, Typography, TextField, Button } from '@mui/material';

// ⬇️ RECUERDA PONER TU CLAVE PÚBLICA REAL DE STRIPE ⬇️
const STRIPE_PUBLIC_KEY = 'pk_test_...TU_CLAVE_PUBLICA_VA_AQUI'; 
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const API_URL = `${import.meta.env.VITE_API_URL}/stripe/create-payment-intent`;

export const PagoPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handleCreatePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const amountInCents = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountInCents) || amountInCents <= 0) {
      setError('Por favor, ingresa un monto válido.');
      setLoading(false);
      return;
    }

    try {
      // 1. Llamamos al backend ENVIANDO AMOUNT Y CURRENCY
      const response = await axios.post(API_URL, { 
        amount: amountInCents,
        currency: "usd" // Asegúrate que el backend lo espere
      });
      
      if (response.data && response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo inicializar el pago. Revisa el backend.');
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'stripe' as const,
  };

  const options = {
    clientSecret: clientSecret || undefined,
    appearance,
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Formulario de Pago</Typography>
      
      {/* 1. Muestra formulario de Monto */}
      {!clientSecret && (
        <Box component="form" onSubmit={handleCreatePaymentIntent} sx={{ maxWidth: 400 }}>
          <Typography variant="h6">Ingresa el monto a pagar (USD)</Typography>
          <TextField
            label="Monto"
            variant="outlined"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            InputProps={{ inputProps: { step: "0.01" } }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Proceder al Pago"}
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      )}

      {/* 2. Muestra formulario de Stripe (cuando ya hay clientSecret) */}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </Box>
  );
};