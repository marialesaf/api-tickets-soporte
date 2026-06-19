import { IsIn, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  @IsIn(['abierto', 'en_proceso', 'cerrado'], {
    message: 'Estado inválido. Valores permitidos: abierto, en_proceso o cerrado.',
  })
  estado!: string;
}