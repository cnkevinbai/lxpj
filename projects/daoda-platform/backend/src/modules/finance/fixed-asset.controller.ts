/**
 * 固定资产管理控制器
 * API 接口：资产台账、折旧计算、资产盘点、资产处置
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import {
  FixedAssetService,
  AssetStatus,
  AssetCategory,
  DepreciationMethod,
  DisposeType,
} from './fixed-asset.service'
import { CreateFixedAssetDto, UpdateFixedAssetDto, CreateDisposeDto } from './dto/fixed-asset.dto'

@ApiTags('固定资产管理')
@ApiBearerAuth()
@Controller('api/finance/fixed-asset')
export class FixedAssetController {
  constructor(private readonly service: FixedAssetService) {}

  // ========== 资产管理 ==========

  @Get('assets')
  @ApiOperation({
    summary: '获取资产列表',
    description: '分页查询固定资产列表，支持按分类、状态、部门筛选',
  })
  getAssets(@Query() params?: any) {
    return this.service.getAssets(params)
  }

  @Get('assets/:id')
  @ApiOperation({ summary: '获取资产详情', description: '根据ID获取固定资产详细信息' })
  getAsset(@Param('id') id: string) {
    return this.service.getAsset(id)
  }

  @Post('assets')
  @ApiOperation({ summary: '创建资产', description: '创建新的固定资产记录' })
  createAsset(@Body() asset: CreateFixedAssetDto) {
    return this.service.createAsset(asset)
  }

  @Post('assets/:id')
  @ApiOperation({ summary: '更新资产', description: '更新固定资产信息' })
  updateAsset(@Param('id') id: string, @Body() updates: UpdateFixedAssetDto) {
    return this.service.updateAsset(id, updates)
  }

  @Delete('assets/:id')
  @ApiOperation({ summary: '删除资产', description: '删除固定资产记录' })
  deleteAsset(@Param('id') id: string) {
    return this.service.deleteAsset(id)
  }

  // ========== 折旧管理 ==========

  @Post('depreciation/calculate')
  @ApiOperation({ summary: '计算折旧', description: '计算指定资产的折旧金额' })
  calculateDepreciation(@Body('assetId') assetId: string, @Body('period') period: string) {
    return this.service.calculateDepreciation(assetId, period)
  }

  @Post('depreciation/:id/post')
  @ApiOperation({ summary: '过账折旧', description: '将折旧记录过账，更新资产净值' })
  postDepreciation(@Param('id') id: string, @Body('postedBy') postedBy: string) {
    return this.service.postDepreciation(id, postedBy)
  }

  @Get('depreciation')
  @ApiOperation({ summary: '获取折旧记录', description: '查询折旧记录列表' })
  getDepreciationRecords(@Query() params?: any) {
    return this.service.getDepreciationRecords(params)
  }

  // ========== 盘点管理 ==========

  @Post('inventory')
  @ApiOperation({ summary: '创建盘点', description: '创建资产盘点任务' })
  createInventory(@Body() inventory: any) {
    return this.service.createInventory(inventory)
  }

  @Get('inventory')
  @ApiOperation({ summary: '获取盘点列表', description: '查询资产盘点记录列表' })
  getInventories(@Query() params?: any) {
    return this.service.getInventories(params)
  }

  @Get('inventory/:id')
  @ApiOperation({ summary: '获取盘点详情', description: '获取盘点任务详细信息' })
  getInventory(@Param('id') id: string) {
    return this.service.getInventory(id)
  }

  // ========== 处置管理 ==========

  @Post('dispose')
  @ApiOperation({ summary: '创建处置申请', description: '创建资产处置申请' })
  createDispose(@Body() dispose: CreateDisposeDto) {
    return this.service.createDispose(dispose as any)
  }

  @Get('dispose')
  @ApiOperation({ summary: '获取处置列表', description: '查询资产处置记录列表' })
  getDisposes(@Query() params?: any) {
    return this.service.getDisposes(params)
  }

  @Post('dispose/:id/approve')
  @ApiOperation({ summary: '审批处置', description: '审批资产处置申请' })
  approveDispose(@Param('id') id: string, @Body('approvedBy') approvedBy: string) {
    return this.service.approveDispose(id, approvedBy)
  }

  // ========== 统计 ==========

  @Get('stats')
  @ApiOperation({ summary: '获取资产统计', description: '获取固定资产统计数据' })
  getStats() {
    return this.service.getStats()
  }
}
