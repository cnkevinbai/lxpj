import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const tableVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: 'border-collapse',
        striped: 'border-collapse',
        hover: 'border-collapse',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface TableProps extends VariantProps<typeof tableVariants> {
  children: ReactNode
  className?: string
}

export interface Column<T> {
  key: string
  title: string
  dataIndex: keyof T
  render?: (value: any, record: T) => ReactNode
  sortable?: boolean
}

export interface TableDataProps<T> extends TableProps {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (record: T) => void
}

export function Table<T>({ children, className = '', variant, size }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={tableVariants({ variant, size, className })}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      {children}
    </thead>
  )
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ 
  children, 
  onClick,
  className = '' 
}: { 
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <tr 
      onClick={onClick}
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${className}`}
    >
      {children}
    </tr>
  )
}

export function TableHeader({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-gray-900 ${className}`}>
      {children}
    </td>
  )
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  variant,
  size,
}: TableDataProps<T>) {
  return (
    <Table variant={variant} size={size}>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableHeader key={column.key}>{column.title}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow 
            key={rowIndex}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render 
                  ? column.render(row[column.dataIndex], row)
                  : String(row[column.dataIndex])
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default Table
