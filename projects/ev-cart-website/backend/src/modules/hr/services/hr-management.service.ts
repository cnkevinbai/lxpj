import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { LeaveRecord } from '../entities/leave-record.entity';
import { PayrollRecord } from '../entities/payroll-record.entity';
import { PerformanceRecord } from '../entities/performance-record.entity';
import { HttpService } from '@nestjs/axios';

/**
 * 人力资源管理服务
 */
@Injectable()
export class HrManagementService {
  private readonly logger = new Logger(HrManagementService.name);

  // 钉钉配置
  private dingtalkConfig = {
    appKey: process.env.DINGTALK_APP_KEY,
    appSecret: process.env.DINGTALK_APP_SECRET,
    corpId: process.env.DINGTALK_CORP_ID,
  };

  private dingtalkAccessToken: string = '';
  private tokenExpiresAt: Date = null;

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(LeaveRecord)
    private leaveRepository: Repository<LeaveRecord>,
    @InjectRepository(PayrollRecord)
    private payrollRepository: Repository<PayrollRecord>,
    @InjectRepository(PerformanceRecord)
    private performanceRepository: Repository<PerformanceRecord>,
    private dataSource: DataSource,
    private httpService: HttpService,
  ) {}

  // ========== 员工管理 ==========

  /**
   * 创建员工档案
   */
  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    this.logger.log(`创建员工档案：${data.employeeName}`);

    const employee = this.employeeRepository.create({
      ...data,
      employeeCode: await this.generateEmployeeCode(),
      status: 'probation',
    });

    await this.employeeRepository.save(employee);

    this.logger.log(`员工档案创建成功：${employee.employeeCode}`);

    return employee;
  }

  /**
   * 员工转正
   */
  async regularizeEmployee(employeeId: string, regularizeDate: Date): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
    if (!employee) {
      throw new Error('员工不存在');
    }

    employee.status = 'active';
    employee.regularDate = regularizeDate;

    await this.employeeRepository.save(employee);

    this.logger.log(`员工转正成功：${employee.employeeCode}`);

    return employee;
  }

  /**
   * 员工离职
   */
  async resignEmployee(employeeId: string, data: ResignEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
    if (!employee) {
      throw new Error('员工不存在');
    }

    employee.status = 'resigned';
    employee.resignationDate = data.resignationDate;
    employee.resignationReason = data.resignationReason;
    employee.resignationType = data.resignationType;

    await this.employeeRepository.save(employee);

    this.logger.log(`员工离职成功：${employee.employeeCode}`);

    return employee;
  }

  // ========== 考勤管理（钉钉集成） ==========

  /**
   * 获取钉钉 Access Token
   */
  async getDingtalkAccessToken(): Promise<string> {
    // 检查 token 是否过期
    if (this.dingtalkAccessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return this.dingtalkAccessToken;
    }

    try {
      const url = `https://oapi.dingtalk.com/gettoken?appkey=${this.dingtalkConfig.appKey}&appsecret=${this.dingtalkConfig.appSecret}`;
      
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;

      if (data.errcode === 0) {
        this.dingtalkAccessToken = data.access_token;
        this.tokenExpiresAt = new Date(Date.now() + (data.expires_in - 60) * 1000);
        this.logger.log('钉钉 access_token 获取成功');
        return this.dingtalkAccessToken;
      } else {
        throw new Error(`钉钉 token 获取失败：${data.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`钉钉 token 获取失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 同步钉钉考勤数据
   */
  async syncDingtalkAttendance(startDate: Date, endDate: Date): Promise<SyncResult> {
    this.logger.log(`同步钉钉考勤数据：${startDate} 至 ${endDate}`);

    try {
      const accessToken = await this.getDingtalkAccessToken();
      
      // 获取考勤列表
      const url = `https://oapi.dingtalk.com/attendance/list?access_token=${accessToken}`;
      
      const response = await this.httpService.axiosRef.post(url, {
        workDateFrom: this.formatDate(startDate),
        workDateTo: this.formatDate(endDate),
        offset: 0,
        limit: 100,
      });

      const data = response.data;

      if (data.errcode !== 0) {
        throw new Error(`钉钉考勤数据获取失败：${data.errmsg}`);
      }

      const result: SyncResult = {
        total: 0,
        success: 0,
        failed: 0,
        errors: [],
      };

      // 处理考勤记录
      for (const dingtalkRecord of data.user_attendances || []) {
        result.total += 1;

        try {
          // 查找对应员工
          const employee = await this.employeeRepository.findOne({
            where: { dingtalkUserId: dingtalkRecord.userid },
          });

          if (!employee) {
            result.failed += 1;
            result.errors.push({
              userid: dingtalkRecord.userid,
              error: '员工不存在',
            });
            continue;
          }

          // 创建或更新考勤记录
          const attendanceDate = new Date(dingtalkRecord.work_date);
          
          let record = await this.attendanceRepository.findOne({
            where: {
              employeeId: employee.id,
              attendanceDate,
            },
          });

          if (!record) {
            record = this.attendanceRepository.create({
              recordNo: await this.generateAttendanceNo(),
              employeeId: employee.id,
              employeeName: employee.employeeName,
              employeeCode: employee.employeeCode,
              dingtalkUserId: employee.dingtalkUserId,
              attendanceDate,
              source: 'dingtalk',
            });
          }

          // 更新考勤数据
          record.status = this.convertDingtalkStatus(dingtalkRecord.status);
          record.checkInTime = dingtalkRecord.check_in_time ? new Date(dingtalkRecord.check_in_time) : null;
          record.checkOutTime = dingtalkRecord.check_out_time ? new Date(dingtalkRecord.check_out_time) : null;
          record.workHours = dingtalkRecord.working_time || 0;
          record.lateMinutes = dingtalkRecord.late_time || 0;
          record.earlyLeaveMinutes = dingtalkRecord.early_leave_time || 0;
          record.overtimeHours = dingtalkRecord.overtime_duration || 0;
          record.dingtalkSyncTime = new Date();

          await this.attendanceRepository.save(record);
          result.success += 1;
        } catch (error) {
          result.failed += 1;
          result.errors.push({
            userid: dingtalkRecord.userid,
            error: error.message,
          });
        }
      }

      this.logger.log(`钉钉考勤同步完成：成功${result.success}，失败${result.failed}`);

      return result;
    } catch (error) {
      this.logger.error(`钉钉考勤同步失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 创建请假记录
   */
  async createLeave(data: CreateLeaveDto): Promise<LeaveRecord> {
    this.logger.log(`创建请假记录：${data.employeeName}, ${data.leaveType}`);

    const leave = this.leaveRepository.create({
      ...data,
      leaveNo: await this.generateLeaveNo(),
      status: 'pending',
    });

    await this.leaveRepository.save(leave);

    this.logger.log(`请假记录创建成功：${leave.leaveNo}`);

    return leave;
  }

  /**
   * 审批请假
   */
  async approveLeave(leaveId: string, approved: boolean, comment: string, approverId: string, approverName: string): Promise<LeaveRecord> {
    const leave = await this.leaveRepository.findOne({ where: { id: leaveId } });
    if (!leave) {
      throw new Error('请假记录不存在');
    }

    leave.status = approved ? 'approved' : 'rejected';
    leave.approverId = approverId;
    leave.approverName = approverName;
    leave.approvedDate = new Date();
    leave.approvalComment = comment;

    await this.leaveRepository.save(leave);

    this.logger.log(`请假审批完成：${leave.leaveNo}, ${approved ? '通过' : '拒绝'}`);

    return leave;
  }

  // ========== 薪酬管理 ==========

  /**
   * 计算薪酬
   */
  async calculatePayroll(employeeId: string, period: string): Promise<PayrollRecord> {
    this.logger.log(`计算薪酬：${employeeId}, ${period}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 获取员工信息
      const employee = await queryRunner.manager.findOne(Employee, {
        where: { id: employeeId },
      });

      if (!employee) {
        throw new Error('员工不存在');
      }

      // 获取考勤数据
      const [year, month] = period.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const attendanceRecords = await queryRunner.manager.find(AttendanceRecord, {
        where: {
          employeeId,
          attendanceDate: () => `BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
        },
      });

      // 统计考勤数据
      const workDays = attendanceRecords.filter(r => r.status === 'normal').length;
      const leaveDays = attendanceRecords.filter(r => r.status === 'leave').reduce((sum, r) => sum + Number(r.leaveDays || 0), 0);
      const overtimeHours = attendanceRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
      const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
      const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;

      // 获取请假记录
      const leaveRecords = await queryRunner.manager.find(LeaveRecord, {
        where: {
          employeeId,
          status: 'approved',
          startDate: () => `BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
        },
      });

      const approvedLeaveDays = leaveRecords.reduce((sum, r) => sum + Number(r.totalDays || 0), 0);

      // 获取绩效数据
      const performance = await queryRunner.manager.findOne(PerformanceRecord, {
        where: {
          employeeId,
          performancePeriod: period,
          status: 'approved',
        },
      });

      const performanceScore = performance?.finalScore || 0;
      const performanceBonus = performance?.performanceBonus || 0;

      // 计算应发项目
      const baseSalary = employee.baseSalary;
      const performanceSalary = employee.performanceSalary * (performanceScore / 100);
      const overtimePay = overtimeHours * 50; // 加班费 50 元/小时
      const mealAllowance = workDays * 20; // 餐补 20 元/天
      const transportAllowance = employee.transportAllowance || 0;
      const communicationAllowance = employee.communicationAllowance || 0;
      const bonus = performanceBonus;

      const grossSalary = baseSalary + performanceSalary + overtimePay + mealAllowance + transportAllowance + communicationAllowance + bonus;

      // 计算扣款项目
      const socialSecurityPersonal = employee.socialSecurityBase * 0.105; // 社保个人 10.5%
      const housingFundPersonal = employee.housingFundBase * 0.12; // 公积金个人 12%
      
      // 计算个税（简化计算）
      const taxableIncome = grossSalary - socialSecurityPersonal - housingFundPersonal - 5000; // 减除费用 5000
      const individualIncomeTax = this.calculateIncomeTax(taxableIncome);

      const leaveDeduction = (leaveDays - approvedLeaveDays) * (baseSalary / 21.75); // 请假扣款
      const absentDeduction = absentDays * (baseSalary / 21.75); // 缺勤扣款

      const totalDeduction = socialSecurityPersonal + housingFundPersonal + individualIncomeTax + leaveDeduction + absentDeduction;

      // 实发工资
      const netSalary = grossSalary - totalDeduction;

      // 创建薪酬记录
      const payroll = queryRunner.manager.create(PayrollRecord, {
        payrollNo: await this.generatePayrollNo(),
        employeeId: employee.id,
        employeeName: employee.employeeName,
        employeeCode: employee.employeeCode,
        departmentId: employee.departmentId,
        departmentName: employee.departmentName,
        payrollPeriod: period,
        payrollMonth: startDate,
        status: 'calculated',
        
        // 应发项目
        baseSalary,
        performanceSalary,
        mealAllowance,
        transportAllowance,
        communicationAllowance,
        overtimePay,
        bonus,
        grossSalary,
        
        // 扣款项目
        socialSecurityPersonal,
        housingFundPersonal,
        individualIncomeTax,
        leaveDeduction,
        absentDeduction,
        totalDeduction,
        
        // 实发工资
        netSalary,
        
        // 社保公积金
        socialSecurityBase: employee.socialSecurityBase,
        housingFundBase: employee.housingFundBase,
        pensionInsurance: employee.socialSecurityBase * 0.08,
        medicalInsurance: employee.socialSecurityBase * 0.02,
        unemploymentInsurance: employee.socialSecurityBase * 0.005,
        housingFund: employee.housingFundBase * 0.12,
        socialSecurityCompany: employee.socialSecurityBase * 0.16,
        housingFundCompany: employee.housingFundBase * 0.12,
        
        // 考勤数据
        workDays,
        actualWorkDays: workDays,
        leaveDays,
        overtimeHours,
        lateCount,
        absentDays,
        
        // 发放信息
        bankAccount: employee.bankAccount,
        bankName: employee.bankName,
        
        // 计算信息
        calculatedById: 'system',
        calculatedByName: '系统自动计算',
        calculatedDate: new Date(),
      });

      await queryRunner.manager.save(payroll);

      await queryRunner.commitTransaction();

      this.logger.log(`薪酬计算成功：${payroll.payrollNo}, 实发：${netSalary}`);

      return payroll;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`薪酬计算失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 批量计算薪酬
   */
  async calculateBatchPayroll(period: string, employeeIds?: string[]): Promise<BatchPayrollResult> {
    this.logger.log(`批量计算薪酬：${period}`);

    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');
    queryBuilder.where('employee.status IN (:...statuses)', { statuses: ['active', 'probation'] });

    if (employeeIds && employeeIds.length > 0) {
      queryBuilder.andWhere('employee.id IN (:...ids)', { ids: employeeIds });
    }

    const employees = await queryBuilder.getMany();

    const result: BatchPayrollResult = {
      period,
      total: employees.length,
      success: 0,
      failed: 0,
      payrolls: [],
      errors: [],
    };

    for (const employee of employees) {
      try {
        const payroll = await this.calculatePayroll(employee.id, period);
        result.success += 1;
        result.payrolls.push(payroll);
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          employeeId: employee.id,
          employeeName: employee.employeeName,
          error: error.message,
        });
      }
    }

    this.logger.log(`批量薪酬计算完成：成功${result.success}，失败${result.failed}`);

    return result;
  }

  /**
   * 审核薪酬
   */
  async auditPayroll(payrollId: string, auditorId: string, auditorName: string): Promise<PayrollRecord> {
    const payroll = await this.payrollRepository.findOne({ where: { id: payrollId } });
    if (!payroll) {
      throw new Error('薪酬记录不存在');
    }

    payroll.status = 'audited';
    payroll.auditedById = auditorId;
    payroll.auditedByName = auditorName;
    payroll.auditedDate = new Date();

    await this.payrollRepository.save(payroll);

    this.logger.log(`薪酬审核成功：${payroll.payrollNo}`);

    return payroll;
  }

  /**
   * 发放薪酬
   */
  async payPayroll(payrollId: string, paidById: string, paidByName: string): Promise<PayrollRecord> {
    const payroll = await this.payrollRepository.findOne({ where: { id: payrollId } });
    if (!payroll) {
      throw new Error('薪酬记录不存在');
    }

    payroll.status = 'paid';
    payroll.paidById = paidById;
    payroll.paidByName = paidByName;
    payroll.paidDate = new Date();

    await this.payrollRepository.save(payroll);

    this.logger.log(`薪酬发放成功：${payroll.payrollNo}`);

    return payroll;
  }

  // ========== 辅助方法 ==========

  private async generateEmployeeCode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.employeeRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `EMP${year}${month}${sequence}`;
  }

  private async generateAttendanceNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.attendanceRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `ATT${year}${month}${sequence}`;
  }

  private async generateLeaveNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.leaveRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `LEAVE${year}${month}${sequence}`;
  }

  private async generatePayrollNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.payrollRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `PAY${year}${month}${sequence}`;
  }

  private convertDingtalkStatus(dingtalkStatus: string): string {
    const statusMap: Record<string, string> = {
      'Normal': 'normal',
      'Late': 'late',
      'EarlyLeave': 'early_leave',
      'Absent': 'absent',
      'Leave': 'leave',
      'BusinessTrip': 'business_trip',
      'Outdoor': 'outdoor',
    };
    return statusMap[dingtalkStatus] || 'normal';
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private calculateIncomeTax(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;

    const brackets = [
      { limit: 3000, rate: 0.03, quickDeduction: 0 },
      { limit: 12000, rate: 0.1, quickDeduction: 210 },
      { limit: 25000, rate: 0.2, quickDeduction: 1410 },
      { limit: 35000, rate: 0.25, quickDeduction: 2660 },
      { limit: 55000, rate: 0.3, quickDeduction: 4410 },
      { limit: 80000, rate: 0.35, quickDeduction: 7160 },
      { limit: Infinity, rate: 0.45, quickDeduction: 15160 },
    ];

    for (const bracket of brackets) {
      if (taxableIncome <= bracket.limit) {
        return taxableIncome * bracket.rate - bracket.quickDeduction;
      }
    }

    return 0;
  }
}

// ========== 类型定义 ==========

interface CreateEmployeeDto {
  employeeName: string;
  gender?: 'male' | 'female';
  birthday?: Date;
  nationality?: string;
  ethnicity?: string;
  idCardNo?: string;
  idCardAddress?: string;
  currentAddress?: string;
  maritalStatus?: string;
  childrenCount?: number;
  politicalStatus?: string;
  education?: string;
  major?: string;
  graduationDate?: Date;
  graduationSchool?: string;
  departmentId?: string;
  departmentName?: string;
  position?: string;
  employeeType?: 'full_time' | 'part_time' | 'intern' | 'contract' | 'dispatch';
  hireDate?: Date;
  probationStartDate?: Date;
  probationEndDate?: Date;
  phone?: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  baseSalary?: number;
  performanceSalary?: number;
  allowance?: number;
  socialSecurityBase?: number;
  housingFundBase?: number;
  bankAccount?: string;
  bankName?: string;
  dingtalkUserId?: string;
  dingtalkJobNumber?: string;
  isDingtalkSync?: boolean;
  skills?: string[];
  workExperience?: string;
  educationExperience?: string;
  certificates?: string[];
  remark?: string;
  createdBy?: string;
  createdByName?: string;
}

interface ResignEmployeeDto {
  resignationDate: Date;
  resignationReason?: string;
  resignationType?: string;
}

interface SyncResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ userid: string; error: string }>;
}

interface CreateLeaveDto {
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  departmentId?: string;
  departmentName?: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  attachments?: string[];
  submittedById?: string;
  submittedByName?: string;
}

interface BatchPayrollResult {
  period: string;
  total: number;
  success: number;
  failed: number;
  payrolls: PayrollRecord[];
  errors: Array<{ employeeId: string; employeeName: string; error: string }>;
}
