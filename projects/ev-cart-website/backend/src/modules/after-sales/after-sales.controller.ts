/**
 * 售后服务控制器
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AfterSalesService } from './services/after-sales.service'
import { AfterSalesCenterService } from './services/after-sales-center.service'
import { AfterSalesContractService } from './services/after-sales-contract.service'
import { AfterSalesPartService } from './services/after-sales-part.service'
import { AfterSalesComplaintService } from './services/after-sales-complaint.service'
import { TicketType, TicketStatus } from './entities/service-ticket.entity'

@Controller('after-sales')
@UseGuards(JwtAuthGuard)
export class AfterSalesController {
  constructor(
    private readonly afterSalesService: AfterSalesService,
    private readonly centerService: AfterSalesCenterService,
    private readonly contractService: AfterSalesContractService,
    private readonly partService: AfterSalesPartService,
    private readonly complaintService: AfterSalesComplaintService,
  ) {}

  @Post('tickets')
  async createTicket(@Body() data: any) {
    return this.afterSalesService.createTicket(data)
  }

  @Get('tickets')
  async getTickets(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: TicketType,
    @Query('status') status?: TicketStatus,
    @Query('customerId') customerId?: string,
    @Query('technicianId') technicianId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.afterSalesService.getTickets(page, limit, {
      type,
      status,
      customerId,
      technicianId,
      startDate,
      endDate,
    })
  }

  @Get('tickets/:id')
  async getTicket(@Param('id') id: string) {
    return this.afterSalesService.getTicket(id)
  }

  @Post('tickets/:id/accept')
  async acceptTicket(
    @Param('id') id: string,
    @Body('operatorId') operatorId: string,
  ) {
    return this.afterSalesService.acceptTicket(id, operatorId)
  }

  @Post('tickets/:id/assign')
  async assignTicket(
    @Param('id') id: string,
    @Body('technicianId') technicianId: string,
    @Body('technicianName') technicianName: string,
    @Body('assignedBy') assignedBy?: string,
  ) {
    return this.afterSalesService.assignTicket(id, technicianId, technicianName, assignedBy)
  }

  @Post('tickets/batch-assign')
  async batchAssignTickets(
    @Body('ticketIds') ticketIds: string[],
    @Body('technicianId') technicianId: string,
    @Body('technicianName') technicianName: string,
    @Body('assignedBy') assignedBy?: string,
  ) {
    const count = await this.afterSalesService.batchAssignTickets(
      ticketIds,
      technicianId,
      technicianName,
      assignedBy,
    )
    return { success: true, count }
  }

  @Get('tickets/to-assign')
  async getTicketsToAssign() {
    return this.afterSalesService.getTicketsToAssign()
  }

  @Get('tickets/my')
  async getMyTickets(@Query('technicianId') technicianId: string) {
    return this.afterSalesService.getMyTickets(technicianId)
  }

  @Post('tickets/:id/start')
  async startProcessing(@Param('id') id: string) {
    return this.afterSalesService.startProcessing(id)
  }

  @Post('tickets/:id/complete')
  async completeTicket(
    @Param('id') id: string,
    @Body('solution') solution: string,
    @Body('serviceFee') serviceFee?: number,
    @Body('partsFee') partsFee?: number,
  ) {
    return this.afterSalesService.completeTicket(id, solution, serviceFee, partsFee)
  }

  @Post('tickets/:id/confirm')
  async confirmTicket(
    @Param('id') id: string,
    @Body('satisfaction') satisfaction: number,
    @Body('comment') comment?: string,
  ) {
    return this.afterSalesService.confirmTicket(id, satisfaction, comment)
  }

  @Post('tickets/:id/cancel')
  async cancelTicket(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.afterSalesService.cancelTicket(id, reason)
  }

  @Get('tickets/pending/list')
  async getPendingTickets(@Query('technicianId') technicianId?: string) {
    return this.afterSalesService.getPendingTickets(technicianId)
  }

  @Get('stats/overview')
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.afterSalesService.getStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )
  }
}
