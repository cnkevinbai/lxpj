import { Skeleton, Table } from 'antd'

interface SkeletonTableProps {
  rows?: number
  active?: boolean
}

export default function SkeletonTable({ rows = 10, active = true }: SkeletonTableProps) {
  return (
    <Table
      dataSource={Array.from({ length: rows })}
      rowKey={(_, index) => index.toString()}
      loading={false}
      pagination={false}
      columns={[
        {
          key: 'skeleton',
          render: () => (
            <Skeleton
              active={active}
              avatar={false}
              paragraph={{ rows: 1 }}
            />
          ),
        },
      ]}
    />
  )
}
