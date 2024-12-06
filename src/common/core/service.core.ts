import { EPrismaErrorCodes } from '@common/types';
import { BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export abstract class ServiceCore {
  protected handleError(error: unknown, message?: string) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === EPrismaErrorCodes.UNIQUE_VIOLATION) {
        throw new BadRequestException(
          `${message ? message + '. ' : ''}Already exists`,
        );
      }
    }
  }
}
