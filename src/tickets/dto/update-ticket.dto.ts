import { IsIn, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  @IsIn(['en_proceso', 'cerrado'], {
    message: 'Estado inválido. Solo puedes cambiar a: en_proceso o cerrado.',
  })
  estado!: string;
}