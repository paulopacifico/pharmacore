import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DbModule } from 'src/db/db.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PasswordPrisma } from './password.prisma';
import { RolePrisma } from './role.prisma';
import { UserPrisma } from './user.prisma';
import { BcryptProvider } from 'src/auth/providers/bcrypt.provider';
import { RoleController } from './role.controller';
import { PermissionPrisma } from './permission.prisma';
import { AuditPrisma } from './audit.prisma';
import { OAuthAccountPrisma } from './oauth-account.prisma';
import { GoogleOAuthProvider } from './providers/google-oauth.provider';

@Module({
  imports: [
    DbModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController, RoleController],
  providers: [
    UserPrisma,
    PasswordPrisma,
    RolePrisma,
    PermissionPrisma,
    AuditPrisma,
    OAuthAccountPrisma,
    GoogleOAuthProvider,
    JwtStrategy,
    BcryptProvider,
  ],
  exports: [
    UserPrisma,
    PasswordPrisma,
    RolePrisma,
    PermissionPrisma,
    AuditPrisma,
    OAuthAccountPrisma,
    BcryptProvider,
  ],
})
export class AuthModule {}
