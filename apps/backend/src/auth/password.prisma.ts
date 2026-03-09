import {
  FindPasswordHashQuery,
  Password,
  PasswordRepository,
  PasswordStatus,
} from '@pharmacore/auth';
import { Result } from '@pharmacore/shared';
import { Injectable } from '@nestjs/common';
import { PasswordGetPayload } from 'prisma/generated/prisma/models';
import { PrismaService } from 'src/db/prisma.service';
import { UserErrors } from 'src/errors';

type PasswordPayload = PasswordGetPayload<{}>;

@Injectable()
export class PasswordPrisma implements PasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  readonly findPasswordHashQuery: FindPasswordHashQuery = {
    execute: async (userId): Promise<Result<{ hash: string }>> => {
      try {
        const p = await this.prisma.client.password.findFirst({
          where: { userId: userId, status: 'ACTIVE' },
        });
        if (!p) return Result.fail(UserErrors.NOT_FOUND);
        return Result.ok({ hash: p.content });
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  async create(entity: Password, userId: string): Promise<Result<Password>> {
    try {
      await this.prisma.client.password.create({
        data: {
          id: entity.id,
          content: entity.content,
          status: entity.status,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          deletedAt: entity.deletedAt,
          userId,
        },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async update(entity: Password): Promise<Result<void>> {
    try {
      await this.prisma.client.password.update({
        where: { id: entity.id },
        data: this.fromDomain(entity),
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findByUserId(id: string): Promise<Result<Password>> {
    try {
      const p = await this.prisma.client.password.findFirst({
        where: { userId: id, status: 'ACTIVE' },
      });
      if (!p) return Result.fail(UserErrors.NOT_FOUND);
      return Result.ok(this.toDomain(p)!);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findById(id: string): Promise<Result<Password>> {
    try {
      const p = await this.prisma.client.password.findUnique({
        where: { id },
      });
      if (!p) return Result.fail(UserErrors.NOT_FOUND);
      return Result.ok(this.toDomain(p)!);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findAll(): Promise<Result<Password[]>> {
    try {
      const results = await this.prisma.client.password.findMany();
      if (results.length === 0) return Result.ok([]);
      return Result.ok(results.map((p) => this.toDomain(p)!));
    } catch (error) {
      return Result.fail(error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.prisma.client.password.delete({
        where: { id },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  private toDomain(p: PasswordPayload): Password | null {
    if (!p) return null;
    return Password.create({
      id: p.id,
      content: p.content,
      status: p.status as PasswordStatus,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt,
    });
  }

  private fromDomain(p: Password) {
    return {
      id: p.id,
      content: p.content,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt,
    };
  }
}
