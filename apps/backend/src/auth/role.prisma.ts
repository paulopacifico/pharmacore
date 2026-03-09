import {
  FindAllRolesInDTO,
  FindAllRolesOutDTO,
  FindAllRolesQuery,
  Role,
  RoleDTO,
  RoleRepository,
  RolesExistence,
} from '@pharmacore/auth';
import { Result } from '@pharmacore/shared';
import { Injectable } from '@nestjs/common';
import { RoleGetPayload } from 'prisma/generated/prisma/models';
import { PrismaService } from 'src/db/prisma.service';
import { RoleErrors } from 'src/errors';

type RolePayload = RoleGetPayload<{
  include: {
    permissions: {
      include: {
        permission: {
          select: {
            id: true;
            name: true;
            alias: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class RolePrisma implements RoleRepository, RolesExistence {
  constructor(private readonly prisma: PrismaService) {}

  readonly findAllRolesQuery: FindAllRolesQuery = {
    execute: async ({
      page,
      pageSize,
      all,
    }: FindAllRolesInDTO): Promise<Result<FindAllRolesOutDTO>> => {
      try {
        const safePageSize = Math.min(
          Math.max(Math.floor(pageSize || 10), 1),
          100,
        );
        const safeRequestedPage = Math.max(Math.floor(page || 1), 1);
        const total = await this.prisma.client.role.count();
        const totalPages = total === 0 ? 0 : Math.ceil(total / safePageSize);
        const safePage =
          totalPages === 0 ? 1 : Math.min(safeRequestedPage, totalPages);
        const skip = (safePage - 1) * safePageSize;

        const results = all
          ? await this.prisma.client.role.findMany({
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            })
          : await this.prisma.client.role.findMany({
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
              skip,
              take: safePageSize,
              orderBy: { createdAt: 'desc' },
            });

        const data: RoleDTO[] = results.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          permissions: r.permissions.map((p) => ({
            id: p.permission.id,
            name: p.permission.name,
            alias: p.permission.alias,
          })),
        }));

        return Result.ok({
          data,
          meta: {
            page: all ? 1 : safePage,
            pageSize: all ? total : safePageSize,
            total,
            totalPages: all ? (total > 0 ? 1 : 0) : totalPages,
          },
        });
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  async create(entity: Role): Promise<Result<void>> {
    try {
      const { permissionIds, ...data } = this.fromDomain(entity);
      const uniquePermissionIds = Array.from(new Set(permissionIds));

      await this.prisma.client.$transaction(async (tx) => {
        const createdRole = await tx.role.create({
          data,
          select: { id: true },
        });

        if (uniquePermissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: uniquePermissionIds.map((permissionId) => ({
              roleId: createdRole.id,
              permissionId,
            })),
            skipDuplicates: true,
          });
        }
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }
  async update(entity: Role): Promise<Result<void>> {
    try {
      const { permissionIds, ...data } = this.fromDomain(entity);
      const uniquePermissionIds = Array.from(new Set(permissionIds));

      await this.prisma.client.$transaction(async (tx) => {
        await tx.role.update({
          where: { id: entity.id },
          data: {
            ...data,
          },
        });

        await tx.rolePermission.deleteMany({
          where: { roleId: entity.id },
        });

        if (uniquePermissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: uniquePermissionIds.map((permissionId) => ({
              roleId: entity.id,
              permissionId,
            })),
            skipDuplicates: true,
          });
        }
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findByName(name: string): Promise<Result<Role>> {
    try {
      const r = await this.prisma.client.role.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          deletedAt: null,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      if (!r) return Result.fail(RoleErrors.NOT_FOUND);

      return Result.ok(this.toDomain(r)!);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findById(id: string): Promise<Result<Role>> {
    try {
      const r = await this.prisma.client.role.findUnique({
        where: { id },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      if (!r) return Result.fail(RoleErrors.NOT_FOUND);
      return Result.ok(this.toDomain(r)!);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.prisma.client.role.delete({
        where: { id },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async exists(ids: string[]): Promise<Result<boolean>> {
    try {
      if (ids.length === 0) {
        return Result.ok(true);
      }

      const uniqueIds = Array.from(new Set(ids));

      const count = await this.prisma.client.role.count({
        where: {
          id: { in: uniqueIds },
        },
      });

      return Result.ok(count === uniqueIds.length);
    } catch (error) {
      return Result.fail(error);
    }
  }

  private toDomain(r: RolePayload): Role | null {
    if (!r) return null;

    const permissionIds =
      r.permissions?.map((p) => {
        return p.permissionId;
      }) ?? [];

    const role = Role.create({
      id: r.id,
      name: r.name,
      description: r.description,
      permissionIds,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      deletedAt: r.deletedAt,
    });

    return role;
  }

  private fromDomain(r: Role) {
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      deletedAt: r.deletedAt,
      permissionIds: r.permissionIds,
    };
  }
}
