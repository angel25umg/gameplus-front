import React from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { carritoApi, pedidoApi } from '../services/ventaApi';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useState } from 'react';

type FormValues = {
  direccion_envio: string;
  tipo_entrega: string;
  carritoId: number;
};

interface Props {
  carritoId: number;
  // optional callback executed after successful pedido creation
  onSuccess?: (pedido: any) => void;
}

export const AddressCheckoutForm: React.FC<Props> = ({ carritoId, onSuccess }) => {
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { direccion_envio: '', tipo_entrega: 'FISICA', carritoId } });
  // keep navigate available if needed, but prefer parent onSuccess to handle navigation and closing modal
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Primero marcar checkout en el carrito
      await carritoApi.checkout(data.carritoId);
      // Luego convertir a pedido
      const res = await pedidoApi.carritoToPedido({ carritoId: data.carritoId, direccion_envio: data.direccion_envio, tipo_entrega: data.tipo_entrega });
      const pedido = res.data.pedido;
      // If parent provided onSuccess callback, call it so parent can close modal and navigate
      if (onSuccess) {
        onSuccess(pedido);
      } else {
        // fallback: navigate directly
        navigate('/pago-order', { state: { pedidoId: pedido.id } });
      }
    } catch (err: any) {
      // Log full server response to console for debugging
      // eslint-disable-next-line no-console
      console.error('Checkout/create pedido error', err);
      const serverMsg = err?.response?.data?.message || err?.message || 'Error desconocido';
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500 }}>
      <Controller name="direccion_envio" control={control} rules={{ required: true }} render={({ field }) => (
        <TextField {...field} label="Dirección de envío" fullWidth margin="normal" />
      )} />
      <Controller name="tipo_entrega" control={control} render={({ field }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel id="tipo-entrega-label">Tipo de entrega</InputLabel>
          <Select labelId="tipo-entrega-label" label="Tipo de entrega" {...field}>
            <MenuItem value="FISICA">Física</MenuItem>
            <MenuItem value="DIGITAL">Digital</MenuItem>
          </Select>
        </FormControl>
      )} />
      <Controller name="carritoId" control={control} render={({ field }) => (
        <input type="hidden" {...field} />
      )} />
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>{loading ? 'Procesando...' : 'Confirmar y crear pedido'}</Button>
    </Box>
  );
};

export default AddressCheckoutForm;
