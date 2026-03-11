import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  test('handles click event', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('renders different variants', () => {
    const { container: primary } = render(<Button variant="primary">Primary</Button>)
    const { container: secondary } = render(<Button variant="secondary">Secondary</Button>)
    const { container: outline } = render(<Button variant="outline">Outline</Button>)
    
    expect(primary.querySelector('button')).toHaveClass('bg-brand-blue')
    expect(secondary.querySelector('button')).toHaveClass('bg-gray-100')
    expect(outline.querySelector('button')).toHaveClass('border-brand-blue')
  })

  test('renders different sizes', () => {
    const { container: sm } = render(<Button size="sm">Small</Button>)
    const { container: md } = render(<Button size="md">Medium</Button>)
    const { container: lg } = render(<Button size="lg">Large</Button>)
    
    expect(sm.querySelector('button')).toHaveClass('min-h-[36px]')
    expect(md.querySelector('button')).toHaveClass('min-h-[40px]')
    expect(lg.querySelector('button')).toHaveClass('min-h-[44px]')
  })

  test('renders loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('renders with icons', () => {
    render(
      <Button leftIcon={<span>👍</span>} rightIcon={<span>👍</span>}>
        With Icons
      </Button>
    )
    expect(screen.getByText('👍')).toBeInTheDocument()
  })

  test('renders full width', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>)
    expect(container.querySelector('button')).toHaveClass('w-full')
  })
})
