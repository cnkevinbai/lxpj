/**
 * 服务网点服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceCenter, CenterType } from './entities/service-center.entity'

@Injectable()
export class AfterSalesCenterService {
  constructor(
    @InjectRepository(ServiceCenter)
    private centerRepository: Repository<ServiceCenter>,
  ) {}

  /**
   * 创建服务网点
   */
  async create(data: Partial<ServiceCenter>): Promise<ServiceCenter> {
    const center = this.centerRepository.create(data)
    return this.centerRepository.save(center)
  }

  /**
   * 获取网点列表
   */
  async getCenters(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: CenterType
      province?: string
      city?: string
      isActive?: boolean
    },
  ) {
    const query = this.centerRepository.createQueryBuilder('center')
      .orderBy('center.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.type) {
      query.andWhere('center.type = :type', { type: filters.type })
    }
    if (filters?.province) {
      query.andWhere('center.province = :province', { province: filters.province })
    }
    if (filters?.city) {
      query.andWhere('center.city = :city', { city: filters.city })
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('center.isActive = :isActive', { isActive: filters.isActive })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取网点详情
   */
  async getCenter(id: string): Promise<ServiceCenter> {
    const center = await this.centerRepository.findOne({ where: { id } })
    if (!center) {
      throw new NotFoundException('服务网点不存在')
    }
    return center
  }

  /**
   * 更新网点
   */
  async update(id: string, data: Partial<ServiceCenter>): Promise<ServiceCenter> {
    const center = await this.getCenter(id)
    Object.assign(center, data)
    return this.centerRepository.save(center)
  }

  /**
   * 删除网点
   */
  async delete(id: string): Promise<void> {
    await this.centerRepository.delete(id)
  }

  /**
   * 获取附近网点 (根据经纬度)
   */
  async getNearbyCenters(
    longitude: number,
    latitude: number,
    distance: number = 50, // 公里
  ) {
    // 简化版：获取所有网点后计算距离
    const centers = await this.centerRepository.find({ where: { isActive: true } })
    
    const nearby = centers.filter(center => {
      const d = this.calculateDistance(
        latitude,
        longitude,
        center.latitude,
        center.longitude,
      )
      return d <= distance
    }).map(center => ({
      ...center,
      distance: this.calculateDistance(
        latitude,
        longitude,
        center.latitude,
        center.longitude,
      ),
    })).sort((a, b) => a.distance - b.distance)

    return nearby
  }

  /**
   * 计算两点距离 (Haversine 公式)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371 // 地球半径 (公里)
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * 获取网点统计
   */
  async getCenterStats() {
    const total = await this.centerRepository.count()
    const byType = await this.centerRepository
      .createQueryBuilder('center')
      .select('type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('type')
      .getRawMany()

    const byProvince = await this.centerRepository
      .createQueryBuilder('center')
      .select('province', 'province')
      .addSelect('COUNT(*)', 'count')
      .groupBy('province')
      .getRawMany()

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count)
        return acc
      }, {}),
      byProvince: byProvince.reduce((acc, item) => {
        acc[item.province] = parseInt(item.count)
        return acc
      }, {}),
    }
  }
}
