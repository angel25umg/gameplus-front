import { TextField, Button, Box } from '@mui/material';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import type { Videojuego } from '../services/videojuegoApi';

const defaultValues: Videojuego = {
  titulo: '',
  genero: '',
  plataforma: '',
  edad_recomendada: null,
  existencias: null,
  licencias_digitales: null,
  precio: null,
  trailer_url: '',
  status: true,
};

interface Props {
  onSubmit: SubmitHandler<Videojuego>;
  initialData?: Videojuego | null;
}

export const VideojuegoForm = ({ onSubmit, initialData }: Props) => {
  const { control, handleSubmit } = useForm<Videojuego>({
    defaultValues: initialData || defaultValues,
    values: initialData || defaultValues,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 500, pt: 1 }}
    >
      <Controller
        name="titulo"
        control={control}
        rules={{ required: 'El título es requerido' }}
        render={({ field, fieldState }) => (
          <TextField {...field} label="Título" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="genero"
          control={control}
          rules={{ required: 'El género es requerido' }}
          render={({ field, fieldState }) => (
            <TextField {...field} label="Género" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />
        <Controller
          name="plataforma"
          control={control}
          rules={{ required: 'La plataforma es requerida' }}
          render={({ field, fieldState }) => (
            <TextField {...field} label="Plataforma" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="edad_recomendada"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Edad Recomendada" fullWidth />
          )}
        />
        <Controller
          name="precio"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Precio" fullWidth inputProps={{ step: '0.01' }} />
          )}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="existencias"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Existencias Físicas" fullWidth />
          )}
        />
        <Controller
          name="licencias_digitales"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Licencias Digitales" fullWidth />
          )}
        />
      </Box>

      <Controller
        name="trailer_url"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="URL del Trailer" fullWidth />
        )}
      />

      <Button type="submit" variant="contained">Guardar</Button>
    </Box>
  );
};
