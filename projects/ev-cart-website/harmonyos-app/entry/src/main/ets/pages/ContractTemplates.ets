/**
 * 合同模板页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface ContractTemplate {
  id: string;
  templateCode: string;
  templateName: string;
  category: string;
  contractType: string;
  version: string;
  usageCount: number;
  rating: number;
}

@Entry
@Component
struct ContractTemplates {
  @State templates: ContractTemplate[] = [];
  @State isLoading: boolean = true;
  @State selectedCategory: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadTemplates();
  }

  async loadTemplates(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/contract-templates', {
        page: 1,
        limit: 20,
        category: this.selectedCategory === 'all' ? '' : this.selectedCategory
      });
      this.templates = data.items;
    } catch (error) {
      console.error('加载模板列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 分类筛选
      this.CategoryFilter()
      
      // 模板列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.templates, (template: ContractTemplate) => {
            this.TemplateItem(template)
          })
        }
        .width('100%')
        .layoutWeight(1)
      }
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
      
      Text('合同模板')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
      
      Blank()
      
      // 新建模板
      Image($r('sys.media.ohos_ic_public_add'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateContractTemplate' });
        })
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 分类筛选
  @Builder CategoryFilter() {
    Scroll() {
      Row() {
        this.CategoryItem('全部', 'all')
        this.CategoryItem('销售合同', 'sales')
        this.CategoryItem('采购合同', 'purchase')
        this.CategoryItem('服务合同', 'service')
        this.CategoryItem '经销合同', 'distribution')
      }
      .width('100%')
      .padding({ left: 15, right: 15 })
    }
    .width('100%')
    .height(60)
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 分类项
  @Builder CategoryItem(label: string, value: string) {
    Text(label)
      .fontSize(14)
      .fontWeight(this.selectedCategory === value ? FontWeight.Bold : FontWeight.Normal)
      .fontColor(this.selectedCategory === value ? '#FFFFFF' : '#757575')
      .padding({ left: 15, right: 15, top: 8, bottom: 8 })
      .backgroundColor(this.selectedCategory === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedCategory = value;
        this.loadTemplates();
      })
  }

  // 模板项
  @Builder TemplateItem(template: ContractTemplate) {
    Column() {
      Row() {
        Column() {
          Text('📄')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Text(template.templateName)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#212121')
          
          Row() {
            Text(`版本：${template.version}`)
              .fontSize(12)
              .fontColor('#757575')
            
            Text(' · ')
              .fontSize(12)
              .fontColor('#757575')
            
            Text(`使用${template.usageCount}次`)
              .fontSize(12)
              .fontColor('#757575')
          }
          .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(this.getCategoryName(template.category))
            .fontSize(12)
            .fontColor('#FFFFFF')
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .backgroundColor('#1976D2')
            .borderRadius(4)
          
          if (template.rating > 0) {
            Text(`★${template.rating.toFixed(1)}`)
              .fontSize(12)
              .fontColor('#FF9800')
              .margin({ top: 5 })
          }
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(template.templateCode)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('使用模板')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/CreateContract?templateId=${template.id}` });
          })
        
        Text('  ·  ')
          .fontSize(14)
          .fontColor('#757575')
        
        Text('查看')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ContractTemplateDetail?id=${template.id}` });
          })
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 辅助方法
  getCategoryName(category: string): string {
    const names: Record<string, string> = {
      'sales': '销售',
      'purchase': '采购',
      'service': '服务',
      'distribution': '经销',
      'other': '其他'
    };
    return names[category] || '其他';
  }
}
