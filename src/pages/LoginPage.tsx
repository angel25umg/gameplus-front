import { Button, TextField, Container, Box, Typography, CssBaseline, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Fab, Snackbar } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClienteForm } from '../components/ClienteForm';
import { createCliente, type Cliente } from '../services/clienteApi';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const API = import.meta.env.VITE_API_URL as string;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

  const loginEmpleado = async () => {
    const res = await axios.post(`${API}/empleados/login`, { correo, password });
    const user = res.data?.empleado;
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('role', 'empleado');
    localStorage.setItem('user', JSON.stringify(user));
  };

  const loginCliente = async () => {
    const res = await axios.post(`${API}/clientes/login`, { correo, password });
    const user = res.data?.cliente;
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('role', 'cliente');
    localStorage.setItem('user', JSON.stringify(user));
    if (user && user.id) {
      localStorage.setItem('clienteId', String(user.id));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginEmpleado();
      login();
      navigate('/dashboard');
    } catch (e1: any) {
      const status = e1?.response?.status;
      if (status === 401 || status === 404) {
        try {
          await loginCliente();
          login();
          navigate('/cliente-dashboard');
        } catch (e2: any) {
          const msg = e2?.response?.data?.message || 'Credenciales inválidas';
          setError(msg);
        }
      } else {
        const msg = e1?.response?.data?.message || 'No se pudo iniciar sesión';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const handleCreateCliente = async (data: Cliente) => {
    try {
      setLoading(true);
      await createCliente(data);
      setSnackbarMsg('Cuenta creada correctamente. Puedes iniciar sesión.');
      handleCloseCreate();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al crear cliente';
      setSnackbarMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth={false}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', 
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' ? '#121212' : '#f0f2f5',
      }}
    >
      <CssBaseline /> 
      <Paper 
        elevation={6} 
        sx={{
          padding: 4, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '400px', 
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Acceder'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Paper>
      {/* Botón flotante para crear cuenta */}
      <Fab color="primary" aria-label="crear-cuenta" onClick={handleOpenCreate} sx={{ position: 'fixed', right: 16, bottom: 16 }}>
        <PersonAddIcon />
      </Fab>

      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Crear Cuenta</DialogTitle>
        <DialogContent>
          <ClienteForm onSubmit={handleCreateCliente} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbarMsg} autoHideDuration={4000} onClose={() => setSnackbarMsg(null)} message={snackbarMsg} />
    </Container>
  );
};