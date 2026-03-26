import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('foreign-customer')
@Controller('foreign-customer')
export class ForeignCustomerController {
  @Get() findAll() { return [] }
  @Get(':id') findOne(@Param('id') id: string) { return { id } }
  @Post() create(@Body() body: any) { return body }
}
