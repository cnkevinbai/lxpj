/**
 * 图片懒加载组件
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect, useRef } from 'react'

interface ImageLazyLoadProps {
  src: string
  alt?: string
  placeholder?: string
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export default function ImageLazyLoad({
  src,
  alt = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNjY2MiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nPC90ZXh0Pjwvc3ZnPg==',
  width,
  height,
  style,
  onLoad,
  onError
}: ImageLazyLoadProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      imgRef.current.dataset.src = src
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    onError?.()
  }

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {!loaded && !error && (
        <img
          src={placeholder}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute'
          }}
        />
      )}

      {error ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#999'
        }}>
          加载失败
        </div>
      ) : (
        <img
          ref={imgRef}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />
      )}
    </div>
  )
}
