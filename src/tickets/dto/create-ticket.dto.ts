import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'El título del ticket es requerido.' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción del problema es requerida.' })
  descripcion!: string;

  @IsInt({ message: 'El ID del usuario creador debe ser un número entero.' })
  usuarioId!: number;
}