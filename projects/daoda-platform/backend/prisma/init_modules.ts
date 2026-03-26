/**
 * 数据库初始化：创建 module_configs 表
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating module_configs table...')

  // 1. Create ModuleConfig table
  await prisma.$executeRaw `
    CREATE TABLE IF NOT EXISTS "module_configs" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "module_code" VARCHAR(50) UNIQUE NOT NULL,
      "module_name" VARCHAR(100) NOT NULL,
      "enabled" BOOLEAN DEFAULT true,
      "description" TEXT,
      "config" JSONB,
      "sort_order" INTEGER DEFAULT 0,
      "created_at" TIMESTAMPTZ DEFAULT now(),
      "updated_at" TIMESTAMPTZ DEFAULT now()
    )
  `
  console.log('✅ Created table: module_configs')

  // 2. Create index on module_code
  await prisma.$executeRaw `
    CREATE INDEX IF NOT EXISTS idx_module_configs_module_code ON "module_configs"("module_code")
  `
  console.log('✅ Created index: idx_module_configs_module_code')

  // 3. Create index on enabled
  await prisma.$executeRaw `
    CREATE INDEX IF NOT EXISTS idx_module_configs_enabled ON "module_configs"("enabled")
  `
  console.log('✅ Created index: idx_module_configs_enabled')

  // 4. Insert default module configs
  const defaultModules = [
    { moduleCode: 'auth', moduleName: '认证管理', enabled: true, sortOrder: 0 },
    { moduleCode: 'crm', moduleName: 'CRM管理', enabled: true, sortOrder: 1 },
    { moduleCode: 'erp', moduleName: 'ERP管理', enabled: true, sortOrder: 2 },
    { moduleCode: 'finance', moduleName: '财务管理', enabled: true, sortOrder: 3 },
    { moduleCode: 'hr', moduleName: '人事管理', enabled: true, sortOrder: 4 },
    { moduleCode: 'service', moduleName: '售后服务', enabled: true, sortOrder: 5 },
    { moduleCode: 'cms', moduleName: '内容管理', enabled: true, sortOrder: 6 },
    { moduleCode: 'settings', moduleName: '系统设置', enabled: true, sortOrder: 99 },
  ]

  for (const module of defaultModules) {
    await prisma.$executeRaw `
      INSERT INTO "module_configs" ("module_code", "module_name", "enabled", "sort_order")
      VALUES (${module.moduleCode}, ${module.moduleName}, ${module.enabled}, ${module.sortOrder})
      ON CONFLICT ("module_code") DO NOTHING
    `
    console.log(`✅ Inserted module: ${module.moduleName}`)
  }

  console.log('\n🎉 Initialization complete!')
}

main()
  .catch((e) => {
    console.error('❌ Initialization failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
