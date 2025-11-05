import { useEffect, useState } from 'react';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Alert, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Proveedor, getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../services/proveedorApi';
import { ProveedorForm } from '../components/ProveedorForm';

export const ProveedorPage = () => {
  const [items, setItems] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Proveedor | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getProveedores();
      setItems(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los proveedores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (prov: Proveedor | null = null) => {
    setToEdit(prov);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setToEdit(null);
  };

  const handleSubmitForm = async (data: Proveedor) => {
    try {
      if (toEdit && toEdit.id) {
        await updateProveedor(toEdit.id, data);
      } else {
        await createProveedor(data);
      }
      fetchItems();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar el proveedor.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      try {
        await deleteProveedor(id);
        fetchItems();
      } catch (err) {
        setError('Error al eliminar el proveedor.');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nombre', headerName: 'Nombre', width: 180 },
    { field: 'contacto', headerName: 'Contacto', width: 200 },
    { field: 'contrato', headerName: 'Contrato', width: 220 },
    { field: 'status', headerName: 'Activo', width: 100, renderCell: (params) => params.value ? 'Sí' : 'No' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleOpenModal(params.row as Proveedor)}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete((params.row as Proveedor).id as number)}
          key="delete"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Proveedores
      </Typography>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => handleOpenModal(null)}
        sx={{ mb: 2 }}
      >
        Nuevo Proveedor
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      <DataGrid
        rows={items}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
      />

      <Dialog open={open} onClose={handleCloseModal} maxWidth="md">
        <DialogTitle>{toEdit ? 'Editar Proveedor' : 'Crear Proveedor'}</DialogTitle>
        <DialogContent>
          <ProveedorForm onSubmit={handleSubmitForm} initialData={toEdit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
