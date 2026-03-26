import { Routes, Route } from 'react-router-dom'

const FinanceHome = () => (
  <div style={{ padding: '24px' }}>
    <h1>财务管理系统</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>💰 应收管理</h3>
        <p>应收账款、回款、账龄分析</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>💳 应付管理</h3>
        <p>应付账款、付款、对账</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📝 费用报销</h3>
        <p>费用申请、审批、报销</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📊 资金管理</h3>
        <p>资金流水、现金流</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📈 预算管理</h3>
        <p>预算编制、执行、分析</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>🏦 资产管理</h3>
        <p>固定资产、折旧</p>
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

const FinanceModule = () => {
  return (
    <Routes>
      <Route index element={<FinanceHome />} />
      <Route path="receivables" element={<Placeholder title="应收管理" />} />
      <Route path="payables" element={<Placeholder title="应付管理" />} />
      <Route path="expenses" element={<Placeholder title="费用报销" />} />
      <Route path="funds" element={<Placeholder title="资金管理" />} />
      <Route path="budget" element={<Placeholder title="预算管理" />} />
      <Route path="assets" element={<Placeholder title="资产管理" />} />
    </Routes>
  )
}

export default FinanceModule
