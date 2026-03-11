import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/四川道达智能/)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=引领绿色出行新时代')).toBeVisible()
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=产品中心')
    await expect(page).toHaveURL(/\/products/)
  })

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=联系我们')
    await expect(page).toHaveURL(/\/contact/)
  })

  test('should submit inquiry form', async ({ page }) => {
    await page.goto('/inquiry')
    await page.fill('input[name="name"]', '测试用户')
    await page.fill('input[name="phone"]', '13800138000')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=提交成功')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.locator('text=引领绿色出行新时代')).toBeVisible()
  })
})
