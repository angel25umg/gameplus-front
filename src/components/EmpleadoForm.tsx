import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import type { Empleado } from '../services/empleadoApi';

interface Props {
  onSubmit: (data: Empleado) => void;
  initialData?: Empleado | null;
}

export const EmpleadoForm = ({ onSubmit, initialData }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Empleado>({
    defaultValues: initialData || {
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      rol: 'SOPORTE',
      status: true,
    },
  });

  React.useEffect(() => {
    reset(initialData || {
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      rol: 'SOPORTE',
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
        label="Apellido"
        {...register('apellido', { required: 'Apellido requerido' })}
        error={!!errors.apellido}
        helperText={errors.apellido?.message}
      />
      <TextField
        label="Correo"
        type="email"
        {...register('correo', { required: 'Correo requerido' })}
        error={!!errors.correo}
        helperText={errors.correo?.message}
      />
      <TextField
        label="Contraseña"
        type="password"
        {...register('password', { required: !initialData ? 'Contraseña requerida' : false })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        select
        label="Rol"
        {...register('rol', { required: 'Rol requerido' })}
        error={!!errors.rol}
        helperText={errors.rol?.message}
      >
        <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
        <MenuItem value="VENDEDOR">Vendedor</MenuItem>
        <MenuItem value="SOPORTE">Soporte</MenuItem>
      </TextField>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <label htmlFor="status" style={{ marginRight: 8 }}>Activo</label>
        <input
          id="status"
          type="checkbox"
          {...register('status')}
          defaultChecked={initialData ? initialData.status : true}
        />
      </Box>
      <Button type="submit" variant="contained">{initialData ? 'Actualizar' : 'Crear'}</Button>
    </Box>
  );
};
