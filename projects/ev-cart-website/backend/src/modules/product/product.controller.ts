import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProductService } from './services/product.service'
import { CreateProductDto, UpdateProductDto } from './dto/product.dto'

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: '创建产品' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

  @Get()
  @ApiOperation({ summary: '获取产品列表' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @Query('category') category?: string, @Query('status') status?: string) {
    return this.productService.findAll(page, limit, category, status)
  }

  @Get('featured')
  @ApiOperation({ summary: '获取推荐产品' })
  findFeatured(@Query('limit') limit: number = 6) {
    return this.productService.findFeatured(limit)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取产品详情' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新产品' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除产品' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id)
  }
}
