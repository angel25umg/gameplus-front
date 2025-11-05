import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, TextField } from '@mui/material';
import type { Videojuego } from '../services/videojuegoApi';
import { carritoApi } from '../services/ventaApi';

interface Props {
  juego: Videojuego;
  onAdded?: () => void;
}

export const VideojuegoCard: React.FC<Props> = ({ juego, onAdded }) => {
  const [cantidad, setCantidad] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const clienteId = Number(localStorage.getItem('clienteId'));
      if (!clienteId) throw new Error('No hay cliente logueado');
      // Crear o recuperar carrito
      const carritoRes = await carritoApi.create(clienteId);
      const carritoId = carritoRes.data.id;
      // Agregar producto (ventaApi.carrito add accepts subtotal but backend computes server-side too)
      await carritoApi.addProducto({ carritoId, videojuegoId: juego.id as number, cantidad, subtotal: (juego.precio || 0) * cantidad });
      onAdded && onAdded();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{juego.titulo}</Typography>
        <Typography variant="body2">Plataforma: {juego.plataforma}</Typography>
        <Typography variant="body2">Género: {juego.genero}</Typography>
        <Typography variant="subtitle1">${juego.precio}</Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField type="number" size="small" value={cantidad} onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))} inputProps={{ min: 1 }} sx={{ width: 80 }} />
          <Button variant="contained" onClick={handleAdd} disabled={loading}>Agregar</Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default VideojuegoCard;
