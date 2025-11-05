import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { pedidoApi } from '../services/ventaApi';
import { createPago } from '../services/pagoApi';

export const PagoOrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pedidoIdFromState = (location.state as any)?.pedidoId;
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const payload = { pedidoId: pedido.id, metodo: 'STRIPE' as const, monto };
  const res = await createPago(payload as any);
      const data = res.data;
      // Si backend retorna factura en la respuesta
      if (data.factura) {
        navigate(`/factura/${data.factura.id}`, { state: { factura: data.factura } });
      } else if (data.pago) {
        // Si solo retorna pago, navegar a historial o detalle
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
              {(pedido.detallePedidos || pedido.detalles || []).map((d: any) => (
                <li key={d.id || `${d.videojuegoId}-${d.cantidad}`}>{d.videojuegoId} — {d.cantidad} x ${d.subtotal}</li>
              ))}
            </ul>
            <Typography variant="h6">Total: ${getTotal().toFixed(2)}</Typography>
          </Box>
          <Button variant="contained" onClick={handlePay} sx={{ mt: 2 }} disabled={loading}>Pagar</Button>
        </Box>
      )}
    </Box>
  );
};

export default PagoOrderPage;
