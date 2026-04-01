/**
 * Auth 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生认证服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'

// NestJS 原生组件
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

// 热插拔模块
import { AuthHotplugModule, AUTH_HOTPLUG_MODULE } from './auth.hotplug.module'

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { PermissionsGuard } from './guards/permissions.guard'

// Decorators
import { Public } from './decorators/public.decorator'
import { Roles } from './decorators/roles.decorator'
import { Permissions } from './decorators/permissions.decorator'

@Global()
@Module({
  imports: [
    // Passport 模块
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT 模块
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'daoda-platform-secret-key-2026',
        signOptions: {
          expiresIn: '2h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    // 热插拔模块实例
    {
      provide: 'AUTH_HOTPLUG_MODULE',
      useValue: new AuthHotplugModule(),
    },
  ],
  exports: [
    AuthService,
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    'AUTH_HOTPLUG_MODULE',
  ],
})
export class AuthNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = AUTH_HOTPLUG_MODULE
}
