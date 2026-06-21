import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    // 1. Buscar al usuario por su ID para verificar qué rol tiene
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: (createTicketDto as any).usuarioCreadorId },
    });

    // 2. Si el usuario no existe en la base de datos, lanzamos error
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${(createTicketDto as any).usuarioCreadorId} no encontrado.`);
    }

    // 3. Regla de negocio: Solo los usuarios con rol CLIENTE pueden crear tickets
    if (usuario.rol !== 'CLIENTE') {
      throw new ForbiddenException(
        'Solo los usuarios con rol cliente pueden crear tickets.',
      );
    }

    // 4. Si pasa la regla, se crea el ticket normalmente
    return this.prisma.ticket.create({
      data: createTicketDto,
    });
  }
async findAll() {
    return this.prisma.ticket.findMany();
  }
  
  async update(id: number, updateTicketDto: UpdateTicketDto) {
    // 1. Validar si el ticket de verdad existe en la base de datos
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    
    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado.`);
    }
  
    // 2. REGLA DE NEGOCIO: abierto → en_proceso → cerrado
    if (ticket.estado === 'abierto' && updateTicketDto.estado === 'cerrado') {
      throw new BadRequestException(
        'No se puede cerrar un ticket abierto directamente. Primero debe pasar a en_proceso.',
      );
    }
  
    // 3. Si la regla se cumple, se guarda la actualización de forma segura
    return this.prisma.ticket.update({
      where: { id },
      data: { estado: updateTicketDto.estado },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { usuarioCreador: true },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado.`);
    }

    return ticket;
  }
}