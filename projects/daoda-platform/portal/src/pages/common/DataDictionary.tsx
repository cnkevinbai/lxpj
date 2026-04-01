/**
 * 数据字典页面
 * 全局数据标准、枚举管理、字段定义、数据一致性保障
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Modal,
  Descriptions,
  Tabs,
  Statistic,
  message,
  Tooltip,
  Select,
  DatePicker,
  Input,
  Popconfirm,
  Badge,
  Tree,
  Drawer,
  Form,
  Switch,
  InputNumber,
  Radio,
  Checkbox,
  Divider,
  List,
  Collapse,
  Progress,
  ColorPicker,
} from 'antd'
import {
  BookOutlined,
  SettingOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  HistoryOutlined,
  LinkOutlined,
  FileTextOutlined,
  CodeOutlined,
  FieldStringOutlined,
  TagsOutlined,
  GlobalOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  StarOutlined,
  AlertOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { Panel } = Collapse

// 字典类型枚举
enum DictionaryType {
  FIELD = 'FIELD',
  ENUM = 'ENUM',
  STATUS = 'STATUS',
  CATEGORY = 'CATEGORY',
  TYPE = 'TYPE',
  CODE = 'CODE',
  RULE = 'RULE',
  UNIT = 'UNIT',
  CURRENCY = 'CURRENCY',
  REGION = 'REGION',
  INDUSTRY = 'INDUSTRY',
  LEVEL = 'LEVEL',
  PRIORITY = 'PRIORITY',
  SEVERITY = 'SEVERITY',
}

// 字典状态枚举
enum DictionaryStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

// 所属模块枚举
enum Module {
  COMMON = 'COMMON',
  CRM = 'CRM',
  ERP = 'ERP',
  FINANCE = 'FINANCE',
  HR = 'HR',
  SERVICE = 'SERVICE',
  CMS = 'CMS',
  WORKFLOW = 'WORKFLOW',
  SETTINGS = 'SETTINGS',
  SYSTEM = 'SYSTEM',
}

export default function DataDictionary() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [references, setReferences] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalItems: 30,
    activeItems: 25,
    deprecatedItems: 3,
    totalCategories: 11,
    totalReferences: 5,
  })
  const [activeTab, setActiveTab] = useState('list')
  const [selectedModule, setSelectedModule] = useState<Module | undefined>()
  const [selectedType, setSelectedType] = useState<DictionaryType | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<DictionaryStatus | undefined>()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
    fetchCategories()
    fetchVersions()
    fetchReferences()
    fetchStats()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const mockItems = [
      { id: 'DICT-STATUS-001', code: 'STATUS_COMMON', name: '通用状态', type: DictionaryType.STATUS, module: Module.COMMON, dataType: 'ENUM', description: '系统中通用的状态枚举值', options: [{ code: 'ACTIVE', name: '启用', value: 1, color: 'green' }, { code: 'INACTIVE', name: '禁用', value: 0, color: 'default' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-STATUS-002', code: 'STATUS_CUSTOMER', name: '客户状态', type: DictionaryType.STATUS, module: Module.CRM, dataType: 'ENUM', description: 'CRM模块客户状态枚举', options: [{ code: 'POTENTIAL', name: '潜在客户', value: 10, color: 'blue' }, { code: 'ACTIVE', name: '活跃客户', value: 20, color: 'green' }, { code: 'VIP', name: 'VIP客户', value: 40, color: 'gold' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 2, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-STATUS-003', code: 'STATUS_LEAD', name: '线索状态', type: DictionaryType.STATUS, module: Module.CRM, dataType: 'ENUM', description: 'CRM模块线索状态枚举', options: [{ code: 'NEW', name: '新线索', value: 1, color: 'blue' }, { code: 'QUALIFIED', name: '已验证', value: 3, color: 'green' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 3, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-STATUS-004', code: 'STATUS_ORDER', name: '订单状态', type: DictionaryType.STATUS, module: Module.CRM, dataType: 'ENUM', description: 'CRM模块订单状态枚举', options: [{ code: 'DRAFT', name: '草稿', value: 10, color: 'default' }, { code: 'CONFIRMED', name: '已确认', value: 30, color: 'cyan' }, { code: 'COMPLETED', name: '已完成', value: 70, color: 'success' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 4, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-STATUS-005', code: 'STATUS_INVENTORY', name: '库存状态', type: DictionaryType.STATUS, module: Module.ERP, dataType: 'ENUM', description: 'ERP模块库存状态枚举', options: [{ code: 'NORMAL', name: '正常', value: 1, color: 'green' }, { code: 'LOW', name: '低库存', value: 2, color: 'orange' }, { code: 'CRITICAL', name: '警戒库存', value: 3, color: 'red' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 5, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-STATUS-006', code: 'STATUS_WORKFLOW', name: '流程状态', type: DictionaryType.STATUS, module: Module.WORKFLOW, dataType: 'ENUM', description: 'Workflow模块流程状态枚举', options: [{ code: 'DRAFT', name: '草稿', value: 10, color: 'default' }, { code: 'APPROVED', name: '已审批', value: 40, color: 'green' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 6, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-STATUS-007', code: 'STATUS_TICKET', name: '工单状态', type: DictionaryType.STATUS, module: Module.SERVICE, dataType: 'ENUM', description: 'Service模块工单状态枚举', options: [{ code: 'NEW', name: '新建', value: 1, color: 'blue' }, { code: 'IN_PROGRESS', name: '处理中', value: 4, color: 'processing' }, { code: 'CLOSED', name: '已关闭', value: 7, color: 'default' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 7, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-STATUS-008', code: 'STATUS_CONTENT', name: '内容状态', type: DictionaryType.STATUS, module: Module.CMS, dataType: 'ENUM', description: 'CMS模块内容状态枚举', options: [{ code: 'DRAFT', name: '草稿', value: 10, color: 'default' }, { code: 'PUBLISHED', name: '已发布', value: 40, color: 'green' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 8, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-TYPE-001', code: 'TYPE_CUSTOMER', name: '客户类型', type: DictionaryType.TYPE, module: Module.CRM, dataType: 'ENUM', description: 'CRM模块客户类型分类', options: [{ code: 'ENTERPRISE', name: '企业客户', value: 1, color: 'blue' }, { code: 'INDIVIDUAL', name: '个人客户', value: 2, color: 'cyan' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-TYPE-002', code: 'TYPE_PRODUCT', name: '产品类型', type: DictionaryType.TYPE, module: Module.ERP, dataType: 'ENUM', description: 'ERP模块产品类型分类', options: [{ code: 'STANDARD', name: '标准产品', value: 1, color: 'blue' }, { code: 'CUSTOM', name: '定制产品', value: 2, color: 'purple' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 2, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-TYPE-003', code: 'TYPE_TASK', name: '任务类型', type: DictionaryType.TYPE, module: Module.COMMON, dataType: 'ENUM', description: '通用任务类型分类', options: [{ code: 'TASK', name: '普通任务', value: 1, color: 'default' }, { code: 'MEETING', name: '会议', value: 2, color: 'blue' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 3, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-TYPE-004', code: 'TYPE_TICKET', name: '工单类型', type: DictionaryType.TYPE, module: Module.SERVICE, dataType: 'ENUM', description: 'Service模块工单类型分类', options: [{ code: 'INCIDENT', name: '事故', value: 1, color: 'red' }, { code: 'REQUEST', name: '请求', value: 3, color: 'blue' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 4, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-PRIORITY-001', code: 'PRIORITY_COMMON', name: '通用优先级', type: DictionaryType.PRIORITY, module: Module.COMMON, dataType: 'ENUM', description: '系统中通用的优先级枚举', options: [{ code: 'LOW', name: '低', value: 1, color: 'default' }, { code: 'HIGH', name: '高', value: 3, color: 'orange' }, { code: 'URGENT', name: '紧急', value: 4, color: 'red' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-PRIORITY-002', code: 'PRIORITY_TICKET', name: '工单优先级', type: DictionaryType.PRIORITY, module: Module.SERVICE, dataType: 'ENUM', description: 'Service模块工单优先级', options: [{ code: 'P1', name: 'P1-紧急', value: 1, color: 'red', description: '24小时内响应' }, { code: 'P2', name: 'P2-高', value: 2, color: 'orange', description: '48小时内响应' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 2, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-SEVERITY-001', code: 'SEVERITY_COMMON', name: '通用严重程度', type: DictionaryType.SEVERITY, module: Module.COMMON, dataType: 'ENUM', description: '系统中通用的严重程度枚举', options: [{ code: 'INFO', name: '信息', value: 1, color: 'default' }, { code: 'ERROR', name: '错误', value: 3, color: 'red' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-REGION-001', code: 'REGION_CHINA', name: '中国区域', type: DictionaryType.REGION, module: Module.COMMON, dataType: 'ENUM', description: '中国行政区域划分', options: [{ code: 'SC', name: '四川省', value: 'SC' }, { code: 'BJ', name: '北京市', value: 'BJ' }, { code: 'SH', name: '上海市', value: 'SH' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-INDUSTRY-001', code: 'INDUSTRY_COMMON', name: '行业分类', type: DictionaryType.INDUSTRY, module: Module.CRM, dataType: 'ENUM', description: '客户行业分类', options: [{ code: 'IT', name: 'IT/互联网', value: 1, color: 'blue' }, { code: 'FINANCE', name: '金融', value: 2, color: 'gold' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-CURRENCY-001', code: 'CURRENCY_COMMON', name: '货币类型', type: DictionaryType.CURRENCY, module: Module.FINANCE, dataType: 'ENUM', description: '系统中支持的货币类型', options: [{ code: 'CNY', name: '人民币', value: 'CNY', description: '¥' }, { code: 'USD', name: '美元', value: 'USD', description: '$' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-UNIT-001', code: 'UNIT_COMMON', name: '计量单位', type: DictionaryType.UNIT, module: Module.ERP, dataType: 'ENUM', description: 'ERP模块计量单位', options: [{ code: 'PCS', name: '件', value: 'PCS' }, { code: 'KG', name: '千克', value: 'KG' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-LEVEL-001', code: 'LEVEL_CUSTOMER', name: '客户等级', type: DictionaryType.LEVEL, module: Module.CRM, dataType: 'ENUM', description: 'CRM模块客户等级划分', options: [{ code: 'A', name: 'A级客户', value: 'A', color: 'gold' }, { code: 'B', name: 'B级客户', value: 'B', color: 'green' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-LEVEL-002', code: 'LEVEL_EMPLOYEE', name: '员工等级', type: DictionaryType.LEVEL, module: Module.HR, dataType: 'ENUM', description: 'HR模块员工等级划分', options: [{ code: 'E1', name: '初级', value: 'E1', color: 'default' }, { code: 'E5', name: '专家', value: 'E5', color: 'gold' }], status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 2, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-FIELD-001', code: 'FIELD_CUSTOMER_NAME', name: '客户名称字段', type: DictionaryType.FIELD, module: Module.CRM, dataType: 'STRING', description: '客户名称字段定义', minLength: 2, maxLength: 100, required: true, pattern: '^[\\u4e00-\\u9fa5a-zA-Z0-9]+$', status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-FIELD-002', code: 'FIELD_PHONE', name: '电话号码字段', type: DictionaryType.FIELD, module: Module.COMMON, dataType: 'PHONE', description: '电话号码字段定义', minLength: 11, maxLength: 20, pattern: '^[0-9+-]+$', status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 2, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-FIELD-003', code: 'FIELD_EMAIL', name: '邮箱字段', type: DictionaryType.FIELD, module: Module.COMMON, dataType: 'EMAIL', description: '邮箱地址字段定义', minLength: 5, maxLength: 100, pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 3, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-FIELD-004', code: 'FIELD_AMOUNT', name: '金额字段', type: DictionaryType.FIELD, module: Module.FINANCE, dataType: 'DECIMAL', description: '金额字段定义', minValue: 0, maxValue: 999999999999, defaultValue: 0, required: true, status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 4, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-FIELD-005', code: 'FIELD_QTY', name: '数量字段', type: DictionaryType.FIELD, module: Module.ERP, dataType: 'INTEGER', description: '数量字段定义', minValue: 0, maxValue: 999999999, defaultValue: 0, required: true, status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 5, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-CODE-001', code: 'CODE_CUSTOMER', name: '客户编码规则', type: DictionaryType.CODE, module: Module.CRM, dataType: 'STRING', description: '客户编码生成规则：CUS-{区域}-{日期}-{序号}', pattern: '^CUS-[A-Z]{2}-[0-9]{8}-[0-9]{4}$', status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 1, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-CODE-002', code: 'CODE_PRODUCT', name: '产品编码规则', type: DictionaryType.CODE, module: Module.ERP, dataType: 'STRING', description: '产品编码生成规则：PRD-{分类}-{序号}', pattern: '^PRD-[A-Z]{3}-[0-9]{6}$', status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 2, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DICT-CODE-003', code: 'CODE_ORDER', name: '订单编码规则', type: DictionaryType.CODE, module: Module.CRM, dataType: 'STRING', description: '订单编码生成规则：ORD-{日期}-{序号}', pattern: '^ORD-[0-9]{8}-[0-9]{6}$', status: DictionaryStatus.ACTIVE, version: '1.0', sortOrder: 3, createdBy: 'system', createdAt: new Date('2026-01-01') },
    ]
    setItems(mockItems)
    setLoading(false)
  }

  const fetchCategories = async () => {
    const mockCategories = [
      { id: 'CAT-001', code: 'STATUS', name: '状态字典', module: Module.COMMON, itemCount: 8 },
      { id: 'CAT-002', code: 'TYPE', name: '类型字典', module: Module.COMMON, itemCount: 4 },
      { id: 'CAT-003', code: 'PRIORITY', name: '优先级字典', module: Module.COMMON, itemCount: 2 },
      { id: 'CAT-004', code: 'SEVERITY', name: '严重程度字典', module: Module.COMMON, itemCount: 1 },
      { id: 'CAT-005', code: 'REGION', name: '区域字典', module: Module.COMMON, itemCount: 1 },
      { id: 'CAT-006', code: 'INDUSTRY', name: '行业字典', module: Module.CRM, itemCount: 1 },
      { id: 'CAT-007', code: 'CURRENCY', name: '货币字典', module: Module.FINANCE, itemCount: 1 },
      { id: 'CAT-008', code: 'UNIT', name: '单位字典', module: Module.ERP, itemCount: 1 },
      { id: 'CAT-009', code: 'LEVEL', name: '等级字典', module: Module.HR, itemCount: 2 },
      { id: 'CAT-010', code: 'FIELD', name: '字段定义', module: Module.COMMON, itemCount: 5 },
      { id: 'CAT-011', code: 'CODE', name: '编码规则', module: Module.COMMON, itemCount: 3 },
    ]
    setCategories(mockCategories)
  }

  const fetchVersions = async () => {
    const mockVersions = [
      { id: 'VER-001', version: '1.0', description: '初始版本，包含基础字典项', itemCount: 25, status: 'PUBLISHED', createdBy: 'system', createdAt: new Date('2026-01-01'), publishedAt: new Date('2026-01-01') },
      { id: 'VER-002', version: '1.1', description: '新增工单类型和优先级字典', itemCount: 27, status: 'PUBLISHED', createdBy: 'admin', createdAt: new Date('2026-03-01'), publishedAt: new Date('2026-03-01') },
      { id: 'VER-003', version: '2.0', description: '重大版本更新，新增字段定义和编码规则', itemCount: 30, status: 'DRAFT', createdBy: 'admin', createdAt: new Date('2026-03-31') },
    ]
    setVersions(mockVersions)
  }

  const fetchReferences = async () => {
    const mockRefs = [
      { id: 'REF-001', itemCode: 'STATUS_CUSTOMER', module: Module.CRM, entityType: 'Customer', entityField: 'status', usageType: 'REFERENCE', required: true },
      { id: 'REF-002', itemCode: 'STATUS_ORDER', module: Module.CRM, entityType: 'Order', entityField: 'status', usageType: 'REFERENCE', required: true },
      { id: 'REF-003', itemCode: 'PRIORITY_TICKET', module: Module.SERVICE, entityType: 'Ticket', entityField: 'priority', usageType: 'REFERENCE', required: true },
      { id: 'REF-004', itemCode: 'CURRENCY_COMMON', module: Module.FINANCE, entityType: 'Invoice', entityField: 'currency', usageType: 'DEFAULT', required: true },
      { id: 'REF-005', itemCode: 'FIELD_AMOUNT', module: Module.FINANCE, entityType: 'Invoice', entityField: 'amount', usageType: 'VALIDATION', required: true },
    ]
    setReferences(mockRefs)
  }

  const fetchStats = async () => {
    setStats({ totalItems: 30, activeItems: 25, deprecatedItems: 3, totalCategories: 11, totalReferences: 5 })
  }

  const getTypeIcon = (type: DictionaryType) => {
    const icons: Record<DictionaryType, any> = {
      [DictionaryType.FIELD]: <FieldStringOutlined />,
      [DictionaryType.ENUM]: <TagsOutlined />,
      [DictionaryType.STATUS]: <CheckCircleOutlined />,
      [DictionaryType.CATEGORY]: <ApartmentOutlined />,
      [DictionaryType.TYPE]: <SettingOutlined />,
      [DictionaryType.CODE]: <CodeOutlined />,
      [DictionaryType.RULE]: <FileTextOutlined />,
      [DictionaryType.UNIT]: <DollarOutlined />,
      [DictionaryType.CURRENCY]: <DollarOutlined />,
      [DictionaryType.REGION]: <EnvironmentOutlined />,
      [DictionaryType.INDUSTRY]: <GlobalOutlined />,
      [DictionaryType.LEVEL]: <StarOutlined />,
      [DictionaryType.PRIORITY]: <AlertOutlined />,
      [DictionaryType.SEVERITY]: <AlertOutlined />,
    }
    return icons[type] || <BookOutlined />
  }

  const getTypeTag = (type: DictionaryType) => {
    const config: Record<DictionaryType, { color: string; text: string }> = {
      [DictionaryType.FIELD]: { color: 'purple', text: '字段定义' },
      [DictionaryType.ENUM]: { color: 'cyan', text: '枚举' },
      [DictionaryType.STATUS]: { color: 'green', text: '状态' },
      [DictionaryType.CATEGORY]: { color: 'blue', text: '分类' },
      [DictionaryType.TYPE]: { color: 'magenta', text: '类型' },
      [DictionaryType.CODE]: { color: 'geekblue', text: '编码' },
      [DictionaryType.RULE]: { color: 'orange', text: '规则' },
      [DictionaryType.UNIT]: { color: 'lime', text: '单位' },
      [DictionaryType.CURRENCY]: { color: 'gold', text: '货币' },
      [DictionaryType.REGION]: { color: 'volcano', text: '区域' },
      [DictionaryType.INDUSTRY]: { color: 'blue', text: '行业' },
      [DictionaryType.LEVEL]: { color: 'purple', text: '等级' },
      [DictionaryType.PRIORITY]: { color: 'orange', text: '优先级' },
      [DictionaryType.SEVERITY]: { color: 'red', text: '严重程度' },
    }
    const c = config[type] || { color: 'default', text: type }
    return <Tag color={c.color} icon={getTypeIcon(type)}>{c.text}</Tag>
  }

  const getModuleTag = (module: Module) => {
    const config: Record<Module, { color: string; text: string }> = {
      [Module.COMMON]: { color: 'default', text: '通用' },
      [Module.CRM]: { color: 'blue', text: 'CRM' },
      [Module.ERP]: { color: 'cyan', text: 'ERP' },
      [Module.FINANCE]: { color: 'green', text: '财务' },
      [Module.HR]: { color: 'magenta', text: 'HR' },
      [Module.SERVICE]: { color: 'orange', text: '服务' },
      [Module.CMS]: { color: 'purple', text: 'CMS' },
      [Module.WORKFLOW]: { color: 'geekblue', text: '流程' },
      [Module.SETTINGS]: { color: 'default', text: '设置' },
      [Module.SYSTEM]: { color: 'red', text: '系统' },
    }
    const c = config[module] || { color: 'default', text: module }
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getStatusTag = (status: DictionaryStatus) => {
    const config: Record<DictionaryStatus, { color: string; icon: any; text: string }> = {
      [DictionaryStatus.DRAFT]: { color: 'default', icon: <EditOutlined />, text: '草稿' },
      [DictionaryStatus.ACTIVE]: { color: 'green', icon: <CheckCircleOutlined />, text: '生效' },
      [DictionaryStatus.DEPRECATED]: { color: 'orange', icon: <WarningOutlined />, text: '已废弃' },
      [DictionaryStatus.ARCHIVED]: { color: 'default', icon: <DeleteOutlined />, text: '已归档' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const handleExport = () => {
    message.success('字典数据已导出为JSON文件')
  }

  const handleImport = () => {
    message.info('请选择要导入的字典文件')
  }

  const handleCreateItem = () => {
    setSelectedItem(null)
    setEditModalVisible(true)
  }

  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setEditModalVisible(true)
  }

  const handleViewDetail = (item: any) => {
    setSelectedItem(item)
    setDetailModalVisible(true)
  }

  const handleDeleteItem = (id: string) => {
    message.success('字典项已归档')
    setItems(items.map(i => i.id === id ? { ...i, status: DictionaryStatus.ARCHIVED } : i))
  }

  const handleDeprecateItem = (id: string) => {
    message.success('字典项已废弃')
    setItems(items.map(i => i.id === id ? { ...i, status: DictionaryStatus.DEPRECATED, deprecatedAt: new Date() } : i))
  }

  const filteredItems = items.filter(i => {
    if (selectedModule && i.module !== selectedModule) return false
    if (selectedType && i.type !== selectedType) return false
    if (selectedStatus && i.status !== selectedStatus) return false
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      if (!i.code.toLowerCase().includes(kw) && !i.name.toLowerCase().includes(kw) && !(i.description && i.description.toLowerCase().includes(kw))) return false
    }
    return true
  })

  const itemColumns: ColumnsType<any> = [
    { title: '编码', dataIndex: 'code', width: 150, ellipsis: true, render: (code: string) => <Text copyable={{ text: code }}><Tag color="blue">{code}</Tag></Text> },
    { title: '名称', dataIndex: 'name', width: 120, ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 100, render: (type: DictionaryType) => getTypeTag(type) },
    { title: '模块', dataIndex: 'module', width: 80, render: (module: Module) => getModuleTag(module) },
    { title: '数据类型', dataIndex: 'dataType', width: 80, render: (dt: string) => <Tag>{dt}</Tag> },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: DictionaryStatus) => getStatusTag(status) },
    { title: '版本', dataIndex: 'version', width: 60 },
    { title: '选项数', dataIndex: 'options', width: 60, render: (options: any[]) => options ? options.length : '-' },
    { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('YYYY-MM-DD') },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditItem(record)}>编辑</Button>
        {record.status === DictionaryStatus.ACTIVE && (
          <Popconfirm title="确认废弃此字典项？" onConfirm={() => handleDeprecateItem(record.id)}>
            <Button type="link" size="small" danger icon={<WarningOutlined />}>废弃</Button>
          </Popconfirm>
        )}
      </Space>
    )},
  ]

  const versionColumns: ColumnsType<any> = [
    { title: '版本号', dataIndex: 'version', width: 80, render: (v: string) => <Tag color="blue">v{v}</Tag> },
    { title: '描述', dataIndex: 'description', width: 200, ellipsis: true },
    { title: '字典项数', dataIndex: 'itemCount', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={s === 'PUBLISHED' ? 'green' : 'default'}>{s}</Tag> },
    { title: '创建人', dataIndex: 'createdBy', width: 80 },
    { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('YYYY-MM-DD') },
    { title: '发布时间', dataIndex: 'publishedAt', width: 100, render: (time: Date) => time ? dayjs(time).format('YYYY-MM-DD') : '-' },
    { title: '操作', key: 'action', width: 100, render: (_, record) => (
      record.status === 'DRAFT' ? <Button type="link" size="small" icon={<CheckCircleOutlined />}>发布</Button> : null
    )},
  ]

  const referenceColumns: ColumnsType<any> = [
    { title: '字典编码', dataIndex: 'itemCode', width: 150, render: (code: string) => <Tag color="blue">{code}</Tag> },
    { title: '模块', dataIndex: 'module', width: 80, render: (module: Module) => getModuleTag(module) },
    { title: '实体类型', dataIndex: 'entityType', width: 100 },
    { title: '字段', dataIndex: 'entityField', width: 100 },
    { title: '引用类型', dataIndex: 'usageType', width: 100, render: (type: string) => <Tag color={type === 'REFERENCE' ? 'blue' : type === 'VALIDATION' ? 'orange' : 'green'}>{type}</Tag> },
    { title: '必填', dataIndex: 'required', width: 60, render: (req: boolean) => req ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'default' }} /> },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Popconfirm title="确认删除此引用？" onConfirm={() => message.success('引用已删除')}>
        <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
      </Popconfirm>
    )},
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <BookOutlined style={{ marginRight: 8 }} />
            数据字典
          </Title>
          <Text type="secondary">全局数据标准、枚举管理、字段定义、数据一致性保障</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<DownloadOutlined />} onClick={handleExport} style={{ marginRight: 8 }}>导出</Button>
          <Button icon={<UploadOutlined />} onClick={handleImport} style={{ marginRight: 8 }}>导入</Button>
          <Button icon={<PlusOutlined />} onClick={handleCreateItem}>新增字典项</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">字典项总数</Text>} value={stats.totalItems} prefix={<BookOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">生效字典项</Text>} value={stats.activeItems} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">废弃字典项</Text>} value={stats.deprecatedItems} prefix={<WarningOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">字典分类</Text>} value={stats.totalCategories} prefix={<ApartmentOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">字段引用</Text>} value={stats.totalReferences} prefix={<LinkOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
      </Row>

      {/* 字典列表 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="字典项列表" key="list">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="所属模块" style={{ width: 120 }} allowClear onChange={(v) => setSelectedModule(v)}>
                <Option value="COMMON">通用</Option>
                <Option value="CRM">CRM</Option>
                <Option value="ERP">ERP</Option>
                <Option value="FINANCE">财务</Option>
                <Option value="HR">HR</Option>
                <Option value="SERVICE">服务</Option>
                <Option value="CMS">CMS</Option>
                <Option value="WORKFLOW">流程</Option>
              </Select>
              <Select placeholder="字典类型" style={{ width: 120 }} allowClear onChange={(v) => setSelectedType(v)}>
                <Option value="STATUS">状态</Option>
                <Option value="TYPE">类型</Option>
                <Option value="PRIORITY">优先级</Option>
                <Option value="SEVERITY">严重程度</Option>
                <Option value="LEVEL">等级</Option>
                <Option value="FIELD">字段定义</Option>
                <Option value="CODE">编码规则</Option>
                <Option value="REGION">区域</Option>
                <Option value="INDUSTRY">行业</Option>
                <Option value="CURRENCY">货币</Option>
                <Option value="UNIT">单位</Option>
              </Select>
              <Select placeholder="状态" style={{ width: 100 }} allowClear onChange={(v) => setSelectedStatus(v)}>
                <Option value="DRAFT">草稿</Option>
                <Option value="ACTIVE">生效</Option>
                <Option value="DEPRECATED">已废弃</Option>
                <Option value="ARCHIVED">已归档</Option>
              </Select>
              <Input.Search placeholder="搜索编码/名称" style={{ width: 200 }} onSearch={setSearchKeyword} />
              <Button icon={<SyncOutlined />} onClick={fetchItems}>刷新</Button>
            </Space>
            <Table columns={itemColumns} dataSource={filteredItems} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
          </Card>
        </TabPane>

        <TabPane tab="分类管理" key="categories">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<PlusOutlined />}>新增分类</Button>
            </Space>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
              dataSource={categories}
              renderItem={item => (
                <List.Item>
                  <Card hoverable onClick={() => setSelectedCategory(item.code)}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">{item.code}</Text>
                      <Text>字典项: {item.itemCount} 个</Text>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane tab="版本管理" key="versions">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<PlusOutlined />}>创建新版本</Button>
            </Space>
            <Table columns={versionColumns} dataSource={versions} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="引用管理" key="references">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<PlusOutlined />}>新增引用</Button>
            </Space>
            <Table columns={referenceColumns} dataSource={references} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
      </Tabs>

      {/* 字典详情弹窗 */}
      <Modal
        title={<Space>{getTypeTag(selectedItem?.type)}{selectedItem?.name}</Space>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={<Button onClick={() => setDetailModalVisible(false)}>关闭</Button>}
        width={700}
      >
        {selectedItem && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="编码">{selectedItem.code}</Descriptions.Item>
              <Descriptions.Item label="名称">{selectedItem.name}</Descriptions.Item>
              <Descriptions.Item label="类型">{getTypeTag(selectedItem.type)}</Descriptions.Item>
              <Descriptions.Item label="模块">{getModuleTag(selectedItem.module)}</Descriptions.Item>
              <Descriptions.Item label="数据类型">{selectedItem.dataType}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedItem.status)}</Descriptions.Item>
              <Descriptions.Item label="版本">{selectedItem.version}</Descriptions.Item>
              <Descriptions.Item label="排序">{selectedItem.sortOrder}</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>{selectedItem.description}</Descriptions.Item>
              {selectedItem.minLength && <Descriptions.Item label="最小长度">{selectedItem.minLength}</Descriptions.Item>}
              {selectedItem.maxLength && <Descriptions.Item label="最大长度">{selectedItem.maxLength}</Descriptions.Item>}
              {selectedItem.minValue !== undefined && <Descriptions.Item label="最小值">{selectedItem.minValue}</Descriptions.Item>}
              {selectedItem.maxValue !== undefined && <Descriptions.Item label="最大值">{selectedItem.maxValue}</Descriptions.Item>}
              {selectedItem.pattern && <Descriptions.Item label="正则表达式" span={2}><Text copyable={{ text: selectedItem.pattern }}>{selectedItem.pattern}</Text></Descriptions.Item>}
              {selectedItem.required !== undefined && <Descriptions.Item label="是否必填">{selectedItem.required ? '是' : '否'}</Descriptions.Item>}
              {selectedItem.defaultValue !== undefined && <Descriptions.Item label="默认值">{selectedItem.defaultValue}</Descriptions.Item>}
            </Descriptions>

            {selectedItem.options && selectedItem.options.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>枚举选项</Title>
                <Table
                  dataSource={selectedItem.options}
                  rowKey="code"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: '编码', dataIndex: 'code', width: 100 },
                    { title: '名称', dataIndex: 'name', width: 100 },
                    { title: '值', dataIndex: 'value', width: 60 },
                    { title: '颜色', dataIndex: 'color', width: 60, render: (color: string) => color ? <Tag color={color}>{color}</Tag> : '-' },
                    { title: '描述', dataIndex: 'description', width: 150 },
                    { title: '排序', dataIndex: 'sortOrder', width: 60 },
                    { title: '启用', dataIndex: 'enabled', width: 60, render: (enabled: boolean) => enabled ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined /> },
                  ]}
                />
              </div>
            )}

            <Divider />
            <Text type="secondary">创建人: {selectedItem.createdBy} | 创建时间: {dayjs(selectedItem.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
            {selectedItem.deprecatedAt && <Text type="secondary"> | 废弃时间: {dayjs(selectedItem.deprecatedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>}
          </div>
        )}
      </Modal>

      {/* 编辑字典项弹窗 */}
      <Modal
        title={selectedItem ? '编辑字典项' : '新增字典项'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => { message.success(selectedItem ? '字典项已更新' : '字典项已创建'); setEditModalVisible(false) }}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="编码" required>
            <Input placeholder="如: STATUS_CUSTOMER" value={selectedItem?.code} />
          </Form.Item>
          <Form.Item label="名称" required>
            <Input placeholder="如: 客户状态" value={selectedItem?.name} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="类型">
                <Select placeholder="选择字典类型" value={selectedItem?.type}>
                  <Option value="STATUS">状态</Option>
                  <Option value="TYPE">类型</Option>
                  <Option value="PRIORITY">优先级</Option>
                  <Option value="LEVEL">等级</Option>
                  <Option value="FIELD">字段定义</Option>
                  <Option value="CODE">编码规则</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="模块">
                <Select placeholder="所属模块" value={selectedItem?.module}>
                  <Option value="COMMON">通用</Option>
                  <Option value="CRM">CRM</Option>
                  <Option value="ERP">ERP</Option>
                  <Option value="FINANCE">财务</Option>
                  <Option value="HR">HR</Option>
                  <Option value="SERVICE">服务</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述">
            <Input.TextArea placeholder="字典项描述" rows={2} value={selectedItem?.description} />
          </Form.Item>
          <Form.Item label="状态">
            <Radio.Group value={selectedItem?.status || 'DRAFT'}>
              <Radio value="DRAFT">草稿</Radio>
              <Radio value="ACTIVE">生效</Radio>
              <Radio value="DEPRECATED">废弃</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}