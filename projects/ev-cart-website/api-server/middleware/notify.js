/**
 * 通知中间件 - 发送短信/邮件/站内通知
 */

// 模拟发送通知 (实际项目中应集成短信/邮件服务)
const sendNotification = async (options) => {
  const { to, type, message } = options

  console.log(`📬 发送${type}通知到 ${to}: ${message}`)

  // TODO: 集成实际的通知服务
  // - 短信：阿里云短信/腾讯云短信
  // - 邮件：Nodemailer/SendGrid
  // - 站内：WebSocket 推送

  return {
    success: true,
    messageId: `MSG${Date.now()}`,
  }
}

// 发送审核结果通知
const sendApprovalNotification = async (application) => {
  if (application.status === 'approved') {
    await sendNotification({
      to: application.phone,
      type: 'sms',
      message: `【道达智能】您的加盟申请 (${application.applicationNo}) 已通过审核，请联系招商经理签约。电话：400-888-9999`,
    })
  } else if (application.status === 'rejected') {
    await sendNotification({
      to: application.phone,
      type: 'sms',
      message: `【道达智能】您的加盟申请 (${application.applicationNo}) 未通过审核，详情请联系客服。电话：400-888-8888`,
    })
  }
}

module.exports = {
  sendNotification,
  sendApprovalNotification,
}
