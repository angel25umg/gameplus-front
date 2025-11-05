import React, { useEffect, useState } from 'react';
import { getPedidos } from '../services/pedidoApi';
import type { Pedido } from '../services/pedidoApi';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getPedidos()
      .then(res => setPedidos(res.data || []))
      .catch(err => console.error('Error fetching pedidos', err))
      .finally(() => setLoading(false));
  }, []);

  const handleVer = (id?: number) => {
    if (!id) return;
    navigate(`/pedidos/${id}`);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Pedidos</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ClienteId</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo Entrega</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.clienteId}</TableCell>
                  <TableCell>{p.fecha ? new Date(p.fecha).toLocaleString() : '-'}</TableCell>
                  <TableCell>{p.tipo_entrega}</TableCell>
                  <TableCell>{p.estado}</TableCell>
                  <TableCell>{p.detalles ? p.detalles.length : 0}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleVer(p.id)}>Ver</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default PedidosPage;
