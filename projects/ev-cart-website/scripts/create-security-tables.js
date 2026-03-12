/**
 * 数据安全模块 - 数据库表创建脚本
 * 使用 Node.js 执行，无需 psql 客户端
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 数据库配置
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'evcart',
  password: process.env.DB_PASSWORD || 'evcart123',
  database: process.env.DB_NAME || 'evcart',
};

async function createTables() {
  const client = new Client(config);
  
  try {
    console.log('📦 正在连接数据库...');
    await client.connect();
    console.log('✅ 数据库连接成功');

    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, '..', 'database/migrations/security-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    console.log('📝 正在执行 SQL 脚本...');
    await client.query(sql);
    console.log('✅ SQL 执行成功');

    // 验证表创建
    console.log('\n🔍 验证表创建...');
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE tablename IN (
        'export_limits', 
        'export_records', 
        'user_handovers', 
        'handover_items'
      )
      ORDER BY tablename
    `);

    console.log('\n✅ 已创建的表:');
    result.rows.forEach(row => {
      console.log(`   - ${row.tablename}`);
    });

    // 验证默认数据
    console.log('\n📊 验证默认配置...');
    const defaults = await client.query(`
      SELECT dataType, dailyLimit, singleLimit, requiresApproval 
      FROM export_limits 
      WHERE userId = 'default'
    `);

    console.log(`✅ 默认导出限制配置：${defaults.rows.length} 条`);
    defaults.rows.forEach(row => {
      console.log(`   - ${row.dataType}: 每日${row.dailyLimit}次，单次${row.singleLimit}条`);
    });

    console.log('\n🎉 数据安全模块表创建完成！');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTables();
