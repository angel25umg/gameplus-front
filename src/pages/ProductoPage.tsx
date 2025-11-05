import { useEffect, useState } from 'react';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { 
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Box, Alert, Typography 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Videojuego, getVideojuegos, createVideojuego, updateVideojuego, deleteVideojuego } from '../services/videojuegoApi';
import { VideojuegoForm } from '../components/VideojuegoForm'; 

export const ProductoPage = () => {
  const [items, setItems] = useState<Videojuego[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Videojuego | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getVideojuegos();
      setItems(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los videojuegos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (vj: Videojuego | null = null) => {
    setToEdit(vj);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setToEdit(null);
  };

  const handleSubmitForm = async (data: Videojuego) => {
    try {
      if (toEdit && toEdit.id) {
        await updateVideojuego(toEdit.id, data);
      } else {
        await createVideojuego(data);
      }
      fetchItems();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar el videojuego.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este videojuego?')) {
      try {
        await deleteVideojuego(id);
        fetchItems();
      } catch (err) {
        setError('Error al eliminar el videojuego.');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'titulo', headerName: 'Título', width: 180 },
    { field: 'genero', headerName: 'Género', width: 140 },
    { field: 'plataforma', headerName: 'Plataforma', width: 140 },
    { 
      field: 'precio', 
      headerName: 'Precio', 
      width: 100, 
      renderCell: (params: any) => (params.value != null ? `$${params.value}` : ''),
    },
    { field: 'existencias', headerName: 'Existencias', width: 120 },
    { field: 'licencias_digitales', headerName: 'Licencias', width: 110 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleOpenModal(params.row as Videojuego)}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete((params.row as Videojuego).id as number)}
          key="delete"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Videojuegos
      </Typography>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => handleOpenModal(null)}
        sx={{ mb: 2 }}
      >
        Nuevo Videojuego
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      <DataGrid
        rows={items}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
      />

      <Dialog open={open} onClose={handleCloseModal} maxWidth="md">
        <DialogTitle>{toEdit ? 'Editar Videojuego' : 'Crear Videojuego'}</DialogTitle>
        <DialogContent>
          <VideojuegoForm onSubmit={handleSubmitForm} initialData={toEdit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};