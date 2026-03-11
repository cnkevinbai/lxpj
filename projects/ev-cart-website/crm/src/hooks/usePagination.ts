import { useState, useCallback } from 'react'

interface PaginationConfig {
  page?: number
  pageSize?: number
  total?: number
}

/**
 * 分页 Hook
 */
export function usePagination(config: PaginationConfig = {}) {
  const [page, setPage] = useState(config.page || 1)
  const [pageSize, setPageSize] = useState(config.pageSize || 20)
  const [total, setTotal] = useState(config.total || 0)

  const pagination = {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      setPage(page)
      setPageSize(pageSize)
    },
    onShowSizeChange: (current: number, size: number) => {
      setPage(current)
      setPageSize(size)
    },
  }

  const setPageConfig = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const setPageSizeConfig = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }, [])

  const setTotalConfig = useCallback((newTotal: number) => {
    setTotal(newTotal)
  }, [])

  const reset = useCallback(() => {
    setPage(1)
    setPageSize(config.pageSize || 20)
    setTotal(config.total || 0)
  }, [config.pageSize, config.total])

  return {
    page,
    pageSize,
    total,
    pagination,
    setPage: setPageConfig,
    setPageSize: setPageSizeConfig,
    setTotal: setTotalConfig,
    reset,
  }
}
