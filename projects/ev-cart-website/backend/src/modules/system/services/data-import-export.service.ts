import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import * as XLSX from 'xlsx';

/**
 * 数据导入导出服务
 */
@Injectable()
export class DataImportExportService {
  private readonly logger = new Logger(DataImportExportService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  // ========== 数据导出 ==========

  /**
   * 导出用户数据
   */
  async exportUsers(query: ExportQuery): Promise<ExportResult> {
    this.logger.log('导出用户数据');

    const users = await this.userRepository.find({
      where: query.departmentId ? { departmentId: query.departmentId } : {},
      relations: ['department', 'roles'],
    });

    // 转换为 Excel 格式
    const data = users.map(user => ({
      '用户名': user.username,
      '姓名': user.realName,
      '邮箱': user.email,
      '电话': user.phone,
      '部门': user.departmentName,
      '职位': user.position,
      '员工类型': user.employeeType,
      '状态': user.status,
      '入职日期': user.hireDate ? new Date(user.hireDate).toLocaleDateString() : '',
      '创建时间': new Date(user.createdAt).toLocaleDateString(),
    }));

    // 生成 Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '用户列表');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      filename: `用户列表_${new Date().toLocaleDateString()}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: buffer,
      count: users.length,
    };
  }

  /**
   * 导出部门数据
   */
  async exportDepartments(): Promise<ExportResult> {
    this.logger.log('导出部门数据');

    const departments = await this.departmentRepository.find({
      relations: ['parent'],
    });

    const data = departments.map(dept => ({
      '部门编码': dept.departmentCode,
      '部门名称': dept.departmentName,
      '上级部门': dept.parent?.departmentName || '总公司',
      '负责人': dept.managerName,
      '负责人电话': dept.managerPhone,
      '员工数': dept.employeeCount,
      '状态': dept.status,
      '成立日期': dept.establishedDate ? new Date(dept.establishedDate).toLocaleDateString() : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '部门列表');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      filename: `部门列表_${new Date().toLocaleDateString()}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: buffer,
      count: departments.length,
    };
  }

  // ========== 数据导入 ==========

  /**
   * 导入用户数据
   */
  async importUsers(file: Buffer, options: ImportOptions): Promise<ImportResult> {
    this.logger.log('导入用户数据');

    const workbook = XLSX.read(file, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const result: ImportResult = {
      total: data.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // 验证必填字段
        if (!row['用户名'] || !row['姓名'] || !row['邮箱']) {
          throw new Error('缺少必填字段');
        }

        // 检查用户是否已存在
        const existing = await this.userRepository.findOne({
          where: { username: row['用户名'] },
        });
        if (existing) {
          throw new Error('用户名已存在');
        }

        // 创建用户
        const user = this.userRepository.create({
          username: row['用户名'],
          realName: row['姓名'],
          email: row['邮箱'],
          phone: row['电话'],
          departmentId: row['部门 ID'],
          departmentName: row['部门'],
          position: row['职位'],
          employeeType: row['员工类型'] || 'employee',
          status: 'active',
          mustChangePassword: true,
        });

        await this.userRepository.save(user);
        result.success += 1;
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          row: i + 2, // Excel 行号（从 2 开始，第 1 行是标题）
          error: error.message,
          data: row,
        });
      }
    }

    return result;
  }

  /**
   * 导入部门数据
   */
  async importDepartments(file: Buffer): Promise<ImportResult> {
    this.logger.log('导入部门数据');

    const workbook = XLSX.read(file, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const result: ImportResult = {
      total: data.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // 验证必填字段
        if (!row['部门编码'] || !row['部门名称']) {
          throw new Error('缺少必填字段');
        }

        // 检查部门是否已存在
        const existing = await this.departmentRepository.findOne({
          where: { departmentCode: row['部门编码'] },
        });
        if (existing) {
          throw new Error('部门编码已存在');
        }

        // 创建部门
        const department = this.departmentRepository.create({
          departmentCode: row['部门编码'],
          departmentName: row['部门名称'],
          managerName: row['负责人'],
          managerPhone: row['负责人电话'],
          status: 'active',
        });

        await this.departmentRepository.save(department);
        result.success += 1;
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          row: i + 2,
          error: error.message,
          data: row,
        });
      }
    }

    return result;
  }

  // ========== 模板下载 ==========

  /**
   * 获取导入模板
   */
  async getImportTemplate(type: 'users' | 'departments'): Promise<ExportResult> {
    let data = [];

    if (type === 'users') {
      data = [
        {
          '用户名': 'zhangsan',
          '姓名': '张三',
          '邮箱': 'zhangsan@example.com',
          '电话': '13800138000',
          '部门 ID': '',
          '部门': '销售部',
          '职位': '销售经理',
          '员工类型': 'employee',
          '入职日期': '2026-01-01',
        },
      ];
    } else {
      data = [
        {
          '部门编码': 'DEPT001',
          '部门名称': '销售部',
          '上级部门': '总公司',
          '负责人': '张三',
          '负责人电话': '13800138000',
          '成立日期': '2026-01-01',
        },
      ];
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '模板');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      filename: `${type === 'users' ? '用户' : '部门'}导入模板.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: buffer,
      count: 1,
    };
  }
}

// ========== 类型定义 ==========

interface ExportQuery {
  departmentId?: string;
  status?: string;
}

interface ExportResult {
  filename: string;
  mimeType: string;
  data: Buffer;
  count: number;
}

interface ImportOptions {
  skipExisting?: boolean;
  defaultPassword?: string;
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}
