import { AuthGuard } from '@nestjs/passport'

export class LocalAuthGuard = AuthGuard('local')
export class JwtAuthGuard = AuthGuard('jwt')
