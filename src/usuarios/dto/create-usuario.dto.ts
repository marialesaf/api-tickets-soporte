import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  nombre!: string;

  @IsEmail({}, { message: 'El formato del correo electrónico es inválido.' })
  email!: string;

  @IsString()
  @IsIn(['cliente', 'agente'], { message: 'El rol debe ser obligatoriamente: cliente o agente.' })
  rol!: string;
}