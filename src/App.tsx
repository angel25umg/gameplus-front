import { CatalogoPage } from './pages/CatalogoPage';
import { VentaTest } from './components/VentaTest';
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage'; 
import { DashboardLayout } from './layout/DashboardLayout';
import { ClientePage } from   './pages/ClientePage';
import { ProductoPage } from './pages/ProductoPage';
import { ProveedorPage } from './pages/ProveedorPage';
import { EmpleadoPage } from './pages/EmpleadoPage';


import { ReporteriaPage } from './pages/ReporteriaPage';
import { PagoPage } from './pages/PagoPage';
import PagoOrderPage from './pages/PagoOrderPage';
import FacturaPage from './pages/FacturaPage';
import { CarritoPage } from './pages/CarritoPage';
import { TableroPage } from './pages/TableroPage';
import PedidosPage from './pages/PedidosPage';

function App() {
  return (
    // CORRECCIÓN: BrowserRouter DEBE envolver a AuthProvider
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              {/* Ruta para "/" */}
              <Route index element={<TableroPage />} />
              {/* Ruta para "/dashboard" (redirección de Stripe) */}
              <Route path="dashboard" element={<TableroPage />} /> 
              
              <Route path="clientes" element={<ClientePage />} />
              <Route path="empleados" element={<EmpleadoPage />} />
              <Route path="productos" element={<ProductoPage />} />
              <Route path="proveedores" element={<ProveedorPage />} />
              <Route path="pedidos" element={<PedidosPage />} />
              <Route path="pedidos/:id" element={<PedidosPage />} />
           
              <Route path="catalogo" element={<CatalogoPage />} />
              <Route path="carrito" element={<CarritoPage />} />
              <Route path="pago-order" element={<PagoOrderPage />} />
              <Route path="factura/:id" element={<FacturaPage />} />
              <Route path="reportes" element={<ReporteriaPage />} />
              <Route path="pagos" element={<PagoPage />} />
              <Route path="venta-test" element={<VentaTest />} />
            </Route>
          </Route>
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;