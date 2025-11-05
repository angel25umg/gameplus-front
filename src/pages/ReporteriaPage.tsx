import { useEffect, useState } from 'react';
import { Box, Typography, Alert, Tabs, Tab, Paper } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getVentasMensuales, getTopClientes } from '../services/reporteriaApi';
import type { VentaMensual, TopCliente } from '../services/reporteriaApi';

export const ReporteriaPage = () => {
  const [tab, setTab] = useState(0);
  const [ventas, setVentas] = useState<VentaMensual[]>([]);
  const [clientes, setClientes] = useState<TopCliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (tab === 0) {
      getVentasMensuales().then(r => {
        // El backend puede devolver un objeto o un array
        if (Array.isArray(r.data)) {
          setVentas(r.data);
        } else if (r.data) {
          setVentas([r.data]);
        } else {
          setVentas([]);
        }
      }).catch(() => setError('Error al cargar ventas mensuales')).finally(() => setLoading(false));
    } else {
      getTopClientes().then(r => {
        if (Array.isArray(r.data)) {
          setClientes(r.data);
        } else if (r.data) {
          setClientes([r.data]);
        } else {
          setClientes([]);
        }
      }).catch(() => setError('Error al cargar top clientes')).finally(() => setLoading(false));
    }
  }, [tab]);

  const ventasCols: GridColDef[] = [
    { field: 'mes', headerName: 'Mes', width: 120 },
    { field: 'tipo_entrega', headerName: 'Tipo Entrega', width: 140 },
    { field: 'total_pedidos', headerName: 'Total Pedidos', width: 140 },
  ];

  const clientesCols: GridColDef[] = [
    { field: 'clienteid', headerName: 'ID', width: 80 },
    { field: 'nombre', headerName: 'Nombre', width: 140 },
    { field: 'apellido', headerName: 'Apellido', width: 140 },
    { field: 'correo', headerName: 'Correo', width: 200 },
    { field: 'total_compras', headerName: 'Total Compras', width: 140, renderCell: (params) => `$${params.value}` },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h4" gutterBottom>Reportes</Typography>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Ventas Mensuales" />
          <Tab label="Top Clientes" />
        </Tabs>
      </Paper>
      {error && <Alert severity="error">{error}</Alert>}
      {tab === 0 ? (
        <DataGrid rows={ventas} columns={ventasCols} loading={loading} getRowId={(r) => `${r.mes}-${r.tipo_entrega}`} autoHeight />
      ) : (
        <DataGrid rows={clientes} columns={clientesCols} loading={loading} getRowId={(r) => r.clienteid} autoHeight />
      )}
    </Box>
  );
}
