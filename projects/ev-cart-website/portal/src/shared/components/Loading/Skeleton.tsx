import { Skeleton as AntSkeleton } from 'antd'

interface SkeletonProps {
  type?: 'text' | 'paragraph' | 'image' | 'table' | 'card'
  count?: number
}

export default function Skeleton({ type = 'text', count = 1 }: SkeletonProps) {
  if (type === 'table') {
    return (
      <div style={{ padding: 16 }}>
        {Array.from({ length: count }).map((_, i) => (
          <AntSkeleton key={i} active paragraph={{ rows: 1 }} style={{ marginBottom: 16 }} />
        ))}
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div style={{ padding: 16 }}>
        <AntSkeleton.Image active style={{ width: '100%', height: 200 }} />
        <AntSkeleton active paragraph={{ rows: 3 }} style={{ marginTop: 16 }} />
      </div>
    )
  }

  return (
    <AntSkeleton
      active
      paragraph={type === 'paragraph' ? { rows: count } : false}
    />
  )
}
