/**
 * 权限装饰器
 * 用于标记路由所需的权限
 */
import { SetMetadata } from '@nestjs/common'

/**
 * 权限元数据 Key
 */
export const PERMISSIONS_KEY = 'permissions'

/**
 * 权限装饰器
 * 标记路由所需的权限列表
 *
 * @param permissions 权限标识列表
 * @example
 * @Permissions('crm:customer:view', 'crm:customer:edit')
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @Get(':id')
 * getCustomer(@Param('id') id: string) {}
 */
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions)
