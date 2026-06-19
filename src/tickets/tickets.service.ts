import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: createTicketDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Operación rechazada: El usuario con ID ${createTicketDto.usuarioId} no existe.`);
    }

    return this.prisma.ticket.create({
      data: {
        titulo: createTicketDto.titulo,
        descripcion: createTicketDto.descripcion,
        usuarioId: createTicketDto.usuarioId,
        estado: 'abierto',
      },
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: { usuarioCreador: true },
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket con ID ${id} no encontrado.`);

    return this.prisma.ticket.update({
      where: { id },
      data: { estado: updateTicketDto.estado },
    });
  }
}