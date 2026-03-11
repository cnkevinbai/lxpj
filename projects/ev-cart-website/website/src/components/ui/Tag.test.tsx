import { render, screen, fireEvent } from '@testing-library/react'
import Tag from './Tag'

describe('Tag Component', () => {
  test('renders tag with children', () => {
    render(<Tag>Test Tag</Tag>)
    expect(screen.getByText('Test Tag')).toBeInTheDocument()
  })

  test('renders different variants', () => {
    const { container: default: defaultTag } = render(<Tag variant="default">Default</Tag>)
    const { container: primary } = render(<Tag variant="primary">Primary</Tag>)
    const { container: success } = render(<Tag variant="success">Success</Tag>)
    const { container: warning } = render(<Tag variant="warning">Warning</Tag>)
    const { container: error } = render(<Tag variant="error">Error</Tag>)
    
    expect(defaultTag.querySelector('span')).toHaveClass('bg-gray-100')
    expect(primary.querySelector('span')).toHaveClass('bg-brand-blue/10')
    expect(success.querySelector('span')).toHaveClass('bg-green-100')
    expect(warning.querySelector('span')).toHaveClass('bg-yellow-100')
    expect(error.querySelector('span')).toHaveClass('bg-red-100')
  })

  test('renders different sizes', () => {
    const { container: sm } = render(<Tag size="sm">Small</Tag>)
    const { container: md } = render(<Tag size="md">Medium</Tag>)
    const { container: lg } = render(<Tag size="lg">Large</Tag>)
    
    expect(sm.querySelector('span')).toHaveClass('text-xs')
    expect(md.querySelector('span')).toHaveClass('text-sm')
    expect(lg.querySelector('span')).toHaveClass('text-base')
  })

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn()
    render(<Tag onClose={handleClose}>Closable Tag</Tag>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('does not render close button when onClose is not provided', () => {
    render(<Tag>No Close</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
