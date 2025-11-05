import { useEffect, useState } from 'react';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { 
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Box, Alert, Typography 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Cliente, getClientes, createCliente, updateCliente, deleteCliente } from '../services/clienteApi';
import { ClienteForm } from '../components/ClienteForm'; 

export const ClientePage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await getClientes();
      setClientes(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOpenModal = (cliente: Cliente | null = null) => {
    setClienteToEdit(cliente);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setClienteToEdit(null);
  };

  const handleSubmitForm = async (data: Cliente) => {
    try {
      if (clienteToEdit && clienteToEdit.id) {
        await updateCliente(clienteToEdit.id, data);
      } else {
        await createCliente(data);
      }
      fetchClientes();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar el cliente.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      try {
        await deleteCliente(id);
        fetchClientes();
      } catch (err) {
        setError('Error al eliminar el cliente.');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'correo', headerName: 'Correo', width: 250 },
    { field: 'telefono', headerName: 'Teléfono', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleOpenModal(params.row as Cliente)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete(params.row.id as number)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Clientes
      </Typography>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => handleOpenModal(null)}
        sx={{ mb: 2 }}
      >
        Nuevo Cliente
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      <DataGrid
        rows={clientes}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
      />

      {/* Modal para Crear/Editar */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>{clienteToEdit ? 'Editar Cliente' : 'Crear Cliente'}</DialogTitle>
        <DialogContent>
          <ClienteForm
            onSubmit={handleSubmitForm}
            initialData={clienteToEdit}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};