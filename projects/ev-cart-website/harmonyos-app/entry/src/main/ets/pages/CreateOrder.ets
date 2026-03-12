/**
 * 新建订单页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct CreateOrder {
  @State customerId: string = '';
  @State customerName: string = '';
  @State products: Array<{
    productId: string;
    productName: string;
    productModel: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }> = [];
  @State deliveryDate: string = '';
  @State deliveryAddress: string = '';
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
          // 客户信息
          this.CustomerSection()
          
          // 产品信息
          this.ProductsSection()
          
          // 交货信息
          this.DeliverySection()
          
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
      
      Text('新建订单')
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

  // 客户信息
  @Builder CustomerSection() {
    Column() {
      Text('客户信息')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        Column() {
          Text('选择客户 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .layoutWeight(1)
        
        Text(this.customerName || '请选择客户')
          .fontSize(14)
          .fontColor(this.customerName ? '#212121' : '#9E9E9E')
      }
      .width('100%')
      .height(45)
      .backgroundColor('#F5F5F5')
      .borderRadius(8)
      .padding({ left: 15, right: 15 })
      .onClick(() => {
        // TODO: 打开客户选择器
      })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 产品信息
  @Builder ProductsSection() {
    Column() {
      Row() {
        Text('产品信息')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text('添加产品')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            // TODO: 打开产品选择器
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 产品列表
      if (this.products.length === 0) {
        Text('暂无产品，请点击右上角添加')
          .fontSize(14)
          .fontColor('#757575')
          .width('100%')
          .textAlign(TextAlign.Center)
          .padding({ top: 30, bottom: 30 })
      } else {
        ForEach(this.products, (product) => {
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
            
            Image($r('sys.media.ohos_ic_public_delete'))
              .width(20)
              .height(20)
              .fillColor('#F44336')
              .margin({ left: 15 })
              .onClick(() => {
                // TODO: 删除产品
              })
          }
          .width('100%')
          .padding({ top: 15, bottom: 15 })
        })
      }
      
      // 合计
      if (this.products.length > 0) {
        Row() {
          Text('合计')
            .fontSize(14)
            .fontColor('#757575')
          
          Blank()
          
          Text(`¥${(this.getTotalAmount() / 10000).toFixed(2)}万`)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#1976D2')
        }
        .width('100%')
        .padding({ top: 15 })
      }
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 交货信息
  @Builder DeliverySection() {
    Column() {
      Text('交货信息')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      // 交货日期
      Column() {
        Row() {
          Text('交货日期 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请选择交货日期', text: this.deliveryDate })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.deliveryDate = value;
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 交货地址
      Column() {
        Row() {
          Text('交货地址 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入交货地址', text: this.deliveryAddress })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.deliveryAddress = value;
          })
      }
      .width('100%')
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
    Button('保存订单')
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

  // 获取总金额
  getTotalAmount(): number {
    return this.products.reduce((sum, p) => sum + p.amount, 0);
  }

  // 是否可以提交
  canSubmit(): boolean {
    return this.customerId.length > 0 &&
           this.products.length > 0 &&
           this.deliveryDate.trim().length > 0 &&
           this.deliveryAddress.trim().length > 0;
  }

  // 提交
  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      // TODO: 显示错误提示
      return;
    }

    this.isSubmitting = true;

    try {
      const orderData = {
        customerId: this.customerId,
        products: this.products,
        deliveryDate: this.deliveryDate,
        deliveryAddress: this.deliveryAddress,
        totalAmount: this.getTotalAmount(),
        remark: this.remark,
      };

      await this.apiService.post('/mobile/orders', orderData);

      // TODO: 显示成功提示
      router.back();
    } catch (error) {
      console.error('创建订单失败', error);
      // TODO: 显示错误提示
    } finally {
      this.isSubmitting = false;
    }
  }
}
