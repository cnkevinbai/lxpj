import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Permission } from './entities/permission.entity'

/**
 * 权限服务
 */
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private repository: Repository<Permission>,
  ) {}

  async findAll() {
    return this.repository.find({ order: { module: 'ASC', action: 'ASC' } })
  }

  async findOne(id: string) {
    const permission = await this.repository.findOne({ where: { id } })
    if (!permission) {
      throw new NotFoundException('Permission not found')
    }
    return permission
  }

  async create(name: string, description: string, module: string, action: string, businessType: string) {
    const permission = this.repository.create({
      name,
      description,
      module,
      action,
      businessType,
    })
    return this.repository.save(permission)
  }

  async update(id: string, data: any) {
    const permission = await this.findOne(id)
    Object.assign(permission, data)
    return this.repository.save(permission)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  /**
   * 根据用户角色和部门获取权限列表
   */
  async getUserPermissions(userId: string, role: string, department: string) {
    const query = this.repository.createQueryBuilder('permission')

    // 管理员拥有所有权限
    if (role === 'admin') {
      return this.repository.find()
    }

    // 根据部门和业务类型过滤
    query.where('permission.businessType = :businessType OR permission.businessType = :both', {
      businessType: department,
      both: 'both',
    })

    // 经理可以查看和编辑，销售只能查看自己的
    if (role === 'manager') {
      query.andWhere('permission.action IN (:...actions)', {
        actions: ['create', 'read', 'update'],
      })
    } else if (role === 'sales') {
      query.andWhere('permission.action IN (:...actions)', {
        actions: ['read', 'update'],
      })
    }

    return query.getMany()
  }

  /**
   * 检查用户是否有某个权限
   */
  async hasPermission(userId: string, permissionName: string, department: string) {
    const permission = await this.repository.findOne({
      where: {
        name: permissionName,
      },
    })

    if (!permission) {
      return false
    }

    // 检查业务类型是否匹配
    if (permission.businessType !== 'both' && permission.businessType !== department) {
      return false
    }

    return true
  }
}
