import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders login page by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    // 应该重定向到登录页
    expect(window.location.pathname).toBe('/crm/login')
  })
})
