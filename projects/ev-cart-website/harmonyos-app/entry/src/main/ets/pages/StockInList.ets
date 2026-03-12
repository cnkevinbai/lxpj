/**
 * 入库列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface StockIn {
  id: string;
  stockInNo: string;
  type: string;
  sourceNo: string;
  workshopName?: string;
  totalQuantity: number;
  status: string;
  createdAt: string;
  operatorName: string;
}

@Entry
@Component
struct StockInList {
  @State stockIns: StockIn[] = [];
  @State isLoading: boolean = true;
  @State selectedType: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadStockIns();
  }

  async loadStockIns(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/stock-in', {
        page: 1,
        limit: 20,
        type: this.selectedType === 'all' ? '' : this.selectedType,
      });
      this.stockIns = data.items;
    } catch (error) {
      console.error('加载入库列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 类型筛选
      this.TypeFilter()
      
      // 入库列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.stockIns, (stockIn) => {
            this.StockInItem(stockIn)
          })
        }
        .width('100%')
        .layoutWeight(1)
      }
      
      // 底部按钮
      this.BottomBar()
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('入库管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.stockIns.length}个`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 类型筛选
  @Builder TypeFilter() {
    Scroll() {
      Row() {
        this.TypeItem('全部', 'all')
        this.TypeItem('生产入库', 'production')
        this.TypeItem('采购入库', 'purchase')
        this.TypeItem('退货入库', 'return')
      }
      .width('100%')
      .padding({ left: 15, right: 15 })
    }
    .width('100%')
    .height(60)
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 类型项
  @Builder TypeItem(label: string, value: string) {
    Text(label)
      .fontSize(14)
      .fontWeight(this.selectedType === value ? FontWeight.Bold : FontWeight.Normal)
      .fontColor(this.selectedType === value ? '#FFFFFF' : '#757575')
      .padding({ left: 15, right: 15, top: 8, bottom: 8 })
      .backgroundColor(this.selectedType === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedType = value;
        this.loadStockIns();
      })
  }

  // 入库项
  @Builder StockInItem(stockIn: StockIn) {
    Column() {
      Row() {
        Column() {
          Text('📥')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(stockIn.stockInNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getTypeBadge(stockIn.type))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getTypeColor(stockIn.type))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`来源：${stockIn.sourceNo}`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          if (stockIn.workshopName) {
            Text(stockIn.workshopName)
              .fontSize(12)
              .fontColor('#9E9E9E')
              .margin({ top: 3 })
          }
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`${stockIn.totalQuantity}`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('件')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(`入库：${this.formatDate(stockIn.createdAt)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Text(` · ${stockIn.operatorName}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/StockInDetail?id=${stockIn.id}` });
          })
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 底部按钮
  @Builder BottomBar() {
    Row() {
      Button('登记入库')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateStockIn' });
        })
      
      Button('入库统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/StockInStatistics' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getTypeBadge(type: string): string {
    const badges: Record<string, string> = {
      'production': '生产入库',
      'purchase': '采购入库',
      'return': '退货入库',
    };
    return badges[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'production': '#4CAF50',
      'purchase': '#2196F3',
      'return': '#FF9800',
    };
    return colors[type] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
