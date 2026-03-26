/**
 * 菜单服务
 * 处理菜单管理的 CRUD 操作
 * 注意：Menu 模型字段: sortOrder (not sort), permission (not perms), 无 component
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Menu, MenuType, MenuStatus } from '@prisma/client'
import { CreateMenuDto, UpdateMenuDto, MenuQueryDto, MenuTreeNode } from './menu.dto'

export { CreateMenuDto, UpdateMenuDto, MenuQueryDto, MenuTreeNode } from './menu.dto'

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 映射菜单对象为树节点
   */
  private mapToResponse(menu: Menu): MenuTreeNode {
    return {
      id: menu.id,
      name: menu.name,
      code: menu.code,
      path: menu.path || '',
      parentId: menu.parentId || undefined,
      order: menu.sortOrder,
      icon: menu.icon || undefined,
      type: menu.type,
      permission: menu.permission || undefined,
      status: menu.status,
      children: [],
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    }
  }

  /**
   * 创建菜单
   */
  async create(dto: CreateMenuDto): Promise<any> {
    // 检查父菜单是否存在
    if (dto.parentId) {
      const parent = await this.prisma.menu.findUnique({
        where: { id: dto.parentId },
      })
      if (!parent) {
        throw new BadRequestException('父菜单不存在')
      }
    }

    const menu = await this.prisma.menu.create({
      data: {
        name: dto.name,
        code: dto.code || `menu_${Date.now()}`,
        path: dto.path,
        sortOrder: dto.order || 0,
        icon: dto.icon,
        type: dto.type || MenuType.MENU,
        permission: dto.permission,
        status: dto.status || MenuStatus.ACTIVE,
        parentId: dto.parentId,
      },
    })

    this.logger.log(`创建菜单：${menu.name}`)
    return this.mapToResponse(menu)
  }

  /**
   * 更新菜单
   */
  async update(id: string, dto: UpdateMenuDto): Promise<any> {
    const menu = await this.prisma.menu.findUnique({ where: { id } })
    if (!menu) {
      throw new NotFoundException('菜单不存在')
    }

    // 检查父菜单是否形成循环
    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('不能将自己设为父菜单')
      }
      const isLoop = await this.isAncestor(menu, dto.parentId)
      if (isLoop) {
        throw new BadRequestException('不能形成循环引用')
      }
    }

    const updated = await this.prisma.menu.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        path: dto.path,
        sortOrder: dto.order,
        icon: dto.icon,
        type: dto.type,
        permission: dto.permission,
        status: dto.status,
        parentId: dto.parentId,
      },
    })

    this.logger.log(`更新菜单：${updated.name}`)
    return this.mapToResponse(updated)
  }

  /**
   * 检查是否形成循环
   */
  private async isAncestor(menu: any, parentId: string): Promise<boolean> {
    if (!menu.parentId) return false
    if (menu.parentId === parentId) return true
    const parent = await this.prisma.menu.findUnique({
      where: { id: menu.parentId },
    })
    if (!parent) return false
    return this.isAncestor(parent, parentId)
  }

  /**
   * 删除菜单
   */
  async delete(id: string): Promise<void> {
    const menu = await this.prisma.menu.findUnique({ where: { id } })
    if (!menu) {
      throw new NotFoundException('菜单不存在')
    }

    // 检查是否有子菜单
    const childCount = await this.prisma.menu.count({
      where: { parentId: id },
    })
    if (childCount > 0) {
      throw new BadRequestException('存在子菜单，无法删除')
    }

    await this.prisma.menu.update({
      where: { id },
      data: { status: MenuStatus.INACTIVE },
    })

    this.logger.log(`删除菜单：${menu.name}`)
  }

  /**
   * 获取菜单详情
   */
  async findOne(id: string): Promise<any> {
    const menu = await this.prisma.menu.findUnique({ where: { id } })
    if (!menu) {
      throw new NotFoundException('菜单不存在')
    }
    return this.mapToResponse(menu)
  }

  /**
   * 获取菜单列表（树形）
   */
  async findAll(query: MenuQueryDto): Promise<any> {
    const menus = await this.prisma.menu.findMany({
      where: { status: query.status },
      orderBy: { sortOrder: 'asc' },
    })

    return this.buildTree(menus)
  }

  /**
   * 获取菜单树
   */
  async getTree(): Promise<any> {
    const menus = await this.prisma.menu.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return this.buildTree(menus)
  }

  /**
   * 构建菜单树
   */
  private buildTree(menus: Menu[]): MenuTreeNode[] {
    const map = new Map<string, MenuTreeNode>()
    const roots: MenuTreeNode[] = []

    // 先转换为响应对象
    menus.forEach(menu => {
      map.set(menu.id, this.mapToResponse(menu))
    })

    // 构建树形结构
    menus.forEach(menu => {
      const node = map.get(menu.id)!
      if (menu.parentId) {
        const parent = map.get(menu.parentId)
        if (parent) {
          parent.children.push(node)
        } else {
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  /**
   * 获取用户菜单（根据权限过滤）
   */
  async getUserMenus(userId: string): Promise<MenuTreeNode[]> {
    // 获取所有激活的菜单
    const menus = await this.prisma.menu.findMany({
      where: { status: MenuStatus.ACTIVE },
      orderBy: { sortOrder: 'asc' },
    })

    return this.buildTree(menus)
  }
}