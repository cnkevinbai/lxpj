import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input'

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Username" />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  test('handles change event', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test('renders error state', () => {
    render(<Input error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500')
  })

  test('renders success state', () => {
    render(<Input success="Valid email" />)
    expect(screen.getByText('Valid email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-green-500')
  })

  test('renders disabled state', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  test('renders with left icon', () => {
    render(<Input leftIcon={<span>🔍</span>} />)
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  test('renders with right icon', () => {
    render(<Input rightIcon={<span>👁️</span>} />)
    expect(screen.getByText('👁️')).toBeInTheDocument()
  })

  test('renders different sizes', () => {
    const { container: sm } = render(<Input size="sm" />)
    const { container: md } = render(<Input size="md" />)
    const { container: lg } = render(<Input size="lg" />)
    
    expect(sm.querySelector('input')).toHaveClass('min-h-[36px]')
    expect(md.querySelector('input')).toHaveClass('min-h-[40px]')
    expect(lg.querySelector('input')).toHaveClass('min-h-[44px]')
  })

  test('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  test('renders required field', () => {
    render(<Input label="Email" required />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('required')
  })
})
