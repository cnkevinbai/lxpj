/**
 * 统计报表页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

@Entry
@Component
struct StatisticDashboard {
  @State overview: OverviewStats = {
    totalTickets: 156,
    completedTickets: 120,
    completionRate: 76.9,
    avgSatisfaction: 4.6
  }

  build() {
    Column() {
      // 导航栏
      this.buildNavBar()

      // 内容
      Scroll() {
        Column() {
          // 总体统计卡片
          this.buildOverviewCards()

          // 工单趋势
          this.buildTicketTrend()

          // 类型分布
          this.buildTypeDistribution()

          // 人员绩效
          this.buildTechnicianPerformance()
        }
        .width('100%')
        .padding(16)
      }
      .scrollable(ScrollDirection.Vertical)
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.BG_PAGE)
  }

  // 导航栏
  buildNavBar() {
    Row() {
      Image($r('app.media.icon_back'))
        .width(24)
        .height(24)

      Text('统计报表')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()

      Image($r('app.media.icon_export'))
        .width(24)
        .height(24)
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 总体统计卡片
  buildOverviewCards() {
    Column() {
      Text('总体统计')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Row() {
        // 总工单
        this.buildStatCard('总工单', this.overview.totalTickets.toString(), Colors.PRIMARY)

        // 已完成
        this.buildStatCard('已完成', this.overview.completedTickets.toString(), Colors.SUCCESS)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)

      Row() {
        // 完成率
        this.buildStatCard('完成率', `${this.overview.completionRate}%`, Colors.WARNING)

        // 满意度
        this.buildStatCard('满意度', `${this.overview.avgSatisfaction}分`, Colors.INFO)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .margin({ top: 12 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 统计卡片
  buildStatCard(label: string, value: string, color: string) {
    Column() {
      Text(value)
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
        .margin({ bottom: 4 })

      Text(label)
        .fontSize(12)
        .fontColor(Colors.TEXT_SECONDARY)
    }
    .width('45%')
    .padding(12)
    .backgroundColor(Colors.BG_DISABLED)
    .borderRadius(8)
  }

  // 工单趋势
  buildTicketTrend() {
    Column() {
      Text('工单趋势')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      // 简易趋势图
      Column() {
        ForEach([5, 8, 6, 9, 7, 10, 8], (value: number, index: number) => {
          Row() {
            Rectangle()
              .width(32)
              .height(value * 8)
              .fill(Colors.PRIMARY)
              .borderRadius(4)

            Text(['一', '二', '三', '四', '五', '六', '日'][index])
              .fontSize(10)
              .fontColor(Colors.TEXT_PLACEHOLDER)
              .margin({ top: 4 })
          }
          .width('12%')
          .justifyContent(FlexAlign.End)
        })
      }
      .width('100%')
      .height(120)
      .justifyContent(FlexAlign.End)
      .padding({ top: 20 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 类型分布
  buildTypeDistribution() {
    Column() {
      Text('类型分布')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      // 类型列表
      Column() {
        this.buildTypeItem('维修', 80, Colors.PRIMARY)
        this.buildTypeItem('安装', 45, Colors.SUCCESS)
        this.buildTypeItem('保养', 31, Colors.WARNING)
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 类型项
  buildTypeItem(label: string, count: number, color: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor(Colors.TEXT_PRIMARY)
        .width(60)

      Rectangle()
        .layoutWeight(1)
        .height(8)
        .fill(color)
        .borderRadius(4)

      Text(`${count}单`)
        .fontSize(12)
        .fontColor(Colors.TEXT_SECONDARY)
        .width(50)
        .textAlign(TextAlign.End)
    }
    .width('100%')
    .margin({ bottom: 12 })
  }

  // 人员绩效
  buildTechnicianPerformance() {
    Column() {
      Text('人员绩效')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      // 人员列表
      Column() {
        this.buildTechnicianItem('李师傅', 50, 4.8, '优秀')
        this.buildTechnicianItem('王师傅', 42, 4.6, '良好')
        this.buildTechnicianItem('张师傅', 38, 4.9, '优秀')
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
  }

  // 人员项
  buildTechnicianItem(name: string, count: number, score: number, rating: string) {
    Row() {
      Text(name)
        .fontSize(14)
        .fontColor(Colors.TEXT_PRIMARY)
        .width(80)

      Text(`${count}单`)
        .fontSize(12)
        .fontColor(Colors.TEXT_SECONDARY)
        .width(60)

      Row() {
        Text('⭐')
          .fontSize(12)
        Text(score.toString())
          .fontSize(12)
          .fontColor(Colors.WARNING)
      }
      .width(60)

      Blank()

      Text(rating)
        .fontSize(12)
        .fontColor(rating === '优秀' ? Colors.SUCCESS : Colors.WARNING)
        .padding({ left: 8, right: 8, top: 4, bottom: 4 })
        .backgroundColor(rating === '优秀' ? Colors.SUCCESS_LIGHT : Colors.WARNING_LIGHT)
        .borderRadius(4)
    }
    .width('100%')
    .padding({ top: 8, bottom: 8 })
  }
}

// 数据类型
interface OverviewStats {
  totalTickets: number
  completedTickets: number
  completionRate: number
  avgSatisfaction: number
}
