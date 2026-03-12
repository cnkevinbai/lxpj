// 库存查询页面
import { apiService } from '../common/services/ApiService'
import { COLORS, STOCK_STATUS } from '../common/utils/Constants'

@Entry
@Component
struct Inventory {
  @State inventoryList: any[] = []
  @State loading: boolean = false
  @State refreshing: boolean = false
  @State page: number = 1
  @State total: number = 0
  @State searchText: string = ''

  aboutToAppear() {
    this.loadInventory()
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('库存查询')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      // 搜索栏
      Row() {
        TextInput({ placeholder: '搜索产品', text: this.searchText })
          .onChange((value) => this.searchText = value)
          .width('100%')
          .height(40)
          .backgroundColor('#fff')
          .borderRadius(20)
          .padding({ left: 16, right: 16 })
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#fff')

      // 库存列表
      if (this.loading && this.inventoryList.length === 0) {
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
      } else if (this.inventoryList.length === 0) {
        Column() {
          Image($r('app.media.ic_empty'))
            .width(120)
            .height(120)
          Text('暂无库存数据')
            .fontSize(16)
            .fontColor(COLORS.TEXT_DISABLED)
            .margin({ top: 16 })
        }
        .width('100%')
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
      } else {
        List() {
          ForEach(this.inventoryList, (item: any) => {
            ListItem() {
              Column() {
                // 产品信息
                Row() {
                  Text(item.productName)
                    .fontSize(16)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(COLORS.TEXT_PRIMARY)

                  Text(item.productCode)
                    .fontSize(12)
                    .fontColor(COLORS.TEXT_DISABLED)
                    .margin({ left: 8 })
                }
                .width('100%')

                Row() {
                  Text(item.category)
                    .fontSize(14)
                    .fontColor(COLORS.TEXT_SECONDARY)
                }
                .width('100%')
                .margin({ top: 4 })

                // 库存信息
                Row() {
                  Column() {
                    Text('当前库存')
                      .fontSize(12)
                      .fontColor(COLORS.TEXT_DISABLED)
                    Text(item.quantity)
                      .fontSize(18)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(item.quantity <= item.safeStock ? COLORS.ERROR : COLORS.SUCCESS)
                  }
                  .alignItems(HorizontalAlign.Center)

                  Column() {
                    Text('安全库存')
                      .fontSize(12)
                      .fontColor(COLORS.TEXT_DISABLED)
                    Text(item.safeStock)
                      .fontSize(16)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(COLORS.TEXT_PRIMARY)
                  }
                  .alignItems(HorizontalAlign.Center)
                  .margin({ left: 24 })

                  Column() {
                    Text('仓库')
                      .fontSize(12)
                      .fontColor(COLORS.TEXT_DISABLED)
                    Text(item.warehouseName)
                      .fontSize(14)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(COLORS.TEXT_PRIMARY)
                  }
                  .alignItems(HorizontalAlign.Center)
                  .margin({ left: 24 })
                  .flexGrow(1)
                  .textAlign(TextAlign.End)

                  // 状态标签
                  Text(STOCK_STATUS[item.status]?.label || item.status)
                    .fontSize(12)
                    .padding({ left: 8, right: 8, top: 4, bottom: 4 })
                    .backgroundColor(STOCK_STATUS[item.status]?.color || '#d9d9d9')
                    .borderRadius(4)
                    .fontColor('#fff')
                }
                .width('100%')
                .margin({ top: 8 })
                .justifyContent(FlexAlign.SpaceBetween)
              }
              .width('100%')
              .padding(16)
              .backgroundColor('#fff')
              .borderRadius(8)
            }
            .margin({ bottom: 12 })
          })
        }
        .width('100%')
        .padding(16)
        .backgroundColor(COLORS.BACKGROUND)
        .flexGrow(1)
        .onReachBottom(() => this.loadMore())
        .refreshing({ refreshing: this.refreshing })
        .onRefresh(() => this.refresh())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(COLORS.BACKGROUND)
  }

  // 加载库存列表
  async loadInventory() {
    this.loading = true
    try {
      const result = await apiService.get<any>(`/inventory?page=${this.page}&limit=20`)
      this.inventoryList = result.data || []
      this.total = result.total || 0
    } catch (error) {
      console.error('Load inventory failed:', error)
    } finally {
      this.loading = false
      this.refreshing = false
    }
  }

  // 加载更多
  async loadMore() {
    if (this.inventoryList.length >= this.total) return
    this.page++
    try {
      const result = await apiService.get<any>(`/inventory?page=${this.page}&limit=20`)
      this.inventoryList = [...this.inventoryList, ...(result.data || [])]
    } catch (error) {
      console.error('Load more failed:', error)
    }
  }

  // 刷新
  async refresh() {
    this.refreshing = true
    this.page = 1
    await this.loadInventory()
  }
}
