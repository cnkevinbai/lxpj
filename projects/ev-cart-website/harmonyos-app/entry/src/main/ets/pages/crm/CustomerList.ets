/**
 * 客户列表页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { apiService } from '../../common/services/ApiService'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

// 客户数据
interface Customer {
  id: string
  name: string
  contactName: string
  contactPhone: string
  level: string
  industry: string
  region: string
  status: string
  createdAt: string
}

@Entry
@Component
struct CustomerList {
  @State customers: Customer[] = []
  @State loading: boolean = false
  @State searchText: string = ''
  @State filterLevel: string = ''

  aboutToAppear() {
    this.loadCustomers()
  }

  async loadCustomers() {
    this.loading = true
    try {
      // TODO: 调用实际 API
      // const data = await apiService.get<Customer[]>('/crm/customers')
      
      // 模拟数据
      this.customers = [
        {
          id: '1',
          name: '某某科技有限公司',
          contactName: '张总',
          contactPhone: '138****1234',
          level: 'A',
          industry: '科技',
          region: '四川',
          status: 'active',
          createdAt: '2026-03-01'
        },
        {
          id: '2',
          name: '某某制造厂',
          contactName: '李经理',
          contactPhone: '139****5678',
          level: 'B',
          industry: '制造',
          region: '重庆',
          status: 'active',
          createdAt: '2026-03-05'
        }
      ]
    } catch (error) {
      console.error('Load customers error:', error)
    } finally {
      this.loading = false
    }
  }

  build() {
    Column() {
      // 导航栏
      this.buildNavBar()

      // 搜索栏
      this.buildSearchBar()

      // 客户列表
      if (this.loading) {
        this.buildLoading()
      } else if (this.customers.length === 0) {
        this.buildEmpty()
      } else {
        this.buildList()
      }
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
        .onClick(() => {
          router.back()
        })

      Text('客户管理')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()

      Image($r('app.media.icon_add'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.pushUrl({ url: '/pages/crm/CustomerCreate' })
        })
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 搜索栏
  buildSearchBar() {
    Row() {
      Image($r('app.media.icon_search'))
        .width(20)
        .height(20)
        .fillColor(Colors.TEXT_PLACEHOLDER)
        .margin({ right: 8 })

      TextInput({ text: this.searchText, placeholder: '搜索客户名称/联系人' })
        .fontSize(Styles.FONT_SIZE.md)
        .fontColor(Colors.TEXT_PRIMARY)
        .placeholderColor(Colors.TEXT_PLACEHOLDER)
        .backgroundColor(Colors.BG_DISABLED)
        .layoutWeight(1)
        .onChange((value: string) => {
          this.searchText = value
        })
    }
    .width('100%')
    .height(40)
    .padding({ left: 12, right: 12 })
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(20)
    .margin({ bottom: 8 })
  }

  // 加载状态
  buildLoading() {
    Column() {
      LoadingProgress()
        .width(32)
        .height(32)
        .color(Colors.PRIMARY)
    }
    .width('100%')
    .layoutWeight(1)
    .justifyContent(FlexAlign.Center)
  }

  // 空状态
  buildEmpty() {
    Empty({
      description: '暂无客户',
      actionText: '新建客户'
    })
    .onAction(() => {
      router.pushUrl({ url: '/pages/crm/CustomerCreate' })
    })
  }

  // 客户列表
  buildList() {
    List() {
      ForEach(this.customers, (customer: Customer) => {
        ListItem() {
          this.buildCustomerItem(customer)
        }
        .padding({ left: 16, right: 16, top: 12 })
      })
    }
    .layoutWeight(1)
    .backgroundColor(Colors.BG_PAGE)
  }

  // 客户项
  buildCustomerItem(customer: Customer) {
    Column() {
      Row() {
        Column() {
          Text(customer.name)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor(Colors.TEXT_PRIMARY)

          Text(`${customer.contactName}  ${customer.contactPhone}`)
            .fontSize(14)
            .fontColor(Colors.TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Column() {
          Text(`L${customer.level}`)
            .fontSize(12)
            .fontColor(customer.level === 'A' ? Colors.SUCCESS : Colors.WARNING)
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .backgroundColor(customer.level === 'A' ? Colors.SUCCESS_LIGHT : Colors.WARNING_LIGHT)
            .borderRadius(4)

          Text(customer.region)
            .fontSize(12)
            .fontColor(Colors.TEXT_PLACEHOLDER)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(8)
    .onClick(() => {
      router.pushUrl({ url: `/pages/crm/CustomerDetail?id=${customer.id}` })
    })
  }
}
