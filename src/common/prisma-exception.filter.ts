import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    // Capturamos los códigos de error más comunes de Prisma
    switch (exception.code) {
      case 'P2002': // Restricción única duplicada
        status = HttpStatus.CONFLICT;
        message = 'El registro ya existe o está duplicado.';
        break;
      case 'P2025': // Registro no encontrado
        status = HttpStatus.NOT_FOUND;
        message = 'El registro solicitado no fue encontrado.';
        break;
      default:
        // Si es otro error de Prisma, enviamos un bad request genérico o mantenemos el 500 sin exponer el stack trace
        status = HttpStatus.BAD_REQUEST;
        message = `Error en la base de datos: ${exception.message.split('\n').pop()}`;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.code,
    });
  }
}