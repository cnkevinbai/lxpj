import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['zh-CN', 'en', 'zh-TW']
const defaultLocale = 'zh-CN'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否是静态资源
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 检查路径中是否已有 locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // 获取用户语言偏好
  const locale =
    request.cookies.get('NEXT_LOCALE')?.value ||
    request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] ||
    defaultLocale

  // 重定向到带 locale 的路径
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
