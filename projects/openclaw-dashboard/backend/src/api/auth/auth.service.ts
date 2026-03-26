import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, JwtPayload } from './auth.entity';

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: 'admin',
      username: 'admin',
      password: '123456', // Plain text password
      email: 'admin@openclaw.local',
      role: 'admin',
    },
  ];

  constructor(private jwtService: JwtService) {}

  // Validate user credentials
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.username === username);
    if (!user || !user.password) {
      return null;
    }

    // First check if password is already hashed
    if (user.password.startsWith('$2a$')) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }
    } else {
      // Plain text comparison for default user
      if (user.password !== password) {
        return null;
      }
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  // Generate JWT token
  generateToken(user: User): { access_token: string; expires_in: number } {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      expires_in: 3600, // 1 hour
    };
  }

  // Decode and verify token
  verifyToken(token: string): JwtPayload | null {
    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      return payload;
    } catch (error) {
      return null;
    }
  }

  // Refresh token (generates new token with same payload)
  refreshToken(token: string): { access_token: string; expires_in: number } {
    const payload = this.verifyToken(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    const user = this.users.find(u => u.id === payload.id);
    if (!user) {
      throw new Error('User not found');
    }

    return this.generateToken(user);
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Get current user from token
  getCurrentUser(token: string): User | null {
    const payload = this.verifyToken(token);
    if (!payload) {
      return null;
    }

    return this.users.find(u => u.id === payload.id) || null;
  }
}
