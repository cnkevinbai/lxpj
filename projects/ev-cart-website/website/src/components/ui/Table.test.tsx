import { render, screen, fireEvent } from '@testing-library/react'
import Table, { TableHead, TableBody, TableRow, TableHeader, TableCell, DataTable } from './Table'

describe('Table Component', () => {
  test('renders table with children', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  test('renders with different sizes', () => {
    const { container: sm } = render(
      <Table size="sm">
        <TableBody><TableRow><TableCell>Content</TableCell></TableRow></TableBody>
      </Table>
    )
    const { container: md } = render(
      <Table size="md">
        <TableBody><TableRow><TableCell>Content</TableCell></TableRow></TableBody>
      </Table>
    )
    const { container: lg } = render(
      <Table size="lg">
        <TableBody><TableRow><TableCell>Content</TableCell></TableRow></TableBody>
      </Table>
    )
    
    expect(sm.querySelector('table')).toHaveClass('text-sm')
    expect(md.querySelector('table')).toHaveClass('text-base')
    expect(lg.querySelector('table')).toHaveClass('text-lg')
  })

  test('handles row click', () => {
    const handleClick = jest.fn()
    render(
      <Table>
        <TableBody>
          <TableRow onClick={handleClick}>
            <TableCell>Click Me</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe('DataTable Component', () => {
  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
  ]

  const data = [
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' },
  ]

  test('renders data table with columns and data', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })

  test('handles row click', () => {
    const handleRowClick = jest.fn()
    render(<DataTable columns={columns} data={data} onRowClick={handleRowClick} />)
    fireEvent.click(screen.getByText('John'))
    expect(handleRowClick).toHaveBeenCalledWith(data[0])
  })

  test('renders custom cell content', () => {
    const customColumns = [
      { 
        key: 'name', 
        title: 'Name', 
        dataIndex: 'name',
        render: (value: string) => <strong>{value}</strong>,
      },
    ]
    render(<DataTable columns={customColumns} data={data} />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })
})
