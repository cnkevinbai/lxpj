import React, { useEffect, useRef } from 'react'

interface WatermarkProps {
  text: string
  visible?: boolean
  opacity?: number
  rotate?: number
  spacing?: number
  fontSize?: number
  color?: string
}

/**
 * 屏幕水印组件 - 防止截图泄露
 */
export const Watermark: React.FC<WatermarkProps> = ({
  text,
  visible = true,
  opacity = 0.1,
  rotate = -30,
  spacing = 200,
  fontSize = 16,
  color = '#000000',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!visible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 300
    const height = 300

    canvas.width = width
    canvas.height = height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 设置样式
    ctx.fillStyle = color
    ctx.globalAlpha = opacity
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 旋转并绘制文字
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.fillText(text, 0, 0)
    ctx.restore()

    // 添加时间戳
    const timestamp = new Date().toLocaleString('zh-CN')
    ctx.save()
    ctx.translate(width / 2, height / 2 + 20)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.font = `${fontSize - 4}px sans-serif`
    ctx.fillText(timestamp, 0, 0)
    ctx.restore()
  }, [text, visible, opacity, rotate, spacing, fontSize, color])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundImage: `url(${canvasRef.current?.toDataURL()})`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

/**
 * 水印 Hook - 获取当前用户水印信息
 */
export const useWatermark = () => {
  const getUserWatermarkText = (user?: { name?: string; email?: string }) => {
    if (!user) return ''
    return `${user.name} (${user.email})`
  }

  return { getUserWatermarkText }
}
