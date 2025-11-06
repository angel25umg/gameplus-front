import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { pedidoApi, pagoApi } from '../services/ventaApi';
import { createPago } from '../services/pagoApi';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export const PagoOrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pedidoIdFromState = (location.state as any)?.pedidoId;
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'STRIPE'|'PAYPAL'>('STRIPE');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  // Function to initialize Stripe public key at runtime. Returns true if initialized.
  const initStripe = async (): Promise<boolean> => {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined;
    try {
      if (key) {
        setStripePromise(loadStripe(key));
        return true;
      }
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const resp = await fetch(`${API_BASE}/stripe/public-key`);
      if (!resp.ok) {
        console.warn('Could not fetch stripe public key from server', resp.status);
        return false;
      }
      const data = await resp.json();
      if (data?.publicKey) {
        setStripePromise(loadStripe(data.publicKey));
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Error initializing stripe public key', e);
      return false;
    }
  };

  // Try to initialize on mount so the key is fetched early
  useEffect(() => {
    initStripe();
  }, []);

  useEffect(() => {
    const pid = pedidoIdFromState || Number(new URLSearchParams(location.search).get('pedidoId'));
    if (!pid) {
      setError('PedidoId no proporcionado');
      return;
    }
    setLoading(true);
    pedidoApi.getPedido(pid).then(res => setPedido(res.data)).catch(() => setError('No se pudo obtener el pedido')).finally(() => setLoading(false));
  }, []);

  const refreshPedido = async () => {
    const pid = pedidoIdFromState || Number(new URLSearchParams(location.search).get('pedidoId'));
    if (!pid) return;
    setLoading(true);
    try {
      const res = await pedidoApi.getPedido(pid);
      setPedido(res.data);
      setError(null);
    } catch (e) {
      setError('No se pudo actualizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    if (!pedido) return 0;
    // soporte para distintas formas en que el backend puede devolver los detalles
    const detalles = pedido.detallePedidos || pedido.detalles || pedido.detalle_pedidos || pedido.items || [];
    return detalles.reduce((s: number, d: any) => s + Number(d.subtotal ?? d.total ?? 0), 0);
  };

  const handlePay = async () => {
    if (!pedido) return;
    setLoading(true);
    setError(null);
    try {
      const monto = getTotal();
      if (!monto || monto <= 0) {
        setError('Total inválido. Actualiza el pedido antes de pagar.');
        setLoading(false);
        return;
      }
      if (method === 'STRIPE') {
        // Ensure Stripe is initialized before showing the form. If not initialized,
        // try to initialize (fetch public key). Show an error if it fails.
        if (!stripePromise) {
          const ok = await initStripe();
          setLoading(false);
          if (!ok) {
            setError('No se pudo inicializar Stripe. Revisa la consola o la configuración de VITE_API_URL/VITE_STRIPE_PUBLIC_KEY.');
            return;
          }
          setShowStripeForm(true);
          return;
        }
        setShowStripeForm(true);
        setLoading(false);
        return;
      }
      // Fallback: crear Pago directo (sin Stripe)
      const payload = { pedidoId: pedido.id, metodo: 'PAYPAL' as const, monto };
      const res = await createPago(payload as any);
      const data = res.data;
      if (data.factura) {
        navigate(`/factura/${data.factura.id}`, { state: { factura: data.factura } });
      } else if (data.pago) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Resumen de Pago</Typography>
      {loading && <CircularProgress />}
      {!loading && pedido && (
        <Box>
          <Button variant="outlined" onClick={refreshPedido} sx={{ mb: 2 }}>Refrescar pedido</Button>
          <Typography>Pedido ID: {pedido.id}</Typography>
            <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Items</Typography>
            <ul>
              {(pedido.detallePedidos || pedido.detalles || []).map((d: any) => {
                const titulo = d.videojuego?.titulo || d.videojuegoId || '—';
                const precio = d.subtotal ?? d.total ?? 0;
                return (
                  <li key={d.id || `${d.videojuegoId}-${d.cantidad}`}>
                    {titulo} — {d.cantidad} x ${Number(precio).toFixed(2)}
                  </li>
                );
              })}
            </ul>
            <Typography variant="h6">Total: ${getTotal().toFixed(2)}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Seleccionar método de pago</Typography>
            <RadioGroup row value={method} onChange={(e) => setMethod(e.target.value as any)}>
              <FormControlLabel value="STRIPE" control={<Radio />} label="Tarjeta (Stripe)" />
              <FormControlLabel value="PAYPAL" control={<Radio />} label="PayPal / Otro" />
            </RadioGroup>
            <Button variant="contained" onClick={handlePay} sx={{ mt: 1 }} disabled={loading}>Pagar</Button>
            {showStripeForm && stripePromise && (
              <Box sx={{ mt: 2 }}>
                <Elements stripe={stripePromise}>
                  <StripeCheckout
                    pedido={pedido}
                    monto={getTotal()}
                    onSuccess={() => {
                      setShowStripeForm(false);
                      navigate('/dashboard');
                    }}
                    onCancel={() => setShowStripeForm(false)}
                  />
                </Elements>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PagoOrderPage;

  const StripeCheckout: React.FC<{ pedido: any; monto: number; onSuccess: () => void; onCancel: () => void }> = ({ pedido, monto, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errLocal, setErrLocal] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!stripe || !elements) {
      setErrLocal('Stripe no inicializado');
      return;
    }
    setLoadingLocal(true);
    setErrLocal(null);
    try {
      const amount = Math.round(monto * 100);
      const resp = await pagoApi.createPaymentIntent({ amount, currency: 'usd', description: `Pago pedido ${pedido.id}` });
      const clientSecret = resp.data?.clientSecret;
      if (!clientSecret) throw new Error('No se obtuvo clientSecret');

      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Elemento de tarjeta no encontrado');

      const result: any = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card }
      });

      if (result.error) {
        setErrLocal(result.error.message || 'Error durante el pago');
        setLoadingLocal(false);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Registrar pago en backend
        const resPago = await createPago({ pedidoId: pedido.id, metodo: 'STRIPE', monto } as any);
        const data = resPago.data || {};
        // Si el backend devolvió la factura, navegar a ella como con PayPal
        if (data.factura && data.factura.id) {
          navigate(`/factura/${data.factura.id}`, { state: { factura: data.factura } });
          return;
        }
        onSuccess();
      } else {
        setErrLocal('Pago no completado');
      }
    } catch (e: any) {
      setErrLocal(e.message || 'Error en pago');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <Box>
      {errLocal && <Alert severity="error">{errLocal}</Alert>}
      <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleConfirm} disabled={loadingLocal}>Confirmar pago con tarjeta</Button>
        <Button variant="text" onClick={onCancel} sx={{ ml: 2 }}>Cancelar</Button>
      </Box>
    </Box>
  );
};
