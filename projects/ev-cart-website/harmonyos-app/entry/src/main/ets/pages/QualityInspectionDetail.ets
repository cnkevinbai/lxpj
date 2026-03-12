/**
 * 质量检验详情页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface QualityInspection {
  id: string;
  inspectionNo: string;
  inspectionType: string;
  productName: string;
  productModel: string;
  quantity: number;
  qualifiedQuantity: number;
  defectiveQuantity: number;
  qualifiedRate: number;
  status: string;
  inspectionDate: string;
  inspectorName?: string;
  inspectionItems?: Array<{
    itemName: string;
    itemType: string;
    standardValue: string;
    actualValue: string;
    result: string;
  }>;
  defectTypes?: string[];
  remark?: string;
}

@Entry
@Component
struct QualityInspectionDetail {
  @State inspection: QualityInspection | null = null;
  @State isLoading: boolean = true;
  @State activeTab: number = 0; // 0: 检验信息，1: 检验项目，2: 不良记录
  
  private apiService: ApiService = new ApiService();
  private inspectionId: string = '';

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, string>;
    this.inspectionId = params['id'] || '';
    this.loadInspection();
  }

  async loadInspection(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/quality/inspections/${this.inspectionId}`);
      this.inspection = data;
    } catch (error) {
      console.error('加载质检单详情失败', error);
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
      } else if (this.inspection) {
        // 检验结果卡片
        this.InspectionResultCard()
        
        // 标签页
        this.Tabs()
        
        // 标签内容
        this.TabContent()
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
      
      Text('质量检验详情')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
      
      Blank()
      
      // 编辑按钮
      if (this.inspection?.status === 'pending' || this.inspection?.status === 'inspecting') {
        Image($r('sys.media.ohos_ic_public_edit'))
          .width(24)
          .height(24)
          .onClick(() => {
            router.pushUrl({ url: `pages/EditQualityInspection?id=${this.inspectionId}` });
          })
      }
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 检验结果卡片
  @Builder InspectionResultCard() {
    Column() {
      Row() {
        Text(this.inspection?.inspectionNo || '')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#212121')
        
        Text(this.getStatusBadge(this.inspection?.status || ''))
          .fontSize(12)
          .fontColor('#FFFFFF')
          .padding({ left: 6, right: 6, top: 2, bottom: 2 })
          .backgroundColor(this.getStatusColor(this.inspection?.status || ''))
          .borderRadius(4)
          .margin({ left: 10 })
      }
      
      // 合格率
      Row() {
        Column() {
          Text('合格率')
            .fontSize(12)
            .fontColor('#757575')
          
          Text(`${this.inspection?.qualifiedRate.toFixed(1)}%`)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor(this.inspection?.qualifiedRate && this.inspection.qualifiedRate >= 95 ? '#4CAF50' : '#FF9800')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
        
        Column() {
          Text('合格')
            .fontSize(12)
            .fontColor('#757575')
          
          Text(`${this.inspection?.qualifiedQuantity || 0}`)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
        .margin({ left: 30 })
        
        Column() {
          Text('不良')
            .fontSize(12)
            .fontColor('#757575')
          
          Text(`${this.inspection?.defectiveQuantity || 0}`)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F44336')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
        .margin({ left: 30 })
        
        Column() {
          Text('总数')
            .fontSize(12)
            .fontColor('#757575')
          
          Text(`${this.inspection?.quantity || 0}`)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#1976D2')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
        .margin({ left: 30 })
      }
      .width('100%')
      .margin({ top: 15 })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .margin({ bottom: 10 })
  }

  // 标签页
  @Builder Tabs() {
    Row() {
      this.TabItem('检验信息', 0)
      this.TabItem('检验项目', 1)
      this.TabItem('不良记录', 2)
    }
    .width('100%')
    .height(50)
    .backgroundColor('#FFFFFF')
    .padding({ left: 15, right: 15 })
  }

  // 标签项
  @Builder TabItem(label: string, index: number) {
    Column() {
      Text(label)
        .fontSize(15)
        .fontWeight(this.activeTab === index ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.activeTab === index ? '#1976D2' : '#757575')
      
      if (this.activeTab === index) {
        Divider()
          .width(40)
          .height(3)
          .color('#1976D2')
          .margin({ top: 5 })
      }
    }
    .width('33%')
    .alignItems(HorizontalAlign.Center)
    .onClick(() => {
      this.activeTab = index;
    })
  }

  // 标签内容
  @Builder TabContent() {
    if (this.activeTab === 0) {
      this.InspectionInfoTab()
    } else if (this.activeTab === 1) {
      this.InspectionItemsTab()
    } else {
      this.DefectRecordsTab()
    }
  }

  // 检验信息
  @Builder InspectionInfoTab() {
    Column() {
      this.InfoRow('检验类型', this.getTypeName(this.inspection?.inspectionType || ''))
      this.InfoRow('产品', `${this.inspection?.productName} ${this.inspection?.productModel}`)
      this.InfoRow('检验数量', `${this.inspection?.quantity || 0}`)
      this.InfoRow('检验日期', this.formatDate(this.inspection?.inspectionDate || ''))
      this.InfoRow('检验员', this.inspection?.inspectorName || '')
      
      if (this.inspection?.defectTypes && this.inspection.defectTypes.length > 0) {
        this.InfoRow('不良类型', this.inspection.defectTypes.join(', '))
      }
      
      if (this.inspection?.remark) {
        this.InfoRow('备注', this.inspection.remark)
      }
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

  // 检验项目
  @Builder InspectionItemsTab() {
    Column() {
      ForEach(this.inspection?.inspectionItems || [], (item) => {
        Row() {
          Column() {
            Text(item.itemName)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(item.itemType)
              .fontSize(12)
              .fontColor('#757575')
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          
          Column() {
            Text(`标准：${item.standardValue}`)
              .fontSize(12)
              .fontColor('#757575')
            
            Text(`实测：${item.actualValue}`)
              .fontSize(12)
              .fontColor('#1976D2')
              .margin({ top: 4 })
          }
          
          Text(item.result === 'qualified' ? '✓' : '✗')
            .fontSize(20)
            .fontColor(item.result === 'qualified' ? '#4CAF50' : '#F44336')
            .margin({ left: 15 })
        }
        .width('100%')
        .padding({ left: 20, right: 20, top: 15, bottom: 15 })
      })
      
      if (!this.inspection?.inspectionItems || this.inspection.inspectionItems.length === 0) {
        Text('暂无检验项目')
          .fontSize(14)
          .fontColor('#757575')
          .margin({ top: 50 })
      }
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 不良记录
  @Builder DefectRecordsTab() {
    Column() {
      Text('暂无不良记录')
        .fontSize(14)
        .fontColor('#757575')
        .margin({ top: 50 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 底部操作栏
  @Builder BottomBar() {
    Row() {
      if (this.inspection?.status === 'pending' || this.inspection?.status === 'inspecting') {
        Button('录入结果')
          .width('100%')
          .height(45)
          .backgroundColor('#4CAF50')
          .onClick(() => {
            router.pushUrl({ url: `pages/EditQualityInspection?id=${this.inspectionId}` });
          })
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

  getTypeName(type: string): string {
    const names: Record<string, string> = {
      'incoming': '来料检验',
      'process': '过程检验',
      'final': '成品检验',
      'outgoing': '出厂检验',
    };
    return names[type] || type;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
