/**
 * 质量检验页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface QualityInspection {
  id: string;
  inspectionNo: string;
  inspectionType: string;
  productName: string;
  quantity: number;
  qualifiedQuantity: number;
  defectiveQuantity: number;
  qualifiedRate: number;
  status: string;
  inspectionDate: string;
  inspectorName?: string;
}

@Entry
@Component
struct QualityInspections {
  @State qualityInspec tions: QualityInspection[] = [];
  @State isLoading: boolean = true;
  @State selectedType: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadQualityInspections();
  }

  async loadQualityInspections(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/quality/inspections', {
        page: 1,
        limit: 20,
        type: this.selectedType === 'all' ? '' : this.selectedType,
      });
      this.qualityInspections = data.items;
    } catch (error) {
      console.error('加载质检单失败', error);
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
      
      // 质检单列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.qualityInspections, (inspection: QualityInspection) => {
            this.QualityInspectionItem(inspection)
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
      Text('质量检验')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.qualityInspections.length}单`)
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
        this.TypeItem('来料检验', 'incoming')
        this.TypeItem('过程检验', 'process')
        this.TypeItem('成品检验', 'final')
        this.TypeItem('出厂检验', 'outgoing')
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
        this.loadQualityInspections();
      })
  }

  // 质检单项
  @Builder QualityInspectionItem(inspection: QualityInspection) {
    Column() {
      Row() {
        Column() {
          Text(this.getTypeIcon(inspection.inspectionType))
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E8F5E9')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(inspection.inspectionNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(inspection.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(inspection.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${inspection.productName} · ${this.getTypeName(inspection.inspectionType)}`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          // 合格率
          Row() {
            Text('合格率')
              .fontSize(12)
              .fontColor('#757575')
            
            Text(`${inspection.qualifiedRate.toFixed(1)}%`)
              .fontSize(12)
              .fontWeight(FontWeight.Bold)
              .fontColor(inspection.qualifiedRate >= 95 ? '#4CAF50' : '#FF9800')
              .margin({ left: 5 })
          }
          .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`${inspection.qualifiedQuantity}/${inspection.quantity}`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('合格/总数')
            .fontSize(11)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(`检验：${this.formatDate(inspection.inspectionDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        if (inspection.inspectorName) {
          Text(` · ${inspection.inspectorName}`)
            .fontSize(12)
            .fontColor('#757575')
        }
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/QualityInspectionDetail?id=${inspection.id}` });
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
      Button('创建检验单')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateQualityInspection' });
        })
      
      Button('质量统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/QualityStatistics' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'incoming': '📥',
      'process': '🏭',
      'final': '✅',
      'outgoing': '📤',
    };
    return icons[type] || '📝';
  }

  getTypeName(type: string): string {
    const names: Record<string, string> = {
      'incoming': '来料检验',
      'process': '过程检验',
      'final': '成品检验',
      'outgoing': '出厂检验',
    };
    return names[type] || type;
  }

  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      'pending': '待检验',
      'inspecting': '检验中',
      'completed': '已完成',
      'rejected': '已驳回',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'inspecting': '#2196F3',
      'completed': '#4CAF50',
      'rejected': '#F44336',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
