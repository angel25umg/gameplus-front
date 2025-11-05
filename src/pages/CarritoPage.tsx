import { Box, Typography, Button, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { getCarritoCliente, removeProductoCarrito, clearCarrito } from '../services/carritoApi';
import AddressCheckoutForm from '../components/AddressCheckoutForm';

export interface CarritoDetalle {
  id: number;
  videojuegoId: number;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  id: number;
  clienteId: number;
  estado: string;
  carrito_detalles: CarritoDetalle[];
}

export const CarritoPage = () => {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        setLoading(true);
        const res = await getCarritoCliente();
        setCarrito(res.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar el carrito.');
      } finally {
        setLoading(false);
      }
    };
    fetchCarrito();
  }, []);

  const handleRemove = async (detalleId: number) => {
    try {
      if (!carrito) throw new Error('Carrito no disponible');
      const detalle = carrito.carrito_detalles.find((d) => d.id === detalleId);
      if (!detalle) throw new Error('Detalle no encontrado');
      await removeProductoCarrito(carrito.id, detalle.videojuegoId);
      setCarrito((prev) => prev ? {
        ...prev,
        carrito_detalles: prev.carrito_detalles.filter((d) => d.id !== detalleId)
      } : prev);
    } catch (err) {
      setError('Error al eliminar el producto del carrito.');
    }
  };

  const handleClear = async () => {
    if (!carrito) return;
    try {
      await clearCarrito(carrito.id);
      setCarrito({ ...carrito, carrito_detalles: [] });
    } catch (err) {
      setError('Error al limpiar el carrito.');
    }
  };

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const openCheckout = () => setCheckoutOpen(true);
  const closeCheckout = () => setCheckoutOpen(false);
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'videojuegoId', headerName: 'Videojuego', width: 140 },
    { field: 'cantidad', headerName: 'Cantidad', width: 100 },
    { field: 'subtotal', headerName: 'Subtotal', width: 120 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 140,
      renderCell: (params) => (
        <Button variant="contained" color="error" size="small" onClick={() => handleRemove(params.row.id)}>
          Eliminar
        </Button>
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>
      <Typography>
        Aquí puedes ver, modificar y eliminar productos de tu carrito.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={carrito?.carrito_detalles || []}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="outlined" color="error" onClick={handleClear} disabled={!carrito?.carrito_detalles?.length}>
          Vaciar carrito
        </Button>
        <Button variant="contained" color="primary" onClick={openCheckout} disabled={!carrito?.carrito_detalles?.length}>
          Comprar
        </Button>
      </Box>

      <Dialog open={checkoutOpen} onClose={closeCheckout} fullWidth maxWidth="sm">
        <DialogTitle>Confirmar compra</DialogTitle>
        <DialogContent>
          {carrito && (
            <AddressCheckoutForm carritoId={carrito.id} onSuccess={(pedido) => {
              // Close dialog then navigate to pago-order
              closeCheckout();
              navigate('/pago-order', { state: { pedidoId: pedido.id } });
            }} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
