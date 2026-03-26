import React, { useState, useEffect } from 'react'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { message } from 'antd'

interface FavoritesProps {
  type: string
  id: string
  size?: 'small' | 'default' | 'large'
}

/**
 * 收藏组件
 * 支持收藏常用客户、产品等
 */
const Favorites: React.FC<FavoritesProps> = ({
  type,
  id,
  size = 'default',
}) => {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // 从本地存储加载收藏状态
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}')
    const key = `${type}:${id}`
    setIsFavorite(!!favorites[key])
  }, [type, id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}')
    const key = `${type}:${id}`

    if (isFavorite) {
      delete favorites[key]
      message.success('已取消收藏')
    } else {
      favorites[key] = { type, id, createdAt: new Date().toISOString() }
      message.success('已加入收藏')
    }

    localStorage.setItem('favorites', JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
  }

  const sizeMap = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
  }

  return (
    <span
      className={`cursor-pointer transition-colors ${
        isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
      } ${sizeMap[size]}`}
      onClick={toggleFavorite}
    >
      {isFavorite ? <StarFilled /> : <StarOutlined />}
    </span>
  )
}

export default Favorites
