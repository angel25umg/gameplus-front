import { Typography, Box, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const TableroPage = () => {
  // 1. Obtenemos los parámetros de la URL
  const [searchParams] = useSearchParams();
  
  // 2. Revisamos si el pago fue exitoso
  const paymentStatus = searchParams.get('redirect_status');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        GamePlus
      </Typography>
      
      <Typography variant="h6">
        ¡Bienvenido de nuevo!
      </Typography>

      {/* 3. Mostramos el mensaje SÓLO SI el pago fue exitoso */}
      {paymentStatus === 'succeeded' && (
        <Alert 
          severity="success" 
          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          sx={{ mt: 3 }}
        >
          ¡Tu pago fue procesado exitosamente!
        </Alert>
      )}
    </Box>
  );
};