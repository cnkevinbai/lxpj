/**
 * 报价详情页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Quotation {
  id: string;
  quotationNo: string;
  customerName: string;
  customerId: string;
  status: string;
  totalAmount: number;
  validUntil: string;
  createdAt: string;
  salespersonName: string;
  products: Array<{
    productName: string;
    productModel: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  remark?: string;
}

@Entry
@Component
struct QuotationDetail {
  @State quotation: Quotation | null = null;
  @State isLoading: boolean = true;
  
  private apiService: ApiService = new ApiService();
  private quotationId: string = '';

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, string>;
    this.quotationId = params['id'] || '';
    this.loadQuotation();
  }

  async loadQuotation(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/quotations/${this.quotationId}`);
      this.quotation = data;
    } catch (error) {
      console.error('加载报价详情失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else if (this.quotation) {
        // 报价状态卡片
        this.QuotationStatusCard()
        
        // 客户信息
        this.CustomerInfo()
        
        // 产品列表
        this.ProductList()
        
        // 备注信息
        if (this.quotation.remark) {
          this.RemarkSection()
        }
      }
      
      // 底部操作栏
      this.BottomBar()
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Image($r('sys.media.ohos_ic_public_arrow_left'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.back();
        })
      
      Text('报价详情')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
      
      Blank()
      
      // 编辑按钮
      if (this.quotation?.status === 'draft') {
        Image($r('sys.media.ohos_ic_public_edit'))
          .width(24)
          .height(24)
          .onClick(() => {
            router.pushUrl({ url: `pages/EditQuotation?id=${this.quotationId}` });
          })
      }
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 报价状态卡片
  @Builder QuotationStatusCard() {
    Column() {
      Row() {
        Text(this.quotation?.quotationNo || '')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Text(this.getStatusBadge(this.quotation?.status || ''))
          .fontSize(14)
          .fontColor('#FFFFFF')
          .padding({ left: 8, right: 8, top: 4, bottom: 4 })
          .backgroundColor(this.getStatusColor(this.quotation?.status || ''))
          .borderRadius(4)
          .margin({ left: 10 })
      }
      
      Row() {
        Column() {
          Text('总金额')
            .fontSize(12)
            .fontColor('#757575')
          
          Text(`¥${((this.quotation?.totalAmount || 0) / 10000).toFixed(1)}万`)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
            .margin({ top: 5 })
        }
        
        Column() {
          Text('有效期至')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ left: 30 })
          
          Text(this.formatDate(this.quotation?.validUntil || ''))
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor('#212121')
            .margin({ left: 30, top: 5 })
        }
      }
      .width('100%')
      .margin({ top: 15 })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .margin({ bottom: 10 })
  }

  // 客户信息
  @Builder CustomerInfo() {
    Column() {
      Row() {
        Text('客户信息')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      this.InfoRow('客户名称', this.quotation?.customerName || '')
      this.InfoRow('销售人员', this.quotation?.salespersonName || '')
      this.InfoRow('创建时间', this.formatDate(this.quotation?.createdAt || ''))
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 信息行
  @Builder InfoRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor('#757575')
        .width(100)
      
      Text(value)
        .fontSize(14)
        .fontColor('#212121')
        .layoutWeight(1)
    }
    .width('100%')
    .padding({ left: 20, right: 20, top: 15, bottom: 15 })
  }

  // 产品列表
  @Builder ProductList() {
    Column() {
      Row() {
        Text('产品明细')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      ForEach(this.quotation?.products || [], (product) => {
        Row() {
          Column() {
            Text(product.productName)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(product.productModel)
              .fontSize(12)
              .fontColor('#757575')
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          
          Column() {
            Text(`¥${(product.unitPrice / 10000).toFixed(2)}万`)
              .fontSize(13)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF9800')
            
            Text(`×${product.quantity}`)
              .fontSize(12)
              .fontColor('#757575')
              .margin({ top: 4 })
          }
        }
        .width('100%')
        .padding({ left: 20, right: 20, top: 15, bottom: 15 })
      })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 备注信息
  @Builder RemarkSection() {
    Column() {
      Row() {
        Text('备注')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      Text(this.quotation?.remark || '')
        .fontSize(14)
        .fontColor('#757575')
        .padding({ left: 20, right: 20, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 底部操作栏
  @Builder BottomBar() {
    Row() {
      if (this.quotation?.status === 'draft') {
        Button('发送报价')
          .width('48%')
          .height(45)
          .backgroundColor('#4CAF50')
          .onClick(() => {
            // TODO: 发送报价
          })
        
        Button('转为订单')
          .width('48%')
          .height(45)
          .backgroundColor('#1976D2')
          .margin({ left: '4%' })
          .onClick(() => {
            router.pushUrl({ url: `pages/CreateOrder?quotationId=${this.quotationId}` });
          })
      } else if (this.quotation?.status === 'sent') {
        Button('跟踪状态')
          .width('100%')
          .height(45)
          .backgroundColor('#1976D2')
      } else {
        Button('查看详情')
          .width('100%')
          .height(45)
          .backgroundColor('#1976D2')
      }
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      'draft': '草稿',
      'sent': '已发送',
      'confirmed': '已确认',
      'expired': '已失效',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'draft': '#9E9E9E',
      'sent': '#2196F3',
      'confirmed': '#4CAF50',
      'expired': '#FF9800',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
