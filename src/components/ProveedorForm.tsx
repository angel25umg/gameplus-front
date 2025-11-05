
import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import type { Proveedor } from '../services/proveedorApi';

interface Props {
  onSubmit: (data: Proveedor) => void;
  initialData?: Proveedor | null;
}

export const ProveedorForm = ({ onSubmit, initialData }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Proveedor>({
    defaultValues: initialData || {
      nombre: '',
      contacto: '',
      contrato: '',
      status: true,
    },
  });

  // Reset form when initialData changes (for edit)
  React.useEffect(() => {
    reset(initialData || {
      nombre: '',
      contacto: '',
      contrato: '',
      status: true,
    });
  }, [initialData, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
      <TextField
        label="Nombre"
        {...register('nombre', { required: 'Nombre requerido' })}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
      />
      <TextField
        label="Contacto"
        {...register('contacto', { required: 'Contacto requerido' })}
        error={!!errors.contacto}
        helperText={errors.contacto?.message}
      />
      <TextField
        label="Contrato"
        {...register('contrato', { required: 'Contrato/licencia requerida' })}
        error={!!errors.contrato}
        helperText={errors.contrato?.message}
      />
      <TextField
        label="Activo"
        type="checkbox"
        {...register('status')}
        sx={{ mt: 1 }}
      />
      <Button type="submit" variant="contained">{initialData ? 'Actualizar' : 'Crear'}</Button>
    </Box>
  );
};
