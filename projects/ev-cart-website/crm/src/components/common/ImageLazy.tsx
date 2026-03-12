import React, { useState, useEffect, useRef } from 'react'

interface ImageLazyProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

/**
 * 图片懒加载组件
 */
const ImageLazy: React.FC<ImageLazyProps> = ({
  src,
  alt,
  className = '',
  placeholder = '/images/placeholder.png',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '50px' },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [])

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
    />
  )
}

export default ImageLazy
