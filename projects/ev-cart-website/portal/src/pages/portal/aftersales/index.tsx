import { Routes, Route } from 'react-router-dom'

const AftersalesHome = () => (
  <div style={{ padding: '24px' }}>
    <h1>售后服务系统</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>🎫 服务工单</h3>
        <p>工单创建、分配、处理</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📊 服务进度</h3>
        <p>全流程跟踪</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>⭐ 服务评价</h3>
        <p>客户满意度</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>🔧 配件管理</h3>
        <p>配件库存、领用</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📚 知识库</h3>
        <p>技术文档、FAQ</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📈 服务统计</h3>
        <p>数据分析、报表</p>
      </div>
    </div>
  </div>
)

const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: '24px' }}>
    <h1>{title}</h1>
    <p>功能开发中...</p>
  </div>
)

const AftersalesModule = () => {
  return (
    <Routes>
      <Route index element={<AftersalesHome />} />
      <Route path="tickets" element={<Placeholder title="服务工单" />} />
      <Route path="progress" element={<Placeholder title="服务进度" />} />
      <Route path="reviews" element={<Placeholder title="服务评价" />} />
      <Route path="parts" element={<Placeholder title="配件管理" />} />
      <Route path="knowledge" element={<Placeholder title="知识库" />} />
      <Route path="analytics" element={<Placeholder title="服务统计" />} />
    </Routes>
  )
}

export default AftersalesModule
