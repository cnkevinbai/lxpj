import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Customer } from './entities/customer.entity'
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto'

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private repository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.repository.create(createCustomerDto)
    return this.repository.save(customer)
  }

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    const query = this.repository.createQueryBuilder('customer')
    if (search) {
      query.where('customer.name LIKE :search', { search: `%${search}%` })
        .orWhere('customer.contactPerson LIKE :search', { search: `%${search}%` })
        .orWhere('customer.contactPhone LIKE :search', { search: `%${search}%` })
    }
    query.orderBy('customer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.repository.findOne({ where: { id } })
    if (!customer) {
      throw new NotFoundException('Customer not found')
    }
    return customer
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id)
    Object.assign(customer, updateCustomerDto)
    return this.repository.save(customer)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async findByOwner(ownerId: string): Promise<Customer[]> {
    return this.repository.find({ where: { owner: { id: ownerId } } })
  }
}
