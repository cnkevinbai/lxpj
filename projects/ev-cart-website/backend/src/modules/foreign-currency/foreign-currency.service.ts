import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Currency, CurrencyRateHistory } from './entities/currency.entity'

export interface ConvertCurrencyDto {
  amount: number
  fromCurrency: string
  toCurrency: string
  date?: Date
}

export interface ExchangeRateDto {
  fromCurrency: string
  toCurrency: string
  rate: number
  inverseRate: number
  date: Date
}

@Injectable()
export class ForeignCurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(CurrencyRateHistory)
    private rateHistoryRepository: Repository<CurrencyRateHistory>,
  ) {}

  /**
   * 获取所有可用货币
   */
  async getAllCurrencies(enabledOnly = true): Promise<Currency[]> {
    const where = enabledOnly ? { enabled: true } : {}
    return this.currencyRepository.find({ where, order: { code: 'ASC' } })
  }

  /**
   * 获取货币详情
   */
  async getCurrency(code: string): Promise<Currency> {
    const currency = await this.currencyRepository.findOne({ where: { code } })
    if (!currency) {
      throw new NotFoundException(`货币 ${code} 不存在`)
    }
    return currency
  }

  /**
   * 货币转换
   */
  async convertCurrency(dto: ConvertCurrencyDto): Promise<{
    originalAmount: number
    convertedAmount: number
    fromCurrency: string
    toCurrency: string
    rate: number
    date: Date
  }> {
    const { amount, fromCurrency, toCurrency, date = new Date() } = dto

    // 获取汇率
    const rateInfo = await this.getExchangeRate(fromCurrency, toCurrency, date)

    const convertedAmount = parseFloat((amount * rateInfo.rate).toFixed(2))

    return {
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      rate: rateInfo.rate,
      date,
    }
  }

  /**
   * 获取汇率
   */
  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    date = new Date(),
  ): Promise<ExchangeRateDto> {
    // 尝试查找历史汇率
    const history = await this.rateHistoryRepository.findOne({
      where: {
        fromCurrency,
        toCurrency,
        rateDate: Between(
          new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
        ),
      },
      order: { createdAt: 'DESC' },
    })

    if (history) {
      return {
        fromCurrency,
        toCurrency,
        rate: history.rate,
        inverseRate: history.inverseRate || 1 / history.rate,
        date: history.rateDate,
      }
    }

    // 如果没有历史汇率，使用基础汇率计算
    const from = await this.currencyRepository.findOne({ where: { code: fromCurrency } })
    const to = await this.currencyRepository.findOne({ where: { code: toCurrency } })

    if (!from || !to) {
      throw new NotFoundException(`货币 ${fromCurrency} 或 ${toCurrency} 不存在`)
    }

    // 通过 CNY 计算交叉汇率
    const rate = from.rateToCNY / to.rateToCNY

    return {
      fromCurrency,
      toCurrency,
      rate,
      inverseRate: 1 / rate,
      date,
    }
  }

  /**
   * 更新汇率
   */
  async updateRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
    source?: string,
    remark?: string,
  ): Promise<CurrencyRateHistory> {
    const history = this.rateHistoryRepository.create({
      fromCurrency,
      toCurrency,
      rate,
      inverseRate: 1 / rate,
      source,
      remark,
      rateDate: new Date(),
    })

    return this.rateHistoryRepository.save(history)
  }

  /**
   * 批量更新汇率（通过 CNY 基准）
   */
  async updateRatesFromCNY(rates: Record<string, number>): Promise<void> {
    const queryRunner = this.rateHistoryRepository.manager.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      for (const [code, rateToCNY] of Object.entries(rates)) {
        // 更新货币基础汇率
        await queryRunner.manager.update(
          Currency,
          { code },
          { rateToCNY, updatedAt: new Date() },
        )

        // 记录历史
        await queryRunner.manager.save(CurrencyRateHistory, {
          fromCurrency: code,
          toCurrency: 'CNY',
          rate: rateToCNY,
          inverseRate: 1 / rateToCNY,
          source: 'manual',
          rateDate: new Date(),
        })
      }

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  /**
   * 获取汇率趋势（最近 N 天）
   */
  async getRateTrend(
    fromCurrency: string,
    toCurrency: string,
    days = 30,
  ): Promise<CurrencyRateHistory[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return this.rateHistoryRepository.find({
      where: {
        fromCurrency,
        toCurrency,
        rateDate: Between(startDate, new Date()),
      },
      order: { rateDate: 'ASC' },
    })
  }
}
