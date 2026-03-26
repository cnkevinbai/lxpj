/**
 * 实时地图
 */
import { useEffect, useRef, useState } from 'react'
import { Card, Typography, List, Tag, Select } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const { Title, Text } = Typography

// 模拟终端位置数据
const mockTerminals = [
  { id: '1', terminalId: '13800001111', vehicleNo: '川A12345', lat: 30.123456, lng: 103.845678, status: 'online' },
  { id: '2', terminalId: '13800002222', vehicleNo: '川B67890', lat: 30.234567, lng: 103.956789, status: 'online' },
  { id: '3', terminalId: '13800003333', vehicleNo: '川C11111', lat: 30.345678, lng: 104.067890, status: 'sleep' },
  { id: '4', terminalId: '13800004444', vehicleNo: '川D22222', lat: 30.456789, lng: 104.178901, status: 'offline' },
  { id: '5', terminalId: '13800005555', vehicleNo: '川E33333', lat: 30.567890, lng: 104.289012, status: 'online' },
]

export default function Map() {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [selectedTerminal, setSelectedTerminal] = useState<typeof mockTerminals[0] | null>(null)
  
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    
    // 创建地图实例
    mapRef.current = L.map(mapContainerRef.current).setView([30.123456, 103.845678], 11)
    
    // 添加图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current)
    
    // 添加终端标记
    mockTerminals.forEach(terminal => {
      const color = terminal.status === 'online' ? '#52c41a' : terminal.status === 'sleep' ? '#faad14' : '#ff4d4f'
      
      const marker = L.circleMarker([terminal.lat, terminal.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(mapRef.current!)
      
      marker.bindPopup(`
        <div style="min-width: 150px;">
          <strong>终端号:</strong> ${terminal.terminalId}<br/>
          <strong>车牌号:</strong> ${terminal.vehicleNo}<br/>
          <strong>状态:</strong> ${terminal.status === 'online' ? '在线' : terminal.status === 'sleep' ? '休眠' : '离线'}
        </div>
      `)
    })
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])
  
  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 200px)' }}>
      {/* 地图区域 */}
      <Card className="daoda-card" style={{ flex: 1 }} bodyStyle={{ padding: 0, height: '100%' }}>
        <div ref={mapContainerRef} style={{ height: '100%', minHeight: 400 }} />
      </Card>
      
      {/* 终端列表 */}
      <Card className="daoda-card" style={{ width: 300 }} title="终端列表">
        <Select placeholder="筛选状态" style={{ width: '100%', marginBottom: 16 }} allowClear>
          <Select.Option value="online">在线</Select.Option>
          <Select.Option value="sleep">休眠</Select.Option>
          <Select.Option value="offline">离线</Select.Option>
        </Select>
        
        <List
          dataSource={mockTerminals}
          renderItem={item => (
            <List.Item 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                mapRef.current?.setView([item.lat, item.lng], 14)
                setSelectedTerminal(item)
              }}
            >
              <List.Item.Meta
                title={
                  <span>
                    {item.vehicleNo} 
                    <Tag 
                      color={item.status === 'online' ? 'success' : item.status === 'sleep' ? 'warning' : 'error'}
                      style={{ marginLeft: 8 }}
                    >
                      {item.status === 'online' ? '在线' : item.status === 'sleep' ? '休眠' : '离线'}
                    </Tag>
                  </span>
                }
                description={item.terminalId}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}