import { useEffect, useState } from 'react';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Alert, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Empleado, getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../services/empleadoApi';
import { EmpleadoForm } from '../components/EmpleadoForm';

export const EmpleadoPage = () => {
  const [items, setItems] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Empleado | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getEmpleados();
      setItems(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los empleados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (emp: Empleado | null = null) => {
    setToEdit(emp);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setToEdit(null);
  };

  const handleSubmitForm = async (data: Empleado) => {
    try {
      if (toEdit && toEdit.id) {
        await updateEmpleado(toEdit.id, data);
      } else {
        await createEmpleado(data);
      }
      fetchItems();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar el empleado.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
      try {
        await deleteEmpleado(id);
        fetchItems();
      } catch (err) {
        setError('Error al eliminar el empleado.');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nombre', headerName: 'Nombre', width: 140 },
    { field: 'apellido', headerName: 'Apellido', width: 140 },
    { field: 'correo', headerName: 'Correo', width: 200 },
    { field: 'rol', headerName: 'Rol', width: 140 },
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
          onClick={() => handleOpenModal(params.row as Empleado)}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete((params.row as Empleado).id as number)}
          key="delete"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Empleados
      </Typography>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => handleOpenModal(null)}
        sx={{ mb: 2 }}
      >
        Nuevo Empleado
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      <DataGrid
        rows={items}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
      />

      <Dialog open={open} onClose={handleCloseModal} maxWidth="md">
        <DialogTitle>{toEdit ? 'Editar Empleado' : 'Crear Empleado'}</DialogTitle>
        <DialogContent>
          <EmpleadoForm onSubmit={handleSubmitForm} initialData={toEdit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
