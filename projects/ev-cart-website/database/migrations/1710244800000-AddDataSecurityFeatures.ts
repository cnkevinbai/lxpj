/**
 * 数据安全功能迁移
 * 创建时间：2026-03-12
 * 内容：导出限制、导出记录、离职交接
 */

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class AddDataSecurityFeatures1710244800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================== 导出限制表 ====================
    await queryRunner.createTable(
      new Table({
        name: 'export_limits',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'dataType',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'dailyLimit',
            type: 'int',
            default: 10,
            isNullable: false,
          },
          {
            name: 'singleLimit',
            type: 'int',
            default: 1000,
            isNullable: false,
          },
          {
            name: 'todayCount',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'todayRecordCount',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'lastResetDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'requiresApproval',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'approverId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    )

    // 添加索引
    await queryRunner.createIndices('export_limits', [
      new TableIndex({ name: 'idx_export_limits_userId', columnNames: ['userId'] }),
      new TableIndex({ name: 'idx_export_limits_dataType', columnNames: ['dataType'] }),
      new TableIndex({
        name: 'idx_export_limits_userId_dataType',
        columnNames: ['userId', 'dataType'],
        isUnique: true,
      }),
    ])

    // ==================== 导出记录表 ====================
    await queryRunner.createTable(
      new Table({
        name: 'export_records',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'userName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'dataType',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'recordCount',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'approverId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'approverName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'approvedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'rejectReason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ip',
            type: 'varchar',
            length: '45',
            isNullable: false,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'downloadUrl',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'downloadExpiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'downloadCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    )

    // 添加索引
    await queryRunner.createIndices('export_records', [
      new TableIndex({ name: 'idx_export_records_userId', columnNames: ['userId'] }),
      new TableIndex({ name: 'idx_export_records_dataType', columnNames: ['dataType'] }),
      new TableIndex({ name: 'idx_export_records_status', columnNames: ['status'] }),
      new TableIndex({ name: 'idx_export_records_createdAt', columnNames: ['createdAt'] }),
    ])

    // ==================== 离职交接单表 ====================
    await queryRunner.createTable(
      new Table({
        name: 'user_handovers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'leavingUserId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'leavingUserName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'receiverUserId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'receiverUserName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'handoverType',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'customerCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'leadCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'opportunityCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'orderCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'todoCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'handoverList',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'approverId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'approverName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'approvedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelReason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    )

    // 添加索引
    await queryRunner.createIndices('user_handovers', [
      new TableIndex({ name: 'idx_user_handovers_leavingUserId', columnNames: ['leavingUserId'] }),
      new TableIndex({ name: 'idx_user_handovers_receiverUserId', columnNames: ['receiverUserId'] }),
      new TableIndex({ name: 'idx_user_handovers_status', columnNames: ['status'] }),
    ])

    // ==================== 交接清单项表 ====================
    await queryRunner.createTable(
      new Table({
        name: 'handover_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'handoverId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'itemType',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'itemId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'itemName',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'remark',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    )

    // 添加索引
    await queryRunner.createIndices('handover_items', [
      new TableIndex({ name: 'idx_handover_items_handoverId', columnNames: ['handoverId'] }),
      new TableIndex({ name: 'idx_handover_items_itemId', columnNames: ['itemId'] }),
    ])

    // ==================== 插入默认导出限制配置 ====================
    await queryRunner.query(`
      INSERT INTO export_limits (userId, dataType, dailyLimit, singleLimit, requiresApproval)
      VALUES 
        ('default', 'customer', 10, 1000, false),
        ('default', 'lead', 10, 1000, false),
        ('default', 'opportunity', 10, 1000, false),
        ('default', 'order', 10, 1000, false),
        ('default', 'dealer', 10, 1000, false)
      ON CONFLICT (userId, dataType) DO NOTHING
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('handover_items')
    await queryRunner.dropTable('user_handovers')
    await queryRunner.dropTable('export_records')
    await queryRunner.dropTable('export_limits')
  }
}
