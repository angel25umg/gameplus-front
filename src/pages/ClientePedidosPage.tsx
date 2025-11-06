import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getPedidosByCliente } from '../services/pedidoApi';
import type { Pedido } from '../services/pedidoApi';

const ClientePedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) return;
    setLoading(true);
    getPedidosByCliente(clienteId)
      .then(res => setPedidos(res.data || []))
      .catch(err => console.error('Error fetching pedidos', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Mis Pedidos</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo Entrega</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Dirección</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.fecha ? new Date(p.fecha).toLocaleString() : '-'}</TableCell>
                  <TableCell>{p.tipo_entrega}</TableCell>
                  <TableCell>{p.estado}</TableCell>
                  <TableCell>{p.direccion_envio || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ClientePedidosPage;
