import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.repository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    })

    if (existing) {
      throw new ConflictException('User already exists')
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10)

    const user = this.repository.create({
      ...createUserDto,
      passwordHash,
    })

    return this.repository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      select: ['id', 'username', 'email', 'phone', 'avatarUrl', 'role', 'status', 'createdAt'],
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'phone', 'avatarUrl', 'role', 'status', 'lastLoginAt', 'createdAt', 'updatedAt'],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)
    Object.assign(user, updateUserDto)
    return this.repository.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.repository.remove(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } })
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash)
  }
}
