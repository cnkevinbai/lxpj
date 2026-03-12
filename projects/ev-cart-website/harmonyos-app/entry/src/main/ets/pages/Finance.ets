// 财务报表页面
import { apiService } from '../common/services/ApiService'
import { COLORS, SPACING } from '../common/utils/Constants'
import { FinanceStats } from '../common/models/Customer'

@Entry
@Component
struct Finance {
  @State stats: FinanceStats = {
    totalRevenue: 0,
    totalExpense: 0,
    totalProfit: 0,
    avgMargin: 0,
  }
  @State loading: boolean = false
  @State period: string = 'month'

  aboutToAppear() {
    this.loadStats()
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('财务报表')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      // 周期筛选
      Row() {
        ForEach(['week', 'month', 'quarter', 'year'], (p: string) => {
          Text(p === 'week' ? '本周' : p === 'month' ? '本月' : p === 'quarter' ? '本季' : '本年')
            .fontSize(14)
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .backgroundColor(p === this.period ? '#1890ff' : '#f5f5f5')
            .fontColor(p === this.period ? '#fff' : COLORS.TEXT_PRIMARY)
            .borderRadius(16)
            .margin({ right: 8 })
            .onClick(() => {
              this.period = p
              this.loadStats()
            })
        })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 8 })
      .backgroundColor('#fff')

      if (this.loading) {
        Column() {
          LoadingProgress()
            .width(40)
            .height(40)
          Text('加载中...')
            .fontSize(14)
            .fontColor(COLORS.TEXT_SECONDARY)
            .margin({ top: 16 })
        }
        .width('100%')
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            // 统计卡片
            Row() {
              // 收入
              Column() {
                Text('收入')
                  .fontSize(14)
                  .fontColor(COLORS.TEXT_SECONDARY)
                Text('¥' + (this.stats.totalRevenue / 10000).toFixed(1) + '万')
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(COLORS.SUCCESS)
              }
              .width('25%')
              .alignItems(HorizontalAlign.Center)

              // 支出
              Column() {
                Text('支出')
                  .fontSize(14)
                  .fontColor(COLORS.TEXT_SECONDARY)
                Text('¥' + (this.stats.totalExpense / 10000).toFixed(1) + '万')
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(COLORS.ERROR)
              }
              .width('25%')
              .alignItems(HorizontalAlign.Center)

              // 利润
              Column() {
                Text('利润')
                  .fontSize(14)
                  .fontColor(COLORS.TEXT_SECONDARY)
                Text('¥' + (this.stats.totalProfit / 10000).toFixed(1) + '万')
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(COLORS.PRIMARY)
              }
              .width('25%')
              .alignItems(HorizontalAlign.Center)

              // 毛利率
              Column() {
                Text('毛利率')
                  .fontSize(14)
                  .fontColor(COLORS.TEXT_SECONDARY)
                Text(this.stats.avgMargin.toFixed(1) + '%')
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(COLORS.WARNING)
              }
              .width('25%')
              .alignItems(HorizontalAlign.Center)
            }
            .width('100%')
            .padding(16)
            .backgroundColor('#fff')

            // 收入趋势
            Text('收入趋势')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(COLORS.TEXT_PRIMARY)
              .width('100%')
              .padding({ left: 16, top: 16, bottom: 8 })

            Column() {
              Text('收入趋势图表区域')
                .fontSize(14)
                .fontColor(COLORS.TEXT_DISABLED)
                .padding(40)
            }
            .width('100%')
            .backgroundColor('#fff')
            .margin({ left: 16, right: 16 })
            .borderRadius(8)

            // 支出分析
            Text('支出分析')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(COLORS.TEXT_PRIMARY)
              .width('100%')
              .padding({ left: 16, top: 16, bottom: 8 })

            Column() {
              Text('支出分析图表区域')
                .fontSize(14)
                .fontColor(COLORS.TEXT_DISABLED)
                .padding(40)
            }
            .width('100%')
            .backgroundColor('#fff')
            .margin({ left: 16, right: 16, top: 12 })
            .borderRadius(8)
          }
        }
        .width('100%')
        .flexGrow(1)
        .backgroundColor(COLORS.BACKGROUND)
      }
    }
    .width('100%')
    .height('100%')
  }

  async loadStats() {
    this.loading = true
    try {
      const result = await apiService.get<FinanceStats>(`/finance/stats?period=${this.period}`)
      this.stats = result
    } catch (error) {
      console.error('Load stats failed:', error)
    } finally {
      this.loading = false
    }
  }
}
