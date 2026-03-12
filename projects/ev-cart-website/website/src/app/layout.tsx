export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="四川道达智能车辆制造有限公司 - 专业电动车制造企业，数字化管理系统" />
        <meta name="keywords" content="电动车，CRM,ERP，数字化管理，四川道达智能" />
        <title>四川道达智能车辆制造有限公司</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
