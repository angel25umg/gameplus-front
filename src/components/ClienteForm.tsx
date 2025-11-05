import { TextField, Button, Box } from '@mui/material';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import type { Cliente } from '../services/clienteApi';

const defaultValues: Cliente = {
  nombre: '',
  apellido: '',
  direccion: '',
  correo: '',
  telefono: '',
  password: '',
};

interface ClienteFormProps {
  onSubmit: SubmitHandler<Cliente>;
  initialData?: Cliente | null;
}

export const ClienteForm = ({ onSubmit, initialData }: ClienteFormProps) => {
  const { control, handleSubmit } = useForm<Cliente>({
    defaultValues: initialData || defaultValues,
    values: initialData || defaultValues,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400, pt: 1 }}
    >
      <Controller
        name="nombre"
        control={control}
        rules={{ required: 'El nombre es requerido' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Nombre"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="apellido"
        control={control}
        rules={{ required: 'El apellido es requerido' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Apellido"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="correo"
        control={control}
        rules={{ required: 'El correo es requerido', pattern: /^\S+@\S+$/i }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Correo"
            type="email"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error ? 'Correo inválido' : ''}
          />
        )}
      />
       <Controller
        name="direccion"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Dirección" variant="outlined" />
        )}
      />
      <Controller
        name="telefono"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Teléfono" variant="outlined" />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Contraseña"
            type="password"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" variant="contained" color="primary">
        Guardar
      </Button>
    </Box>
  );
};