import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './entities/role.entity'
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.repository.findOne({ where: { name: createRoleDto.name } })
    if (existing) {
      throw new ConflictException('Role already exists')
    }
    const role = this.repository.create(createRoleDto)
    return this.repository.save(role)
  }

  async findAll() {
    return this.repository.find({ order: { name: 'ASC' } })
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.repository.findOne({ where: { id } })
    if (!role) {
      throw new NotFoundException('Role not found')
    }
    return role
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id)
    Object.assign(role, updateRoleDto)
    return this.repository.save(role)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async findByName(name: string): Promise<Role | null> {
    return this.repository.findOne({ where: { name } })
  }

  async getPermissions(roleId: string): Promise<string[]> {
    const role = await this.findOne(roleId)
    return role.permissions
  }

  async hasPermission(roleId: string, permission: string): Promise<boolean> {
    const role = await this.findOne(roleId)
    return role.permissions.includes(permission) || role.permissions.includes('*')
  }
}
