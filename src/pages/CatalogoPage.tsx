
import React, { useEffect, useState } from 'react';
import { carritoApi } from '../services/ventaApi';
import { getVideojuegos } from '../services/videojuegoApi';
import { Button, Typography, Box, TextField, Alert, CircularProgress } from '@mui/material';


export const CatalogoPage: React.FC = () => {
  const [carrito, setCarrito] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [videojuegos, setVideojuegos] = useState<any[]>([]);

  useEffect(() => {
    const clienteId = localStorage.getItem('clienteId');
    if (clienteId) {
      carritoApi.getByCliente(Number(clienteId))
        .then(res => setCarrito(res.data))
        .catch(() => setCarrito(null));
    }
    // Obtener videojuegos reales del backend
    getVideojuegos()
      .then(res => setVideojuegos(res.data))
      .catch(() => setVideojuegos([]));
  }, []);

  const handleAgregar = async (videojuego: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const clienteId = localStorage.getItem('clienteId');
    try {
      // Si no hay carrito, créalo primero
      let carritoId = carrito?.id;
      if (!carritoId && clienteId) {
        const res = await carritoApi.create(Number(clienteId));
        carritoId = res.data.id;
        setCarrito(res.data);
      }
      const cantidadSeleccionada = cantidad[videojuego.id] || 1;
      const subtotal = (videojuego.precio || 0) * cantidadSeleccionada;
      await carritoApi.addProducto({
        carritoId,
        videojuegoId: videojuego.id,
        cantidad: cantidadSeleccionada,
        subtotal,
      });
      setSuccess(`Agregado ${cantidadSeleccionada} x ${videojuego.titulo} al carrito.`);
      // Actualiza el carrito
      const updated = await carritoApi.getByCliente(Number(clienteId));
      setCarrito(updated.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Catálogo de Videojuegos</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {loading && <CircularProgress />}
      <Box sx={{ my: 2 }}>
        {videojuegos.map((juego) => (
          <Box key={juego.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">{juego.titulo}</Typography>
            <Typography>Precio: ${juego.precio}</Typography>
            <TextField
              type="number"
              label="Cantidad"
              value={cantidad[juego.id] || 1}
              onChange={e => setCantidad({ ...cantidad, [juego.id]: Number(e.target.value) })}
              sx={{ width: 100, mr: 2 }}
              inputProps={{ min: 1 }}
            />
            <Button variant="contained" onClick={() => handleAgregar(juego)}>
              Agregar al carrito
            </Button>
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Carrito actual</Typography>
        {carrito ? (
          <ul>
            {carrito.carritoDetalles?.map((item: any) => (
              <li key={item.id}>
                Juego: {item.videojuegoId} | Cantidad: {item.cantidad} | Subtotal: ${item.subtotal}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No hay carrito activo.</Typography>
        )}
      </Box>
    </Box>
  );
};
