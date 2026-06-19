import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const emailExiste = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (emailExiste) {
      throw new ConflictException('El correo electrónico ya se encuentra registrado.');
    }

    return this.prisma.usuario.create({ data: createUsuarioDto });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      include: { tickets: true },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    return usuario;
  }
}