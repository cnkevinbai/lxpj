/**
 * 工序管理列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Process {
  id: string;
  processNo: string;
  processName: string;
  productName: string;
  sequence: number;
  workshopName: string;
  lineName: string;
  status: string;
}

@Entry
@Component
struct ProcessList {
  @State processes: Process[] = [];
  @State isLoading: boolean = true;
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadProcesses();
  }

  async loadProcesses(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/processes', {
        page: 1,
        limit: 20,
      });
      this.processes = data.items;
    } catch (error) {
      console.error('加载工序列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 工序列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.processes, (process) => {
            this.ProcessItem(process)
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
      Text('工序管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      Text(`共${this.processes.length}个`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 工序项
  @Builder ProcessItem(process: Process) {
    Column() {
      Row() {
        Column() {
          Text('⚙️')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#FFF3E0')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(process.processName)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(`工序${process.sequence}`)
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor('#1976D2')
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(process.productName)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Text(`${process.workshopName} ${process.lineName}`)
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(this.getStatusBadge(process.status))
            .fontSize(12)
            .fontColor('#FFFFFF')
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .backgroundColor(this.getStatusColor(process.status))
            .borderRadius(4)
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ProcessDetail?id=${process.id}` });
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
      Button('添加工序')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateProcess' });
        })
      
      Button('工序统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/ProcessStatistics' });
        })
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
      'active': '启用',
      'inactive': '停用',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'active': '#4CAF50',
      'inactive': '#9E9E9E',
    };
    return colors[status] || '#9E9E9E';
  }
}
