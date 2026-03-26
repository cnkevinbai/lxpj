import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('Customer API Integration Tests (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaClient);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    await prisma.customer.deleteMany();
  });

  describe('/crm/customers (POST)', () => {
    it('should create a new customer', () => {
      const newCustomer = {
        name: '测试企业',
        type: 'ENTERPRISE',
        industry: '制造业',
        level: 'A',
        phone: '13800138000',
        email: 'test@test.com',
      };

      return request(app.getHttpServer())
        .post('/crm/customers')
        .send(newCustomer)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe(newCustomer.name);
          expect(res.body.type).toBe(newCustomer.type);
        });
    });

    it('should fail with invalid email', () => {
      const invalidCustomer = {
        name: '测试企业',
        type: 'ENTERPRISE',
        email: 'invalid-email',
      };

      return request(app.getHttpServer())
        .post('/crm/customers')
        .send(invalidCustomer)
        .expect(400);
    });

    it('should fail with missing required fields', () => {
      const incompleteCustomer = {
        type: 'ENTERPRISE',
      };

      return request(app.getHttpServer())
        .post('/crm/customers')
        .send(incompleteCustomer)
        .expect(400);
    });
  });

  describe('/crm/customers (GET)', () => {
    it('should get customer list', async () => {
      // 创建测试数据
      await prisma.customer.create({
        data: {
          name: '测试客户 1',
          type: 'ENTERPRISE',
          email: 'test1@test.com',
        },
      });

      await prisma.customer.create({
        data: {
          name: '测试客户 2',
          type: 'INDIVIDUAL',
          email: 'test2@test.com',
        },
      });

      return request(app.getHttpServer())
        .get('/crm/customers')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.total).toBe(2);
          expect(res.body.page).toBe(1);
        });
    });

    it('should filter customers by type', async () => {
      await prisma.customer.createMany({
        data: [
          { name: '企业客户 1', type: 'ENTERPRISE' },
          { name: '个人客户 1', type: 'INDIVIDUAL' },
          { name: '企业客户 2', type: 'ENTERPRISE' },
        ],
      });

      return request(app.getHttpServer())
        .get('/crm/customers?type=ENTERPRISE')
        .expect(200)
        .expect((res) => {
          expect(res.body.total).toBe(2);
          res.body.data.forEach((customer: any) => {
            expect(customer.type).toBe('ENTERPRISE');
          });
        });
    });
  });

  describe('/crm/customers/:id (GET)', () => {
    it('should get customer by id', async () => {
      const customer = await prisma.customer.create({
        data: {
          name: '测试客户',
          type: 'ENTERPRISE',
          email: 'test@test.com',
        },
      });

      return request(app.getHttpServer())
        .get(`/crm/customers/${customer.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(customer.id);
          expect(res.body.name).toBe(customer.name);
        });
    });

    it('should return 404 for non-existent customer', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      return request(app.getHttpServer())
        .get(`/crm/customers/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/crm/customers/:id (PUT)', () => {
    it('should update customer', async () => {
      const customer = await prisma.customer.create({
        data: {
          name: '原名称',
          type: 'ENTERPRISE',
          email: 'original@test.com',
        },
      });

      const updateData = {
        name: '新名称',
        level: 'A',
      };

      return request(app.getHttpServer())
        .put(`/crm/customers/${customer.id}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('新名称');
          expect(res.body.level).toBe('A');
        });
    });
  });

  describe('/crm/customers/:id (DELETE)', () => {
    it('should delete customer', async () => {
      const customer = await prisma.customer.create({
        data: {
          name: '待删除客户',
          type: 'ENTERPRISE',
        },
      });

      return request(app.getHttpServer())
        .delete(`/crm/customers/${customer.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });
});
