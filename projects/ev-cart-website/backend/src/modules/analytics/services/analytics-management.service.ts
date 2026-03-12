import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ReportTemplate } from '../entities/report-template.entity';
import { Dashboard } from '../entities/dashboard.entity';
import { DataAlert } from '../entities/data-alert.entity';
import { ForecastData } from '../entities/forecast-data.entity';

/**
 * 报表分析管理服务
 */
@Injectable()
export class AnalyticsManagementService {
  private readonly logger = new Logger(AnalyticsManagementService.name);

  constructor(
    @InjectRepository(ReportTemplate)
    private reportTemplateRepository: Repository<ReportTemplate>,
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
    @InjectRepository(DataAlert)
    private dataAlertRepository: Repository<DataAlert>,
    @InjectRepository(ForecastData)
    private forecastRepository: Repository<ForecastData>,
    private dataSource: DataSource,
  ) {}

  // ========== 报表模板管理 ==========

  /**
   * 创建报表模板
   */
  async createReportTemplate(data: CreateReportTemplateDto): Promise<ReportTemplate> {
    this.logger.log(`创建报表模板：${data.templateName}`);

    const template = this.reportTemplateRepository.create({
      ...data,
      templateCode: await this.generateTemplateCode(data.category),
      status: 'active',
    });

    await this.reportTemplateRepository.save(template);

    this.logger.log(`报表模板创建成功：${template.templateCode}`);

    return template;
  }

