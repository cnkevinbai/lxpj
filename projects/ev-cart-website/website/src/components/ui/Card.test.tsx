import { render, screen } from '@testing-library/react'
import Card, { CardHeader, CardContent, CardFooter } from './Card'

describe('Card Component', () => {
  test('renders card with children', () => {
    render(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  test('renders different variants', () => {
    const { container: default: defaultCard } = render(<Card variant="default">Default</Card>)
    const { container: elevated } = render(<Card variant="elevated">Elevated</Card>)
    const { container: outlined } = render(<Card variant="outlined">Outlined</Card>)
    
    expect(defaultCard.querySelector('div')).toHaveClass('shadow-sm')
    expect(elevated.querySelector('div')).toHaveClass('shadow-md')
    expect(outlined.querySelector('div')).toHaveClass('border-2')
  })

  test('renders different sizes', () => {
    const { container: sm } = render(<Card size="sm">Small</Card>)
    const { container: md } = render(<Card size="md">Medium</Card>)
    const { container: lg } = render(<Card size="lg">Large</Card>)
    
    expect(sm.querySelector('div')).toHaveClass('p-4')
    expect(md.querySelector('div')).toHaveClass('p-6')
    expect(lg.querySelector('div')).toHaveClass('p-8')
  })

  test('renders clickable card', () => {
    render(<Card clickable>Clickable</Card>)
    expect(screen.getByText('Clickable')).toHaveClass('cursor-pointer')
  })

  test('renders CardHeader', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  test('renders CardContent', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  test('renders CardFooter', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  test('renders complete card structure', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
