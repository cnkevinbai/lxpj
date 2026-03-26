/**
 * 产品服务
 * 处理产品管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED'

export interface Product {
  id: string
  name: string
  code: string
  category: string
  series: string
  price: number
  description: string | null
  images: string[] | null
  specs: Record<string, any> | null
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  code: string
  category: string
  series: string
  price: number
  description?: string
  images?: string[]
  specs?: Record<string, any>
}

export interface UpdateProductDto {
  name?: string
  category?: string
  series?: string
  price?: number
  description?: string
  images?: string[]
  specs?: Record<string, any>
  status?: ProductStatus
}

export interface ProductQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
  series?: string
  status?: ProductStatus
}

// ==================== 产品服务 ====================

export const productService = {
  /**
   * 获取产品列表
   */
  getList(params: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    return request.get<PaginatedResponse<Product>>('/products', { params })
  },

  /**
   * 获取产品详情
   */
  getOne(id: string): Promise<Product> {
    return request.get<Product>(`/products/${id}`)
  },

  /**
   * 根据编码获取产品
   */
  getByCode(code: string): Promise<Product> {
    return request.get<Product>(`/products/code/${code}`)
  },

  /**
   * 创建产品
   */
  create(dto: CreateProductDto): Promise<Product> {
    return request.post<Product>('/products', dto)
  },

  /**
   * 更新产品
   */
  update(id: string, dto: UpdateProductDto): Promise<Product> {
    return request.put<Product>(`/products/${id}`, dto)
  },

  /**
   * 删除产品
   */
  delete(id: string): Promise<void> {
    return request.delete(`/products/${id}`)
  },

  /**
   * 获取产品分类列表
   */
  getCategories(): Promise<string[]> {
    return request.get<string[]>('/products/categories')
  },

  /**
   * 获取产品系列列表
   */
  getSeries(category?: string): Promise<string[]> {
    return request.get<string[]>('/products/series', { params: { category } })
  },
}

export default productService