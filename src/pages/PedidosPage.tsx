import React, { useEffect, useState } from 'react';
import { getPagos } from '../services/pagoApi';
import type { Pago } from '../services/pagoApi';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress
} from '@mui/material';


const PedidosPage: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  setLoading(true);
  getPagos()
    .then(res => {
      const data = res.data || [];
      data.sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()));
      setPagos(data);
    })
    .catch(err => console.error('Error fetching pagos', err))
    .finally(() => setLoading(false));
}, []);

  

  return (
    <div>
      <Typography variant="h4" gutterBottom>Pagos</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>PedidoId</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {pagos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.pedidoId}</TableCell>
                  <TableCell>{p.metodo}</TableCell>
                  <TableCell>${Number(p.monto).toFixed(2)}</TableCell>
                  <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    
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
