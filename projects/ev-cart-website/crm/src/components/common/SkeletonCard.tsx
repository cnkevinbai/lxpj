import { Skeleton, Card } from 'antd'

interface SkeletonCardProps {
  count?: number
  active?: boolean
}

export default function SkeletonCard({ count = 4, active = true }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} style={{ marginBottom: 16 }}>
          <Skeleton
            active={active}
            avatar
            paragraph={{ rows: 3 }}
          />
        </Card>
      ))}
    </>
  )
}
