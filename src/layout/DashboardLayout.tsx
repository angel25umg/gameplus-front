import AssessmentIcon from '@mui/icons-material/Assessment';
import { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Box, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
// ...existing code...
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 240;

import StoreIcon from '@mui/icons-material/Store';

const menuItemsEmpleado = [
  { text: 'Inicio', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
  { text: 'Empleados', icon: <PeopleIcon />, path: '/empleados' },
  { text: 'Productos', icon: <ShoppingCartIcon />, path: '/productos' },
  { text: 'Proveedores', icon: <StoreIcon />, path: '/proveedores' },
  { text: 'Pagos', icon: <PaymentIcon />, path: '/pagos' },
  { text: 'Pedidos', icon: <ReceiptLongIcon />, path: '/pedidos' },
  { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
];

const menuItemsCliente = [
  { text: 'Catálogo', icon: <StoreIcon />, path: '/catalogo' },
  { text: 'Carrito', icon: <ShoppingCartIcon />, path: '/carrito' },
  // Aquí puedes agregar más opciones específicas para clientes si lo deseas
];


export const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Detecta el rol desde localStorage
  const role = localStorage.getItem('role');
  const menuItems = role === 'empleado' ? menuItemsEmpleado : menuItemsCliente;

  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleMenuToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${drawerWidth}px`,
          ...(drawerOpen && {
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        }}
      >
        <Toolbar /> 
        <Outlet /> 
      </Box>
    </Box>
  );
};