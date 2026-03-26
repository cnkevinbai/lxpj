import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from '../../common/prisma/prisma.service'

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService, PrismaService],
})
export class UserModule {}
