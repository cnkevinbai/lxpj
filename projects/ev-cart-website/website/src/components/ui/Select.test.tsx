import { render, screen, fireEvent } from '@testing-library/react'
import Select from './Select'

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  test('renders select with label', () => {
    render(<Select label="Choose" options={options} />)
    expect(screen.getByLabelText('Choose')).toBeInTheDocument()
  })

  test('renders options', () => {
    render(<Select options={options} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  test('handles change event', () => {
    const handleChange = jest.fn()
    render(<Select options={options} onChange={handleChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'option2' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test('renders error state', () => {
    render(<Select options={options} error="Please select an option" />)
    expect(screen.getByText('Please select an option')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveClass('border-red-500')
  })

  test('renders disabled state', () => {
    render(<Select options={options} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  test('renders different sizes', () => {
    const { container: sm } = render(<Select options={options} size="sm" />)
    const { container: md } = render(<Select options={options} size="md" />)
    const { container: lg } = render(<Select options={options} size="lg" />)
    
    expect(sm.querySelector('select')).toHaveClass('min-h-[36px]')
    expect(md.querySelector('select')).toHaveClass('min-h-[40px]')
    expect(lg.querySelector('select')).toHaveClass('min-h-[44px]')
  })

  test('renders with default value', () => {
    render(<Select options={options} defaultValue="option2" />)
    expect(screen.getByRole('combobox')).toHaveValue('option2')
  })
})
