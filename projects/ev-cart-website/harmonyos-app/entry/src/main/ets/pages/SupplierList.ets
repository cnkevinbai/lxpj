/**
 * 供应商列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Supplier {
  id: string;
  supplierCode: string;
  supplierName: string;
  contactPerson: string;
  contactPhone: string;
  level: string;
  status: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalAmount: number;
}

@Entry
@Component
struct SupplierList {
  @State suppliers: Supplier[] = [];
  @State isLoading: boolean = true;
  @State selectedLevel: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadSuppliers();
  }

  async loadSuppliers(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/suppliers', {
        page: 1,
        limit: 20,
        level: this.selectedLevel === 'all' ? '' : this.selectedLevel,
      });
      this.suppliers = data.items;
    } catch (error) {
      console.error('加载供应商列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 等级筛选
      this.LevelFilter()
      
      // 供应商列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.suppliers, (supplier) => {
            this.SupplierItem(supplier)
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
      Text('供应商管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.suppliers.length}个`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 等级筛选
  @Builder LevelFilter() {
    Scroll() {
      Row() {
        this.LevelItem('全部', 'all')
        this.LevelItem('A 级', 'A')
        this.LevelItem('B 级', 'B')
        this.LevelItem('C 级', 'C')
      }
      .width('100%')
      .padding({ left: 15, right: 15 })
    }
    .width('100%')
    .height(60)
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 等级项
  @Builder LevelItem(label: string, value: string) {
    Text(label)
      .fontSize(14)
      .fontWeight(this.selectedLevel === value ? FontWeight.Bold : FontWeight.Normal)
      .fontColor(this.selectedLevel === value ? '#FFFFFF' : '#757575')
      .padding({ left: 15, right: 15, top: 8, bottom: 8 })
      .backgroundColor(this.selectedLevel === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedLevel = value;
        this.loadSuppliers();
      })
  }

  // 供应商项
  @Builder SupplierItem(supplier: Supplier) {
    Column() {
      Row() {
        Column() {
          Text('🏭')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(supplier.supplierName)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getLevelBadge(supplier.level))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getLevelColor(supplier.level))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${supplier.category} · ${supplier.contactPerson} ${supplier.contactPhone}`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Row() {
            Text('评分：')
              .fontSize(12)
              .fontColor('#9E9E9E')
            
            ForEach(Array.from({ length: 5 }), (_, index) => {
              Text(index < Math.floor(supplier.rating) ? '⭐' : '☆')
                .fontSize(12)
            })
          }
          .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`${supplier.totalOrders}单`)
            .fontSize(13)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('¥' + (supplier.totalAmount / 10000).toFixed(0) + '万')
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
        Text(this.getStatusText(supplier.status))
          .fontSize(12)
          .fontColor(this.getStatusColor(supplier.status))
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/SupplierDetail?id=${supplier.id}` });
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
      Button('新增供应商')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateSupplier' });
        })
      
      Button('供应商评估')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/SupplierEvaluation' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getLevelBadge(level: string): string {
    const badges: Record<string, string> = {
      'A': 'A 级',
      'B': 'B 级',
      'C': 'C 级',
    };
    return badges[level] || level;
  }

  getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      'A': '#4CAF50',
      'B': '#FF9800',
      'C': '#F44336',
    };
    return colors[level] || '#9E9E9E';
  }

  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      'active': '合作中',
      'inactive': '未激活',
      'blacklisted': '黑名单',
    };
    return texts[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'active': '#4CAF50',
      'inactive': '#9E9E9E',
      'blacklisted': '#F44336',
    };
    return colors[status] || '#9E9E9E';
  }
}
