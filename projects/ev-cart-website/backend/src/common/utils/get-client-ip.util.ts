/**
 * 获取客户端真实 IP 地址
 */
export function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    // x-forwarded-for 可能包含多个 IP，取第一个
    const ips = forwarded.split(',')
    return ips[0].trim()
  }

  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip']
  }

  if (req.ip) {
    // IPv6 映射到 IPv4
    return req.ip.replace(/^::ffff:/, '')
  }

  if (req.connection?.remoteAddress) {
    return req.connection.remoteAddress.replace(/^::ffff:/, '')
  }

  if (req.socket?.remoteAddress) {
    return req.socket.remoteAddress.replace(/^::ffff:/, '')
  }

  return '127.0.0.1'
}
