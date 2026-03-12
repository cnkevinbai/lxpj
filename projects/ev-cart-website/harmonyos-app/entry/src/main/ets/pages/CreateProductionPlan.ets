/**
 * 创建生产计划页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct CreateProductionPlan {
  @State planName: string = '';
  @State orders: Array<{
    orderId: string;
    orderNo: string;
    productName: string;
    quantity: number;
  }> = [];
  @State startDate: string = '';
  @State endDate: string = '';
  @State workshopId: string = '';
  @State workshopName: string = '';
  @State priority: string = 'normal';
  @State remark: string = '';
  @State isSubmitting: boolean = false;
  
  private apiService: ApiService = new ApiService();

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 表单内容
      Scroll() {
        Column() {
          // 计划信息
          this.PlanInfoSection()
          
          // 关联订单
          this.OrdersSection()
          
          // 车间选择
          this.WorkshopSection()
          
          // 备注
          this.RemarkSection()
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)
      
      // 底部提交按钮
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
      
      Text('创建生产计划')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 计划信息
  @Builder PlanInfoSection() {
    Column() {
      Text('计划信息')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      // 计划名称
      Column() {
        Row() {
          Text('计划名称 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入计划名称', text: this.planName })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.planName = value;
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 优先级
      Column() {
        Row() {
          Text('优先级 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        Row() {
          this.PriorityOption('low', '低')
          this.PriorityOption('normal', '普通')
          this.PriorityOption('high', '高')
          this.PriorityOption('urgent', '紧急')
        }
        .width('100%')
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 日期范围
      Row() {
        Column() {
          Row() {
            Text('开始日期 *')
              .fontSize(14)
              .fontColor('#757575')
          }
          .width('100%')
          
          TextInput({ placeholder: '选择开始日期', text: this.startDate })
            .width('100%')
            .height(45)
            .backgroundColor('#F5F5F5')
            .borderRadius(8)
            .padding({ left: 15, right: 15 })
            .onChange((value: string) => {
              this.startDate = value;
            })
        }
        .layoutWeight(1)
        .margin({ right: 10 })
        
        Column() {
          Row() {
            Text('结束日期 *')
              .fontSize(14)
              .fontColor('#757575')
          }
          .width('100%')
          
          TextInput({ placeholder: '选择结束日期', text: this.endDate })
            .width('100%')
            .height(45)
            .backgroundColor('#F5F5F5')
            .borderRadius(8)
            .padding({ left: 15, right: 15 })
            .onChange((value: string) => {
              this.endDate = value;
            })
        }
        .layoutWeight(1)
      }
      .width('100%')
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 优先级选项
  @Builder PriorityOption(value: string, label: string) {
    Column() {
      Text(label)
        .fontSize(14)
        .fontWeight(this.priority === value ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.priority === value ? '#FFFFFF' : '#757575')
        .padding({ left: 15, right: 15, top: 8, bottom: 8 })
        .backgroundColor(this.priority === value ? '#1976D2' : '#F5F5F5')
        .borderRadius(8)
        .onClick(() => {
          this.priority = value;
        })
    }
    .margin({ right: 10 })
  }

  // 关联订单
  @Builder OrdersSection() {
    Column() {
      Row() {
        Text('关联订单')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text('添加订单')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            // TODO: 打开订单选择器
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 订单列表
      if (this.orders.length === 0) {
        Text('暂无订单，请点击右上角添加')
          .fontSize(14)
          .fontColor('#757575')
          .width('100%')
          .textAlign(TextAlign.Center)
          .padding({ top: 30, bottom: 30 })
      } else {
        ForEach(this.orders, (order, index) => {
          Row() {
            Column() {
              Text(order.orderNo)
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#212121')
              
              Text(order.productName)
                .fontSize(12)
                .fontColor('#757575')
                .margin({ top: 4 })
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            
            Text(`×${order.quantity}`)
              .fontSize(13)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF9800')
            
            Image($r('sys.media.ohos_ic_public_delete'))
              .width(20)
              .height(20)
              .fillColor('#F44336')
              .margin({ left: 15 })
              .onClick(() => {
                this.orders.splice(index, 1);
              })
          }
          .width('100%')
          .padding({ top: 15, bottom: 15 })
        })
      }
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 车间选择
  @Builder WorkshopSection() {
    Column() {
      Text('车间选择')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        Column() {
          Text('选择车间 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .layoutWeight(1)
        
        Text(this.workshopName || '请选择车间')
          .fontSize(14)
          .fontColor(this.workshopName ? '#212121' : '#9E9E9E')
      }
      .width('100%')
      .height(45)
      .backgroundColor('#F5F5F5')
      .borderRadius(8)
      .padding({ left: 15, right: 15 })
      .onClick(() => {
        // TODO: 打开车间选择器
      })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 备注
  @Builder RemarkSection() {
    Column() {
      Text('备注')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      TextArea({ placeholder: '请输入备注信息', text: this.remark })
        .width('100%')
        .height(100)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .padding(15)
        .onChange((value: string) => {
          this.remark = value;
        })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 底部提交按钮
  @Builder BottomBar() {
    Button('创建计划')
      .width('100%')
      .height(50)
      .backgroundColor(this.canSubmit() ? '#4CAF50' : '#BDBDBD')
      .fontSize(16)
      .fontWeight(FontWeight.Medium)
      .enabled(this.canSubmit() && !this.isSubmitting)
      .onClick(() => {
        this.submit();
      })
  }

  // 是否可以提交
  canSubmit(): boolean {
    return this.planName.trim().length > 0 &&
           this.orders.length > 0 &&
           this.startDate.trim().length > 0 &&
           this.endDate.trim().length > 0 &&
           this.workshopId.length > 0;
  }

  // 提交
  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      // TODO: 显示错误提示
      return;
    }

    this.isSubmitting = true;

    try {
      const planData = {
        planName: this.planName,
        orders: this.orders,
        startDate: this.startDate,
        endDate: this.endDate,
        workshopId: this.workshopId,
        workshopName: this.workshopName,
        priority: this.priority,
        remark: this.remark,
      };

      await this.apiService.post('/mobile/production-plans', planData);

      // TODO: 显示成功提示
      router.back();
    } catch (error) {
      console.error('创建生产计划失败', error);
      // TODO: 显示错误提示
    } finally {
      this.isSubmitting = false;
    }
  }
}
