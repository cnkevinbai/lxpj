import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'evcart',
  password: process.env.DB_PASSWORD || 'evcart123',
  database: process.env.DB_NAME || 'evcart',
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
} as DataSourceOptions)

export default dataSource