  /**
   * 获取报表模板列表
   */
  async getReportTemplates(query: ReportTemplateQuery): Promise<ReportTemplateResult> {
    const { page = 1, limit = 20, category, status } = query;

    const queryBuilder = this.reportTemplateRepository.createQueryBuilder('template');

    if (category) {
      queryBuilder.andWhere('template.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('template.status = :status', { status });
    }

    const [items, total] = await queryBuilder
      .orderBy('template.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 执行报表
   */
  async executeReport(templateId: string, params: any): Promise<ReportResult> {
    const template = await this.reportTemplateRepository.findOne({ where: { id: templateId } });
    if (!template) {
      throw new Error('报表模板不存在');
    }

    // 更新使用次数
    template.usageCount += 1;
    await this.reportTemplateRepository.save(template);

    // 根据数据源配置执行查询
    const data = await this.executeDataSourceQuery(template.dataSource, params);

    return {
      template,
      data,
      columns: template.columns,
      filters: template.filters,
      charts: template.charts,
    };
  }

  // ========== 数据驾驶舱 ==========

  /**
   * 创建驾驶舱
   */
  async createDashboard(data: CreateDashboardDto): Promise<Dashboard> {
    this.logger.log(`创建驾驶舱：${data.dashboardName}`);

    const dashboard = this.dashboardRepository.create({
      ...data,
      dashboardCode: await this.generateDashboardCode(data.category),
      status: 'active',
    });

    await this.dashboardRepository.save(dashboard);

    this.logger.log(`驾驶舱创建成功：${dashboard.dashboardCode}`);

    return dashboard;
  }

  /**
   * 获取驾驶舱数据
   */
  async getDashboardData(dashboardId: string): Promise<DashboardData> {
    const dashboard = await this.dashboardRepository.findOne({ where: { id: dashboardId } });
    if (!dashboard) {
      throw new Error('驾驶舱不存在');
    }

    // 获取各组件数据
    const widgetsData = [];
    for (const widget of dashboard.widgets) {
      const data = await this.executeDataSourceQuery(widget.dataSource, widget.params);
      widgetsData.push({
        id: widget.id,
        type: widget.type,
        data,
        config: widget.config,
      });
    }

    return {
      dashboard,
      widgetsData,
      layout: dashboard.layout,
    };
  }

  /**
   * 获取管理驾驶舱（高管视图）
   */
  async getExecutiveDashboard(): Promise<ExecutiveDashboardData> {
    // 销售数据
    const salesData = await this.getSalesSummary();
    
    // 财务数据
    const financeData = await this.getFinanceSummary();
    
    // 生产数据
    const productionData = await this.getProductionSummary();
    
    // 人力数据
    const hrData = await this.getHrSummary();

    return {
      sales: salesData,
      finance: financeData,
      production: productionData,
      hr: hrData,
      updatedAt: new Date(),
    };
  }

  // ========== 数据预警 ==========

  /**
   * 创建预警规则
   */
  async createDataAlert(data: CreateDataAlertDto): Promise<DataAlert> {
    this.logger.log(`创建预警规则：${data.alertName}`);

    const alert = this.dataAlertRepository.create({
      ...data,
      alertCode: await this.generateAlertCode(data.alertType),
      status: 'active',
    });

    await this.dataAlertRepository.save(alert);

    this.logger.log(`预警规则创建成功：${alert.alertCode}`);

    return alert;
  }

  /**
   * 检查预警
   */
  async checkAlerts(): Promise<AlertCheckResult> {
    const alerts = await this.dataAlertRepository.find({ where: { status: 'active' } });
    
    const result: AlertCheckResult = {
      total: alerts.length,
      triggered: 0,
      alerts: [],
    };

    for (const alert of alerts) {
      const triggered = await this.evaluateAlertCondition(alert.condition);
      
      if (triggered) {
        result.triggered += 1;
        result.alerts.push({
          alert,
          triggeredAt: new Date(),
        });

        // 发送通知
        await this.sendAlertNotification(alert);

        // 更新触发次数
        alert.triggerCount += 1;
        alert.lastTriggerTime = new Date();
        await this.dataAlertRepository.save(alert);
      }
    }

    return result;
  }

  // ========== 预测分析 ==========

  /**
   * 销售预测
   */
  async salesForecast(productIds?: string[], months: number = 3): Promise<ForecastResult> {
    this.logger.log(`销售预测：${months}个月`);

    // 获取历史销售数据
    const historicalData = await this.getHistoricalSales(productIds, 12);

    // 使用移动平均法预测
    const forecasts = [];
    for (let i = 0; i < months; i++) {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i + 1);

      const period = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
      
      // 简单移动平均预测
      const recentData = historicalData.slice(-3);
      const avgValue = recentData.reduce((sum, d) => sum + d.value, 0) / recentData.length;
      
      // 计算增长率
      const growthRate = recentData.length > 1 
        ? ((recentData[recentData.length - 1].value - recentData[0].value) / recentData[0].value) * 100 
        : 0;

      const forecastValue = avgValue * (1 + growthRate / 100);

      forecasts.push({
        forecastType: 'sales',
        forecastPeriod: period,
        forecastDate,
        actualValue: null,
        forecastValue,
        growthRate,
        model: 'moving_average',
      });
    }

    // 保存预测数据
    for (const forecast of forecasts) {
      await this.forecastRepository.save(forecast);
    }

    return {
      type: 'sales',
      historicalData,
      forecasts,
      accuracy: this.calculateForecastAccuracy(historicalData, forecasts),
    };
  }

  /**
   * 库存预测
   */
  async inventoryForecast(productIds?: string[], months: number = 3): Promise<ForecastResult> {
    this.logger.log(`库存预测：${months}个月`);

    // 获取历史库存数据
    const historicalData = await this.getHistoricalInventory(productIds, 12);

    // 预测
    const forecasts = [];
    for (let i = 0; i < months; i++) {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i + 1);

      const period = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
      
      // 基于销售预测和安全库存计算
      const currentStock = historicalData[historicalData.length - 1]?.value || 0;
      const safetyStock = currentStock * 0.3; // 安全库存为当前库存的 30%
      
      forecasts.push({
        forecastType: 'inventory',
        forecastPeriod: period,
        forecastDate,
        actualValue: null,
        forecastValue: safetyStock,
        model: 'safety_stock',
      });
    }

    return {
      type: 'inventory',
      historicalData,
      forecasts,
    };
  }

  // ========== 辅助方法 ==========

  private async generateTemplateCode(category: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.reportTemplateRepository.count({
      where: {
        category,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(3, '0');

    return `RPT${category.toUpperCase().substring(0, 3)}${year}${month}${sequence}`;
  }

  private async generateDashboardCode(category: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.dashboardRepository.count({
      where: {
        category,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(3, '0');

    return `DASH${category.toUpperCase().substring(0, 3)}${year}${month}${sequence}`;
  }

  private async generateAlertCode(alertType: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.dataAlertRepository.count({
      where: {
        alertType,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(3, '0');

    return `ALT${alertType.toUpperCase().substring(0, 3)}${year}${month}${sequence}`;
  }

  private async executeDataSourceQuery(dataSource: any, params: any): Promise<any> {
    // 根据数据源配置执行查询
    // 简化处理
    return { data: [] };
  }

  private async getSalesSummary(): Promise<any> {
    // 获取销售汇总数据
    return {
      totalSales: 0,
      monthGrowth: 0,
      topProducts: [],
      topCustomers: [],
    };
  }

  private async getFinanceSummary(): Promise<any> {
    // 获取财务汇总数据
    return {
      revenue: 0,
      profit: 0,
      cashFlow: 0,
      receivables: 0,
      payables: 0,
    };
  }

  private async getProductionSummary(): Promise<any> {
    // 获取生产汇总数据
    return {
      output: 0,
      qualityRate: 0,
      oee: 0,
      onTimeDelivery: 0,
    };
  }

  private async getHrSummary(): Promise<any> {
    // 获取人力汇总数据
    return {
      totalEmployees: 0,
      newHires: 0,
      resignations: 0,
      attendanceRate: 0,
    };
  }

  private async evaluateAlertCondition(condition: any): Promise<boolean> {
    // 评估预警条件
    // 简化处理
    return false;
  }

  private async sendAlertNotification(alert: DataAlert): Promise<void> {
    // 发送预警通知
    this.logger.log(`发送预警通知：${alert.alertName}`);
  }

  private async getHistoricalSales(productIds: string[], months: number): Promise<any[]> {
    // 获取历史销售数据
    return [];
  }

  private async getHistoricalInventory(productIds: string[], months: number): Promise<any[]> {
    // 获取历史库存数据
    return [];
  }

  private calculateForecastAccuracy(historical: any[], forecasts: any[]): number {
    // 计算预测准确率
    return 0;
  }
}

// ========== 类型定义 ==========

interface CreateReportTemplateDto {
  templateName: string;
  category: 'sales' | 'purchase' | 'inventory' | 'finance' | 'hr' | 'production' | 'quality';
  reportType?: 'table' | 'chart' | 'dashboard' | 'pivot';
  dataSource: any;
  columns?: any[];
  filters?: any[];
  charts?: any[];
  layout?: any;
  description?: string;
  createdBy?: string;
  createdByName?: string;
}

interface ReportTemplateQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}

interface ReportTemplateResult {
  items: ReportTemplate[];
  total: number;
  page: number;
  limit: number;
}

interface ReportResult {
  template: ReportTemplate;
  data: any;
  columns: any[];
  filters: any[];
  charts: any[];
}

interface CreateDashboardDto {
  dashboardName: string;
  category: 'executive' | 'sales' | 'production' | 'finance' | 'hr';
  widgets: any[];
  layout?: any;
  refreshInterval?: number;
  isPublic?: boolean;
  visibleRoles?: string[];
  visibleUsers?: string[];
  description?: string;
  createdBy?: string;
  createdByName?: string;
}

interface DashboardData {
  dashboard: Dashboard;
  widgetsData: any[];
  layout: any;
}

interface ExecutiveDashboardData {
  sales: any;
  finance: any;
  production: any;
  hr: any;
  updatedAt: Date;
}

interface CreateDataAlertDto {
  alertName: string;
  alertType: 'sales' | 'inventory' | 'finance' | 'production' | 'quality' | 'hr';
  severity?: 'info' | 'warning' | 'error' | 'critical';
  condition: any;
  dataSource: string;
  notifyUsers?: string[];
  notifyRoles?: string[];
  sendEmail?: boolean;
  sendSms?: boolean;
  sendDingtalk?: boolean;
  description?: string;
}

interface AlertCheckResult {
  total: number;
  triggered: number;
  alerts: Array<{ alert: DataAlert; triggeredAt: Date }>;
}

interface ForecastResult {
  type: string;
  historicalData: any[];
  forecasts: any[];
  accuracy?: number;
}
