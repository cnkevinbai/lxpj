import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { User } from './auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateToken(user);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader?: string) {
    // JWT tokens are stateless, so logout just requires client-side token removal
    return {
      message: 'Logged out successfully',
      suggestion: '请删除客户端存储的 access_token',
    };
  }

  @Get('me')
  async getCurrentUser(@Headers('authorization') authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);
    const user = this.authService.getCurrentUser(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  @Post('refresh')
  async refresh(@Headers('authorization') authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);
    
    try {
      return this.authService.refreshToken(token);
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
