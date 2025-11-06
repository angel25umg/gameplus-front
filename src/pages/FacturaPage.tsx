import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

export const FacturaPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const facturaFromState = (location.state as any)?.factura;
  const [factura, setFactura] = useState<any>(facturaFromState || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (factura) return;
    if (!id) {
      setError('ID de factura no proporcionado');
      return;
    }
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/facturas/${id}`).then(res => setFactura(res.data)).catch(() => setError('No se pudo cargar la factura')).finally(() => setLoading(false));
  }, [id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (loading || !factura) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Factura {factura.numero}</Typography>
      <Typography>Fecha: {new Date(factura.fecha).toLocaleString()}</Typography>
      <Typography>Cliente ID: {factura.clienteId}</Typography>
      <Typography>Pedido ID: {factura.pedidoId}</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Detalles</Typography>
        <ul>
          {(factura.detalles || []).map((d: any, i: number) => {
            const titulo = d.titulo || d.videojuego?.titulo || d.videojuegoId || '—';
            const subtotal = Number(d.subtotal ?? d.total ?? 0).toFixed(2);
            return <li key={i}>{titulo} — {d.cantidad} x ${subtotal}</li>;
          })}
        </ul>
        <Typography variant="h6">Monto: ${factura.monto}</Typography>
      </Box>
    </Box>
  );
};

export default FacturaPage;
