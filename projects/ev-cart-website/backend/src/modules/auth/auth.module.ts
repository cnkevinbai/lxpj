import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemUser } from './entities/system-user.entity'
import { SystemRole } from './entities/system-role.entity'
import { AuthService } from './services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemUser, SystemRole]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'evcart-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
