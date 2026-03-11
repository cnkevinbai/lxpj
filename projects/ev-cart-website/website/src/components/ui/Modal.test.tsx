import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal Content</div>,
  }

  test('renders modal when isOpen is true', () => {
    render(<Modal {...defaultProps} title="Test Modal" />)
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('does not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} title="Test Modal" />)
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn()
    render(<Modal {...defaultProps} onClose={handleClose} showClose />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when overlay is clicked', () => {
    const handleClose = jest.fn()
    render(<Modal {...defaultProps} onClose={handleClose} closeOnOverlay />)
    fireEvent.click(screen.getByRole('dialog').parentElement!)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('does not call onClose when overlay is clicked and closeOnOverlay is false', () => {
    const handleClose = jest.fn()
    render(<Modal {...defaultProps} onClose={handleClose} closeOnOverlay={false} />)
    fireEvent.click(screen.getByRole('dialog').parentElement!)
    expect(handleClose).not.toHaveBeenCalled()
  })

  test('renders with different sizes', () => {
    const { container: sm } = render(<Modal {...defaultProps} size="sm" />)
    const { container: md } = render(<Modal {...defaultProps} size="md" />)
    const { container: lg } = render(<Modal {...defaultProps} size="lg" />)
    
    expect(sm.querySelector('div')).toHaveClass('max-w-md')
    expect(md.querySelector('div')).toHaveClass('max-w-lg')
    expect(lg.querySelector('div')).toHaveClass('max-w-2xl')
  })

  test('renders footer when provided', () => {
    render(
      <Modal {...defaultProps} footer={<button>Submit</button>} />
    )
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  test('hides close button when showClose is false', () => {
    render(<Modal {...defaultProps} showClose={false} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
