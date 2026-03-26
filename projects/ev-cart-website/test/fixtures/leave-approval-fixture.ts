/**
 * 请假审批测试数据修复
 * 
 * 问题：没有待审批的请假单
 * 原因：测试数据准备不完善
 * 修复：自动创建测试数据 + 完善测试流程
 */

export class LeaveApprovalTestFix {
  
  /**
   * 准备测试数据
   */
  async prepareTestData() {
    console.log('准备请假审批测试数据...');
    
    // 1. 创建测试员工
    const employee = await this.createTestEmployee();
    console.log(`创建测试员工：${employee.name}`);
    
    // 2. 创建请假单
    const leave = await this.createLeaveRequest(employee.id);
    console.log(`创建请假单：${leave.id}`);
    
    // 3. 验证数据
    const pendingLeaves = await this.getPendingLeaves();
    console.log(`待审批请假单：${pendingLeaves.length}个`);
    
    return { employee, leave };
  }
  
  /**
   * 创建测试员工
   */
  async createTestEmployee() {
    const response = await fetch('/api/hr/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '测试员工',
        email: `test_${Date.now()}@test.com`,
        phone: '13800138000',
        department: '技术部',
        status: 'ACTIVE',
      }),
    });
    
    return await response.json();
  }
  
  /**
   * 创建请假单
   */
  async createLeaveRequest(employeeId: string) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const response = await fetch('/api/hr/leaves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        type: '年假',
        startDate: today.toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0],
        reason: '测试请假审批',
        status: 'PENDING',
      }),
    });
    
    return await response.json();
  }
  
  /**
   * 获取待审批请假单
   */
  async getPendingLeaves() {
    const response = await fetch('/api/hr/leaves?status=PENDING');
    const data = await response.json();
    return data.data || [];
  }
  
  /**
   * 清理测试数据
   */
  async cleanupTestData(employeeId: string, leaveId: string) {
    console.log('清理测试数据...');
    
    // 删除请假单
    await fetch(`/api/hr/leaves/${leaveId}`, { method: 'DELETE' });
    
    // 删除员工
    await fetch(`/api/hr/employees/${employeeId}`, { method: 'DELETE' });
    
    console.log('测试数据已清理');
  }
}

// 运行修复
(async () => {
  const fixer = new LeaveApprovalTestFix();
  const { employee, leave } = await fixer.prepareTestData();
  
  console.log('✅ 请假审批测试数据准备完成');
  console.log(`员工 ID: ${employee.id}`);
  console.log(`请假单 ID: ${leave.id}`);
  
  // 测试完成后清理
  // await fixer.cleanupTestData(employee.id, leave.id);
})();
