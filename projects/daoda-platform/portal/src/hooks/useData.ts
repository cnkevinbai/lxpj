/**
 * 通用数据请求 Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'

interface UseDataOptions<T> {
  fetchFn: () => Promise<T>
  deps?: any[]
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useData<T>(options: UseDataOptions<T>): UseDataResult<T> {
  const { fetchFn, deps = [], immediate = true, onSuccess, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      onError?.(error)
      message.error(error.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }, [fetchFn, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [...deps, immediate, fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * 分页数据请求 Hook
 */
interface UsePaginationOptions<T, P> {
  fetchFn: (params: P & { page: number; pageSize: number }) => Promise<{ list: T[]; total: number }>
  defaultParams?: Partial<P>
  defaultPageSize?: number
}

interface UsePaginationResult<T, P> {
  data: T[]
  total: number
  loading: boolean
  page: number
  pageSize: number
  params: Partial<P>
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setParams: (params: Partial<P>) => void
  refresh: () => void
}

export function usePagination<T, P extends Record<string, any>>(
  options: UsePaginationOptions<T, P>
): UsePaginationResult<T, P> {
  const { fetchFn, defaultParams = {}, defaultPageSize = 10 } = options
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [params, setParams] = useState<Partial<P>>(defaultParams)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchFn({ ...params, page, pageSize } as P & { page: number; pageSize: number })
      setData(result.list || [])
      setTotal(result.total || 0)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      message.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }, [fetchFn, params, page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => {
    setPage(1)
    fetchData()
  }, [fetchData])

  return {
    data,
    total,
    loading,
    page,
    pageSize,
    params,
    setPage,
    setPageSize,
    setParams: (newParams: Partial<P>) => {
      setParams(prev => ({ ...prev, ...newParams }))
      setPage(1)
    },
    refresh,
  }
}

/**
 * 表单提交 Hook
 */
interface UseSubmitOptions<T, R> {
  submitFn: (data: T) => Promise<R>
  onSuccess?: (result: R) => void
  onError?: (error: Error) => void
  successMessage?: string
}

interface UseSubmitResult<T, R> {
  submit: (data: T) => Promise<R | null>
  submitting: boolean
}

export function useSubmit<T, R>(options: UseSubmitOptions<T, R>): UseSubmitResult<T, R> {
  const { submitFn, onSuccess, onError, successMessage = '操作成功' } = options
  const [submitting, setSubmitting] = useState(false)

  const submit = useCallback(async (data: T): Promise<R | null> => {
    setSubmitting(true)
    try {
      const result = await submitFn(data)
      message.success(successMessage)
      onSuccess?.(result)
      return result
    } catch (error) {
      const err = error as Error
      onError?.(err)
      message.error(err.message || '操作失败')
      return null
    } finally {
      setSubmitting(false)
    }
  }, [submitFn, onSuccess, onError, successMessage])

  return { submit, submitting }
}

/**
 * 模态框 Hook
 */
export function useModal<T = void>() {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((data?: T) => {
    setData(data ?? null)
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    setData(null)
  }, [])

  return { visible, data, open, close }
}

/**
 * 搜索防抖 Hook
 */
export function useDebounce(value: string, delay: number = 300): string {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}