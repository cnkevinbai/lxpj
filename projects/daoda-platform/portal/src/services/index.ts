/**
 * 服务层统一导出
 */
export { default as api, request } from './api'
export { authService } from './auth.service'
export { userService } from './user.service'
export { customerService } from './customer.service'
export { productService } from './product.service'
export { orderService } from './order.service'
export { ticketService, contractService, partService } from './service.service'
export { leadService } from './lead.service'
export { opportunityService } from './opportunity.service'
export { roleService } from './role.service'
export { systemConfigService } from './system-config.service'
export { newsService } from './news.service'
export { caseService } from './case.service'
export { videoService } from './video.service'
export { inventoryService } from './inventory.service'
export { purchaseService } from './purchase.service'
export { productionService } from './production.service'
export { productionPlanService } from './production-plan.service'
export { bomService } from './bom.service'
export { logService } from './log.service'
export { menuService } from './menu.service'
export { apiKeyService } from './api-key.service'
export { tenantService } from './tenant.service'
export { 
  invoiceService, 
  receivableService, 
  payableService, 
  financeStatsService,
} from './finance.service'

// 类型导出
export type { UserInfo, LoginResponse, LoginDto, RegisterDto } from './auth.service'
export type { User, UserRole, UserStatus, CreateUserDto, UpdateUserDto, UserQueryParams } from './user.service'
export type { Customer, CustomerLevel, CustomerStatus, CreateCustomerDto, UpdateCustomerDto, CustomerQueryParams, FollowUp, CreateFollowUpDto } from './customer.service'
export type { Product, ProductStatus, CreateProductDto, UpdateProductDto, ProductQueryParams } from './product.service'
export type { Order, OrderItem, OrderStatus, PaymentStatus, CreateOrderDto, UpdateOrderDto, OrderQueryParams, OrderStatistics } from './order.service'
export type { ServiceTicket, TicketPriority, TicketStatus, CreateTicketDto, UpdateTicketDto, TicketQueryParams, TicketStatistics } from './service.service'
export type { Lead, LeadStatus, CreateLeadDto, UpdateLeadDto, LeadQueryParams } from './lead.service'
export type { Opportunity, OpportunityStage, CreateOpportunityDto, UpdateOpportunityDto, OpportunityQueryParams } from './opportunity.service'
export type { Role, Permission, CreateRoleDto, UpdateRoleDto, RoleQueryParams } from './role.service'
export type { SystemConfig, ConfigCategory, UpdateSystemConfigDto } from './system-config.service'
export type { News, NewsStatus, CreateNewsDto, UpdateNewsDto, NewsQueryParams } from './news.service'
export type { Case, CaseStatus, CreateCaseDto, UpdateCaseDto, CaseQueryParams } from './case.service'
export type { Video, VideoStatus, CreateVideoDto, UpdateVideoDto, VideoQueryParams } from './video.service'
export type { 
  Inventory, 
  CreateInventoryDto, 
  UpdateInventoryDto, 
  InventoryQueryParams,
  InventoryAdjustment,
  CreateAdjustmentDto,
} from './inventory.service'
export type { 
  PurchaseOrder, 
  PurchaseOrderItem,
  PurchaseStatus,
  CreatePurchaseOrderDto, 
  UpdatePurchaseOrderDto, 
  PurchaseOrderQueryParams,
  CreatePurchaseOrderItemDto,
  ApprovePurchaseOrderDto,
} from './purchase.service'
export type { 
  ProductionOrder, 
  ProductionStatus,
  CreateProductionOrderDto, 
  UpdateProductionOrderDto, 
  ProductionOrderQueryParams,
  ProductionProcess,
  CreateProcessDto,
} from './production.service'
export type { 
  Tenant, 
  CreateTenantDto, 
  UpdateTenantDto 
} from './tenant.service'
export { 
  employeeService, 
  attendanceService, 
  salaryService, 
  hrStatsService,
} from './hr.service'
export type {
  Employee,
  EmployeeStatus,
  EmployeeLevel,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeQueryParams,
  Attendance,
  AttendanceStatus,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  AttendanceQueryParams,
  Salary,
  SalaryStatus,
  CreateSalaryDto,
  UpdateSalaryDto,
  SalaryQueryParams,
  HRStats,
} from './hr.service'
export type {
  Invoice,
  InvoiceType,
  InvoiceStatus,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceQueryParams,
  Receivable,
  ReceivableStatus,
  CreateReceivableDto,
  UpdateReceivableDto,
  ReceivableQueryParams,
  Payable,
  PayableStatus,
  CreatePayableDto,
  UpdatePayableDto,
  PayableQueryParams,
  FinanceStats,
  TrendData,
} from './finance.service'

// 新增服务类型导出
export type {
  Bom,
  BomItem,
  BomStatus,
  CreateBomDto,
  UpdateBomDto,
  CreateBomItemDto,
  UpdateBomItemDto,
  BomQueryParams,
} from './bom.service'

export type {
  ProductionPlan,
  ProductionPlanItem,
  PlanStatus,
  CreateProductionPlanDto,
  UpdateProductionPlanDto,
  CreatePlanItemDto,
  UpdatePlanItemDto,
  PlanQueryParams,
} from './production-plan.service'

export type {
  OperationLog,
  LogStatus,
  LogQueryParams,
} from './log.service'

export type {
  Menu,
  MenuType,
  MenuStatus,
  CreateMenuDto,
  UpdateMenuDto,
  MenuQueryParams,
} from './menu.service'

export type {
  ApiKey,
  ApiKeyStatus,
  CreateApiKeyDto,
  UpdateApiKeyDto,
  ApiKeyQueryParams,
  ApiKeyUsage,
} from './api-key.service'
