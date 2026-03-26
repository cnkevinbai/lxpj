import { Routes, Route } from 'react-router-dom'

const HRHome = () => (
  <div style={{ padding: '24px' }}>
    <h1>人力资源系统</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>👥 员工档案</h3>
        <p>员工信息、合同</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📝 招聘管理</h3>
        <p>职位、简历、面试</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>⏰ 考勤管理</h3>
        <p>打卡、请假、加班</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📊 绩效管理</h3>
        <p>考核、评估</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>🎓 培训管理</h3>
        <p>培训计划、效果</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>💰 薪酬管理</h3>
        <p>薪资核算、发放</p>
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

const HRModule = () => {
  return (
    <Routes>
      <Route index element={<HRHome />} />
      <Route path="employees" element={<Placeholder title="员工档案" />} />
      <Route path="recruitment" element={<Placeholder title="招聘管理" />} />
      <Route path="attendance" element={<Placeholder title="考勤管理" />} />
      <Route path="performance" element={<Placeholder title="绩效管理" />} />
      <Route path="training" element={<Placeholder title="培训管理" />} />
      <Route path="salary" element={<Placeholder title="薪酬管理" />} />
    </Routes>
  )
}

export default HRModule
