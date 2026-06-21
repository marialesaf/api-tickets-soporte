import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.prisma.usuario.create({ 
        data: createUsuarioDto 
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('El correo electrónico ya se encuentra registrado.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      include: { tickets: true },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { tickets: true },
    });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // 1. Validamos si el usuario existe antes de alterar algo
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    // 2. Intentamos actualizar capturando si duplican un correo (Mediano 1)
    try {
      return await this.prisma.usuario.update({
        where: { id },
        data: updateUsuarioDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('El correo electrónico ya se encuentra registrado.');
      }
      throw error;
    }
  }
}