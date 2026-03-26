# 组件库设计文档

> **版本**: v1.0  
> **设计日期**: 2026-03-18  
> **所属系统**: 道达智能数字化平台  
> **技术栈**: React 18 + TypeScript + Ant Design 5

---

## 📋 文档目录

1. [设计规范](#一设计规范)
2. [基础组件](#二基础组件)
3. [业务组件](#三业务组件)
4. [图表组件](#四图表组件)
5. [布局组件](#五布局组件)
6. [组件开发规范](#六组件开发规范)

---

# 一、设计规范

## 1.1 设计系统

```
┌─────────────────────────────────────────────────────────────────┐
│                     道达智能设计系统                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 色彩系统                                                    │
│     ┌─────────────────────────────────────────────────────────┐│
│     │ 主色 (Primary)                                          ││
│     │ --color-primary: #6600ff                                ││
│     │ --color-primary-hover: #7c33ff                          ││
│     │ --color-primary-active: #5500cc                         ││
│     │                                                         ││
│     │ 功能色                                                   ││
│     │ --color-success: #52c41a                                ││
│     │ --color-warning: #faad14                                ││
│     │ --color-error: #ff4d4f                                  ││
│     │ --color-info: #1890ff                                   ││
│     │                                                         ││
│     │ 中性色 (深色主题)                                        ││
│     │ --color-bg-base: #0A0A0A                                ││
│     │ --color-bg-elevated: #141414                            ││
│     │ --color-bg-container: #1F1F1F                           ││
│     │ --color-text-primary: #FFFFFF                           ││
│     │ --color-text-secondary: #A6A6A6                         ││
│     │ --color-text-tertiary: #666666                          ││
│     │ --color-border: #303030                                 ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
│  2. 字体系统                                                    │
│     ┌─────────────────────────────────────────────────────────┐│
│     │ 字体家族                                                 ││
│     │ --font-family: -apple-system, BlinkMacSystemFont,      ││
│     │                'Segoe UI', Roboto, 'Helvetica Neue',   ││
│     │                Arial, 'Noto Sans SC', sans-serif        ││
│     │                                                         ││
│     │ 字体大小                                                 ││
│     │ --font-size-xs: 12px                                    ││
│     │ --font-size-sm: 13px                                    ││
│     │ --font-size-base: 14px                                  ││
│     │ --font-size-lg: 16px                                    ││
│     │ --font-size-xl: 20px                                    ││
│     │ --font-size-2xl: 24px                                   ││
│     │ --font-size-3xl: 30px                                   ││
│     │                                                         ││
│     │ 行高                                                     ││
│     │ --line-height-tight: 1.25                               ││
│     │ --line-height-base: 1.5                                 ││
│     │ --line-height-loose: 1.75                               ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
│  3. 间距系统                                                    │
│     ┌─────────────────────────────────────────────────────────┐│
│     │ 基础单位: 4px                                            ││
│     │                                                         ││
│     │ --spacing-xs: 4px   (1单位)                             ││
│     │ --spacing-sm: 8px   (2单位)                             ││
│     │ --spacing-md: 16px  (4单位)                             ││
│     │ --spacing-lg: 24px  (6单位)                             ││
│     │ --spacing-xl: 32px  (8单位)                             ││
│     │ --spacing-2xl: 48px (12单位)                            ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
│  4. 圆角系统                                                    │
│     ┌─────────────────────────────────────────────────────────┐│
│     │ --radius-sm: 4px                                        ││
│     │ --radius-base: 8px                                      ││
│     │ --radius-lg: 12px                                       ││
│     │ --radius-xl: 16px                                       ││
│     │ --radius-full: 9999px                                   ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
│  5. 阴影系统                                                    │
│     ┌─────────────────────────────────────────────────────────┐│
│     │ --shadow-sm: 0 1px 2px rgba(0,0,0,0.3)                  ││
│     │ --shadow-base: 0 2px 8px rgba(0,0,0,0.3)                ││
│     │ --shadow-lg: 0 4px 16px rgba(0,0,0,0.4)                 ││
│     │ --shadow-xl: 0 8px 32px rgba(0,0,0,0.5)                 ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 组件分类

```
组件库结构
├── 基础组件 (Base Components)
│   ├── 按钮 Button
│   ├── 输入框 Input
│   ├── 选择器 Select
│   ├── 日期选择器 DatePicker
│   ├── 表格 Table
│   ├── 表单 Form
│   ├── 弹窗 Modal
│   ├── 消息 Message
│   └── ...
│
├── 业务组件 (Business Components)
│   ├── 客户选择器 CustomerSelect
│   ├── 产品选择器 ProductSelect
│   ├── 用户选择器 UserSelect
│   ├── 部门选择器 DeptSelect
│   ├── 地址选择器 AddressSelect
│   ├── 数据字典 DictSelect
│   ├── 审批流程 ApprovalFlow
│   ├── 跟进记录 FollowUpRecord
│   ├── 时间线 Timeline
│   └── ...
│
├── 图表组件 (Chart Components)
│   ├── 折线图 LineChart
│   ├── 柱状图 BarChart
│   ├── 饼图 PieChart
│   ├── 仪表盘 Gauge
│   ├── 数据卡片 DataCard
│   ├── 趋势图 TrendChart
│   └── ...
│
└── 布局组件 (Layout Components)
    ├── 页面布局 PageLayout
    ├── 搜索栏 SearchBar
    ├── 操作栏 ActionBar
    ├── 详情页 DetailLayout
    └── ...
```

---

# 二、基础组件

## 2.1 Button 按钮

```typescript
/**
 * 按钮组件
 * 支持多种类型、尺寸和状态
 */

interface ButtonProps {
  // 按钮类型
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  // 按钮尺寸
  size?: 'small' | 'middle' | 'large';
  // 按钮状态
  status?: 'normal' | 'loading' | 'disabled';
  // 图标
  icon?: React.ReactNode;
  // 危险按钮
  danger?: boolean;
  // 块级按钮
  block?: boolean;
  // 点击事件
  onClick?: (event: React.MouseEvent) => void;
  // 子元素
  children?: React.ReactNode;
}

// 使用示例
<Button type="primary">主要按钮</Button>
<Button type="default">默认按钮</Button>
<Button type="dashed">虚线按钮</Button>
<Button type="text">文本按钮</Button>
<Button type="link">链接按钮</Button>

<Button danger>危险按钮</Button>
<Button loading>加载中</Button>
<Button disabled>禁用按钮</Button>

<Button icon={<PlusOutlined />}>新增</Button>
<Button type="primary" icon={<SearchOutlined />}>搜索</Button>
```

## 2.2 Input 输入框

```typescript
/**
 * 输入框组件
 * 支持前后缀、清除按钮、密码显示等
 */

interface InputProps {
  // 输入框类型
  type?: 'text' | 'password' | 'number' | 'textarea';
  // 输入框尺寸
  size?: 'small' | 'middle' | 'large';
  // 占位文本
  placeholder?: string;
  // 默认值
  defaultValue?: string;
  // 当前值
  value?: string;
  // 值变化回调
  onChange?: (value: string) => void;
  // 前缀
  prefix?: React.ReactNode;
  // 后缀
  suffix?: React.ReactNode;
  // 是否显示清除按钮
  allowClear?: boolean;
  // 最大长度
  maxLength?: number;
  // 是否禁用
  disabled?: boolean;
  // 是否只读
  readOnly?: boolean;
  // 状态
  status?: 'error' | 'warning';
}

// 使用示例
<Input placeholder="请输入" />
<Input prefix={<UserOutlined />} placeholder="用户名" />
<Input suffix={<SearchOutlined />} placeholder="搜索" />
<Input.Password placeholder="密码" />
<Input.TextArea rows={4} placeholder="多行文本" />
<InputNumber min={0} max={100} placeholder="数字输入" />
```

## 2.3 Select 选择器

```typescript
/**
 * 选择器组件
 * 支持单选、多选、搜索、分组等
 */

interface SelectProps<T = any> {
  // 选项数据
  options: Array<{
    value: T;
    label: string;
    disabled?: boolean;
    children?: SelectProps['options'];
  }>;
  // 当前值
  value?: T | T[];
  // 值变化回调
  onChange?: (value: T | T[]) => void;
  // 占位文本
  placeholder?: string;
  // 是否多选
  mode?: 'multiple' | 'tags';
  // 是否可搜索
  showSearch?: boolean;
  // 搜索过滤函数
  filterOption?: (input: string, option: any) => boolean;
  // 是否显示清除按钮
  allowClear?: boolean;
  // 是否禁用
  disabled?: boolean;
  // 加载状态
  loading?: boolean;
  // 尺寸
  size?: 'small' | 'middle' | 'large';
}

// 使用示例
<Select
  options={[
    { value: 'A', label: 'A类客户' },
    { value: 'B', label: 'B类客户' },
    { value: 'C', label: 'C类客户' },
  ]}
  placeholder="请选择客户等级"
/>

<Select
  mode="multiple"
  options={[...]}
  placeholder="多选"
/>

<Select
  showSearch
  options={[...]}
  placeholder="可搜索"
/>
```

## 2.4 Table 表格

```typescript
/**
 * 表格组件
 * 支持排序、筛选、分页、行选择等
 */

interface TableProps<T = any> {
  // 列定义
  columns: ColumnType<T>[];
  // 数据源
  dataSource: T[];
  // 行键
  rowKey: string | ((record: T) => string);
  // 加载状态
  loading?: boolean;
  // 分页配置
  pagination?: PaginationConfig | false;
  // 行选择配置
  rowSelection?: RowSelectionConfig<T>;
  // 是否显示边框
  bordered?: boolean;
  // 表格尺寸
  size?: 'small' | 'middle' | 'large';
  // 滚动配置
  scroll?: { x?: number | string; y?: number | string };
  // 展开行配置
  expandable?: ExpandableConfig<T>;
  // 行点击事件
  onRow?: (record: T, index: number) => React.HTMLAttributes<any>;
}

interface ColumnType<T = any> {
  // 列标题
  title: string | React.ReactNode;
  // 数据字段
  dataIndex: string;
  // 列键
  key?: string;
  // 列宽度
  width?: number | string;
  // 最小宽度
  minWidth?: number;
  // 固定列
  fixed?: 'left' | 'right';
  // 对齐方式
  align?: 'left' | 'center' | 'right';
  // 排序
  sorter?: boolean | ((a: T, b: T) => number);
  // 筛选
  filters?: Array<{ text: string; value: any }>;
  // 渲染函数
  render?: (value: any, record: T, index: number) => React.ReactNode;
  // 是否可省略
  ellipsis?: boolean;
}

// 使用示例
const columns = [
  {
    title: '客户名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <a onClick={() => viewDetail(record.id)}>{text}</a>
    ),
  },
  {
    title: '客户等级',
    dataIndex: 'level',
    key: 'level',
    filters: [
      { text: 'VIP', value: 'VIP' },
      { text: 'A', value: 'A' },
      { text: 'B', value: 'B' },
    ],
    render: (level) => <CustomerLevelBadge level={level} />,
  },
  {
    title: '累计金额',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    align: 'right',
    sorter: true,
    render: (amount) => `¥${amount.toLocaleString()}`,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
    render: (_, record) => (
      <Space>
        <Button type="link" size="small">查看</Button>
        <Button type="link" size="small">编辑</Button>
      </Space>
    ),
  },
];

<Table
  columns={columns}
  dataSource={customers}
  rowKey="id"
  loading={loading}
  pagination={{
    current: page,
    pageSize: 20,
    total: 100,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  }}
/>
```

## 2.5 Form 表单

```typescript
/**
 * 表单组件
 * 支持表单验证、布局、嵌套等
 */

interface FormProps {
  // 表单实例
  form?: FormInstance;
  // 初始值
  initialValues?: object;
  // 表单名称
  name?: string;
  // 布局
  layout?: 'horizontal' | 'vertical' | 'inline';
  // 标签宽度
  labelCol?: ColProps;
  // 控件宽度
  wrapperCol?: ColProps;
  // 提交回调
  onFinish?: (values: any) => void;
  // 验证失败回调
  onFinishFailed?: (errorInfo: ValidateErrorEntity) => void;
  // 值变化回调
  onValuesChange?: (changedValues: any, values: any) => void;
}

// 使用示例
const CustomerForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ type: 'enterprise' }}
    >
      <Form.Item
        name="name"
        label="客户名称"
        rules={[{ required: true, message: '请输入客户名称' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        name="level"
        label="客户等级"
        rules={[{ required: true, message: '请选择客户等级' }]}
      >
        <DictSelect type="customer_level" />
      </Form.Item>

      <Form.Item
        name="ownerId"
        label="负责人"
        rules={[{ required: true, message: '请选择负责人' }]}
      >
        <UserSelect placeholder="请选择负责人" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};
```

---

# 三、业务组件

## 3.1 CustomerSelect 客户选择器

```typescript
/**
 * 客户选择器组件
 * 支持搜索、分页、快速创建
 */

interface CustomerSelectProps {
  // 当前值
  value?: string | string[];
  // 值变化回调
  onChange?: (value: string | string[], customers: Customer[]) => void;
  // 占位文本
  placeholder?: string;
  // 是否多选
  multiple?: boolean;
  // 是否显示快速创建
  showQuickCreate?: boolean;
  // 是否禁用
  disabled?: boolean;
  // 过滤条件
  filter?: {
    level?: string[];
    stage?: string[];
    ownerId?: string;
  };
}

// 使用示例
<CustomerSelect
  placeholder="请选择客户"
  onChange={(value, customers) => {
    console.log(value, customers);
  }}
/>

<CustomerSelect
  multiple
  filter={{ level: ['VIP', 'A'] }}
  showQuickCreate
/>
```

## 3.2 UserSelect 用户选择器

```typescript
/**
 * 用户选择器组件
 * 支持按部门筛选、搜索
 */

interface UserSelectProps {
  // 当前值
  value?: string | string[];
  // 值变化回调
  onChange?: (value: string | string[], users: User[]) => void;
  // 占位文本
  placeholder?: string;
  // 是否多选
  multiple?: boolean;
  // 部门ID (只显示该部门用户)
  deptId?: string;
  // 角色ID (只显示该角色用户)
  roleId?: string;
  // 是否显示部门筛选
  showDeptFilter?: boolean;
  // 是否禁用
  disabled?: boolean;
}

// 使用示例
<UserSelect placeholder="请选择负责人" />
<UserSelect multiple showDeptFilter />
<UserSelect deptId="xxx" placeholder="选择部门成员" />
```

## 3.3 DeptSelect 部门选择器

```typescript
/**
 * 部门选择器组件
 * 树形结构展示
 */

interface DeptSelectProps {
  // 当前值
  value?: string;
  // 值变化回调
  onChange?: (value: string, dept: Department) => void;
  // 占位文本
  placeholder?: string;
  // 是否显示搜索
  showSearch?: boolean;
  // 是否可选父节点
  selectableParent?: boolean;
  // 是否禁用
  disabled?: boolean;
}

// 使用示例
<DeptSelect placeholder="请选择部门" showSearch />
```

## 3.4 DictSelect 数据字典选择器

```typescript
/**
 * 数据字典选择器
 * 从字典表获取选项
 */

interface DictSelectProps {
  // 字典类型
  type: string;
  // 当前值
  value?: string | string[];
  // 值变化回调
  onChange?: (value: string | string[], option: DictItem) => void;
  // 占位文本
  placeholder?: string;
  // 是否多选
  multiple?: boolean;
  // 是否显示全部选项
  showAll?: boolean;
  // 是否禁用
  disabled?: boolean;
}

// 使用示例
<DictSelect type="customer_level" placeholder="客户等级" />
<DictSelect type="order_status" multiple placeholder="订单状态" />
```

## 3.5 AddressSelect 地址选择器

```typescript
/**
 * 地址选择器组件
 * 省市区三级联动
 */

interface AddressSelectProps {
  // 当前值
  value?: {
    province: string;
    city: string;
    district: string;
  };
  // 值变化回调
  onChange?: (value: AddressSelectProps['value']) => void;
  // 占位文本
  placeholder?: string;
  // 是否禁用
  disabled?: boolean;
}

// 使用示例
<AddressSelect
  value={{ province: '四川省', city: '成都市', district: '高新区' }}
  onChange={(value) => console.log(value)}
/>
```

## 3.6 ApprovalFlow 审批流程

```typescript
/**
 * 审批流程组件
 * 展示审批进度和状态
 */

interface ApprovalFlowProps {
  // 审批节点列表
  nodes: ApprovalNode[];
  // 当前节点
  currentNodeId?: string;
  // 方向
  direction?: 'horizontal' | 'vertical';
}

interface ApprovalNode {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  operator?: {
    id: string;
    name: string;
    avatar?: string;
  };
  operateTime?: string;
  comment?: string;
}

// 使用示例
<ApprovalFlow
  nodes={[
    {
      id: '1',
      name: '提交申请',
      status: 'approved',
      operator: { id: 'xxx', name: '张三' },
      operateTime: '2026-03-18 10:00',
    },
    {
      id: '2',
      name: '部门审批',
      status: 'processing',
      operator: { id: 'xxx', name: '李四' },
    },
    {
      id: '3',
      name: '财务审批',
      status: 'pending',
    },
  ]}
  currentNodeId="2"
/>
```

## 3.7 FollowUpRecord 跟进记录

```typescript
/**
 * 跟进记录组件
 * 时间线展示
 */

interface FollowUpRecordProps {
  // 记录列表
  records: FollowUp[];
  // 是否可添加
  canAdd?: boolean;
  // 添加回调
  onAdd?: (record: FollowUp) => void;
}

interface FollowUp {
  id: string;
  type: 'phone' | 'visit' | 'email' | 'wechat' | 'meeting';
  content: string;
  nextFollowUp?: {
    date: string;
    content: string;
  };
  attachments?: Attachment[];
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

// 使用示例
<FollowUpRecord
  records={followUps}
  canAdd
  onAdd={(record) => {
    console.log('新增跟进', record);
  }}
/>
```

## 3.8 StatusBadge 状态徽章

```typescript
/**
 * 状态徽章组件
 * 带颜色的状态展示
 */

interface StatusBadgeProps {
  // 状态值
  status: string;
  // 状态文本
  text?: string;
  // 状态类型映射
  statusMap?: Record<string, {
    text: string;
    color: string;
  }>;
}

// 预设状态映射
const defaultStatusMap = {
  // 通用状态
  active: { text: '启用', color: 'success' },
  inactive: { text: '停用', color: 'default' },
  
  // 客户阶段
  potential: { text: '潜客', color: 'default' },
  new: { text: '新客', color: 'processing' },
  active: { text: '活跃', color: 'success' },
  loyal: { text: '忠诚', color: 'gold' },
  churned: { text: '流失', color: 'error' },
  
  // 工单状态
  pending: { text: '待处理', color: 'warning' },
  in_progress: { text: '处理中', color: 'processing' },
  completed: { text: '已完成', color: 'success' },
  closed: { text: '已关闭', color: 'default' },
};

// 使用示例
<StatusBadge status="active" />
<StatusBadge status="VIP" text="VIP客户" statusMap={{
  VIP: { text: 'VIP', color: 'gold' },
  A: { text: 'A类', color: 'success' },
}} />
```

## 3.9 CustomerLevelBadge 客户等级徽章

```typescript
/**
 * 客户等级徽章
 * VIP用特殊样式
 */

interface CustomerLevelBadgeProps {
  level: 'VIP' | 'A' | 'B' | 'C' | 'D';
}

// 使用示例
<CustomerLevelBadge level="VIP" />  // 金色星标
<CustomerLevelBadge level="A" />    // 绿色
<CustomerLevelBadge level="B" />    // 蓝色
```

## 3.10 MoneyAmount 金额显示

```typescript
/**
 * 金额显示组件
 * 格式化金额，支持大写
 */

interface MoneyAmountProps {
  // 金额
  amount: number;
  // 货币
  currency?: 'CNY' | 'USD' | 'EUR';
  // 是否显示货币符号
  showSymbol?: boolean;
  // 是否显示大写
  showChinese?: boolean;
  // 精度
  precision?: number;
  // 字体大小
  size?: 'small' | 'default' | 'large';
}

// 使用示例
<MoneyAmount amount={1256000} />
// ¥1,256,000.00

<MoneyAmount amount={1256000} showChinese />
// ¥1,256,000.00 (壹佰贰拾伍万陆仟元整)

<MoneyAmount amount={1256000} size="large" showSymbol={false} />
// 1,256,000.00
```

---

# 四、图表组件

## 4.1 DataCard 数据卡片

```typescript
/**
 * 数据卡片组件
 * 展示关键指标
 */

interface DataCardProps {
  // 标题
  title: string;
  // 数值
  value: number | string;
  // 前缀图标
  icon?: React.ReactNode;
  // 单位
  unit?: string;
  // 趋势
  trend?: {
    value: number;
    type: 'up' | 'down';
  };
  // 对比值
  compare?: {
    value: number;
    label: string;
  };
  // 颜色主题
  theme?: 'primary' | 'success' | 'warning' | 'error';
  // 加载状态
  loading?: boolean;
}

// 使用示例
<DataCard
  title="今日产量"
  value={78}
  unit="台"
  icon={<ProductionIcon />}
  trend={{ value: 8, type: 'up' }}
  compare={{ value: 72, label: '昨日' }}
/>

<DataCard
  title="完成率"
  value={78}
  unit="%"
  theme="primary"
/>
```

## 4.2 LineChart 折线图

```typescript
/**
 * 折线图组件
 * 基于ECharts封装
 */

interface LineChartProps {
  // 数据
  data: {
    xAxis: string[];
    series: Array<{
      name: string;
      data: number[];
    }>;
  };
  // 高度
  height?: number;
  // 是否显示图例
  showLegend?: boolean;
  // 是否平滑
  smooth?: boolean;
  // 是否显示面积
  area?: boolean;
  // Y轴单位
  yAxisUnit?: string;
  // 加载状态
  loading?: boolean;
}

// 使用示例
<LineChart
  data={{
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    series: [
      { name: '销售额', data: [120, 200, 150, 180, 220, 250] },
      { name: '订单量', data: [60, 80, 70, 90, 100, 120] },
    ],
  }}
  height={300}
  showLegend
  smooth
/>
```

## 4.3 BarChart 柱状图

```typescript
/**
 * 柱状图组件
 */

interface BarChartProps {
  // 数据
  data: {
    xAxis: string[];
    series: Array<{
      name: string;
      data: number[];
      stack?: string;
    }>;
  };
  // 高度
  height?: number;
  // 是否横向
  horizontal?: boolean;
  // 是否显示图例
  showLegend?: boolean;
  // Y轴单位
  yAxisUnit?: string;
  // 加载状态
  loading?: boolean;
}

// 使用示例
<BarChart
  data={{
    xAxis: ['产品A', '产品B', '产品C', '产品D'],
    series: [
      { name: '销售额', data: [320, 280, 200, 150] },
    ],
  }}
  height={300}
/>
```

## 4.4 PieChart 饼图

```typescript
/**
 * 饼图组件
 */

interface PieChartProps {
  // 数据
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  // 高度
  height?: number;
  // 是否显示图例
  showLegend?: boolean;
  // 图例位置
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  // 是否环形图
  ring?: boolean;
  // 加载状态
  loading?: boolean;
}

// 使用示例
<PieChart
  data={[
    { name: '运行', value: 18, color: '#52c41a' },
    { name: '待机', value: 4, color: '#faad14' },
    { name: '故障', value: 2, color: '#ff4d4f' },
    { name: '离线', value: 1, color: '#d9d9d9' },
  ]}
  height={300}
  ring
  showLegend
/>
```

## 4.5 Gauge 仪表盘

```typescript
/**
 * 仪表盘组件
 */

interface GaugeProps {
  // 当前值
  value: number;
  // 最大值
  max?: number;
  // 标题
  title?: string;
  // 单位
  unit?: string;
  // 阈值配置
  thresholds?: Array<{
    value: number;
    color: string;
    label?: string;
  }>;
  // 高度
  height?: number;
}

// 使用示例
<Gauge
  value={85.2}
  title="OEE"
  unit="%"
  thresholds={[
    { value: 60, color: '#ff4d4f' },
    { value: 80, color: '#faad14' },
    { value: 100, color: '#52c41a' },
  ]}
  height={200}
/>
```

## 4.6 TrendChart 趋势图

```typescript
/**
 * 趋势图组件
 * 带目标的趋势对比
 */

interface TrendChartProps {
  // 实际数据
  actual: Array<{
    date: string;
    value: number;
  }>;
  // 目标数据
  target?: Array<{
    date: string;
    value: number;
  }>;
  // 高度
  height?: number;
  // 是否显示累计
  showCumulative?: boolean;
}

// 使用示例
<TrendChart
  actual={[
    { date: '03-01', value: 80 },
    { date: '03-02', value: 92 },
    { date: '03-03', value: 88 },
  ]}
  target={[
    { date: '03-01', value: 100 },
    { date: '03-02', value: 100 },
    { date: '03-03', value: 100 },
  ]}
  showCumulative
/>
```

---

# 五、布局组件

## 5.1 PageLayout 页面布局

```typescript
/**
 * 页面布局组件
 * 标准页面结构
 */

interface PageLayoutProps {
  // 页面标题
  title?: string | React.ReactNode;
  // 面包屑
  breadcrumb?: Array<{ title: string; href?: string }>;
  // 操作区
  actions?: React.ReactNode;
  // 标签页
  tabs?: Array<{
    key: string;
    label: string;
    children: React.ReactNode;
  }>;
  // 是否显示返回按钮
  showBack?: boolean;
  // 返回路径
  backPath?: string;
  // 内容区
  children: React.ReactNode;
  // 底部操作栏
  footer?: React.ReactNode;
  // 加载状态
  loading?: boolean;
}

// 使用示例
<PageLayout
  title="客户管理"
  breadcrumb={[
    { title: '首页', href: '/' },
    { title: 'CRM', href: '/crm' },
    { title: '客户管理' },
  ]}
  actions={
    <Space>
      <Button>导出</Button>
      <Button type="primary">新增客户</Button>
    </Space>
  }
>
  {/* 页面内容 */}
</PageLayout>
```

## 5.2 SearchBar 搜索栏

```typescript
/**
 * 搜索栏组件
 * 可折叠的筛选表单
 */

interface SearchBarProps {
  // 表单项
  fields: SearchField[];
  // 搜索回调
  onSearch: (values: any) => void;
  // 重置回调
  onReset?: () => void;
  // 是否默认展开
  defaultCollapsed?: boolean;
  // 加载状态
  loading?: boolean;
}

interface SearchField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'dateRange' | 'number' | 'custom';
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
  component?: React.ReactNode;
}

// 使用示例
<SearchBar
  fields={[
    {
      name: 'keyword',
      label: '关键词',
      type: 'input',
      placeholder: '客户名称/编码',
    },
    {
      name: 'level',
      label: '客户等级',
      type: 'select',
      options: [
        { value: 'VIP', label: 'VIP' },
        { value: 'A', label: 'A类' },
      ],
    },
    {
      name: 'dateRange',
      label: '创建时间',
      type: 'dateRange',
    },
  ]}
  onSearch={(values) => {
    console.log(values);
  }}
/>
```

## 5.3 DetailLayout 详情页布局

```typescript
/**
 * 详情页布局组件
 * 信息展示 + 操作区
 */

interface DetailLayoutProps {
  // 标题
  title?: string | React.ReactNode;
  // 标签
  tags?: React.ReactNode;
  // 操作区
  actions?: React.ReactNode;
  // 基本信息
  baseInfo?: Array<{
    label: string;
    value: React.ReactNode;
  }>;
  // 标签页
  tabs?: Array<{
    key: string;
    label: string;
    children: React.ReactNode;
  }>;
  // 默认激活标签
  defaultActiveKey?: string;
  // 返回按钮
  showBack?: boolean;
  // 子元素 (不使用tabs时)
  children?: React.ReactNode;
}

// 使用示例
<DetailLayout
  title="四川道达智能科技有限公司"
  tags={<CustomerLevelBadge level="VIP" />}
  actions={
    <Space>
      <Button>编辑</Button>
      <Button danger>删除</Button>
    </Space>
  }
  baseInfo={[
    { label: '客户编码', value: 'C20260318001' },
    { label: '客户类型', value: '企业客户' },
    { label: '负责人', value: '张三' },
    { label: '创建时间', value: '2025-06-15' },
  ]}
  tabs={[
    { key: 'contacts', label: '联系人', children: <ContactList /> },
    { key: 'orders', label: '订单', children: <OrderList /> },
    { key: 'followUps', label: '跟进', children: <FollowUpList /> },
  ]}
/>
```

## 5.4 ActionBar 操作栏

```typescript
/**
 * 操作栏组件
 * 批量操作区
 */

interface ActionBarProps {
  // 已选数量
  selectedCount: number;
  // 操作按钮
  actions: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    danger?: boolean;
    confirm?: string;
    onClick: () => void;
  }>;
  // 取消选择回调
  onCancel?: () => void;
}

// 使用示例
<ActionBar
  selectedCount={selectedRowKeys.length}
  actions={[
    {
      key: 'transfer',
      label: '转移',
      icon: <TransferIcon />,
      onClick: handleTransfer,
    },
    {
      key: 'delete',
      label: '删除',
      danger: true,
      confirm: '确定删除选中的客户吗？',
      onClick: handleDelete,
    },
  ]}
  onCancel={() => setSelectedRowKeys([])}
/>
```

---

# 六、组件开发规范

## 6.1 目录结构

```
src/components/
├── base/                    # 基础组件
│   ├── Button/
│   │   ├── index.tsx        # 组件实现
│   │   ├── styles.module.css # 样式文件
│   │   ├── types.ts         # 类型定义
│   │   └── index.ts         # 导出
│   ├── Input/
│   ├── Select/
│   └── ...
│
├── business/                # 业务组件
│   ├── CustomerSelect/
│   │   ├── index.tsx
│   │   ├── styles.module.css
│   │   ├── types.ts
│   │   └── index.ts
│   └── ...
│
├── charts/                  # 图表组件
│   ├── LineChart/
│   ├── BarChart/
│   └── ...
│
└── layout/                  # 布局组件
    ├── PageLayout/
    ├── SearchBar/
    └── ...
```

## 6.2 组件模板

```typescript
/**
 * 组件模板
 * ComponentTemplate
 */

import React, { forwardRef, memo } from 'react';
import classNames from 'classnames';
import type { ComponentTemplateProps } from './types';
import styles from './styles.module.css';

/**
 * 组件描述
 * 
 * @example
 * <ComponentTemplate value="xxx" onChange={handleChange} />
 */
const ComponentTemplate = memo(
  forwardRef<HTMLDivElement, ComponentTemplateProps>((props, ref) => {
    const {
      className,
      style,
      value,
      onChange,
      disabled,
      ...restProps
    } = props;

    const cls = classNames(
      styles.container,
      {
        [styles.disabled]: disabled,
      },
      className,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(e.target.value);
    };

    return (
      <div ref={ref} className={cls} style={style} {...restProps}>
        {/* 组件内容 */}
      </div>
    );
  })
);

ComponentTemplate.displayName = 'ComponentTemplate';

export { ComponentTemplate };
export type { ComponentTemplateProps };
```

## 6.3 类型定义模板

```typescript
/**
 * 类型定义
 */

import type { ReactNode, CSSProperties } from 'react';

export interface ComponentTemplateProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 当前值 */
  value?: string;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子元素 */
  children?: ReactNode;
}
```

## 6.4 样式规范

```css
/* styles.module.css */

/* 容器 */
.container {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

/* 禁用状态 */
.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 使用CSS变量 */
.container {
  color: var(--color-text-primary);
  background: var(--color-bg-container);
  border-radius: var(--radius-base);
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```

## 6.5 测试规范

```typescript
/**
 * 组件测试
 * ComponentTemplate.test.tsx
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentTemplate } from './index';

describe('ComponentTemplate', () => {
  it('should render correctly', () => {
    render(<ComponentTemplate value="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<ComponentTemplate onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('should be disabled', () => {
    const handleChange = jest.fn();
    render(<ComponentTemplate disabled onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).not.toHaveBeenCalled();
  });
});
```

---

## 6.6 文档规范

每个组件需要包含以下文档：

```markdown
# ComponentName 组件名称

简短描述组件用途

## 何时使用

描述适用场景

## 代码演示

### 基础用法

\`\`\`tsx
<ComponentName />
\`\`\`

### 进阶用法

\`\`\`tsx
<ComponentName prop="value" />
\`\`\`

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| prop | 描述 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| onChange | 值变化时触发 | (value: string) => void |
```

---

*文档版本: v1.0*  
*最后更新: 2026-03-18*  
*作者: 渔晓白*