/**
 * 数据分析图表组件
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';

// 图表数据类型
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

// 简易柱状图
export function BarChart({ 
  data, 
  height = 200,
  showLabels = true,
}: { 
  data: ChartData; 
  height?: number;
  showLabels?: boolean;
}) {
  const maxValue = useMemo(() => {
    return Math.max(...data.datasets.flatMap(d => d.data));
  }, [data]);

  return (
    <div className="relative" style={{ height }}>
      {/* Y 轴标签 */}
      {showLabels && (
        <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-slate-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>
      )}

      {/* 图表区域 */}
      <div className={`flex items-end justify-around h-full ${showLabels ? 'ml-12' : ''}`}>
        {data.labels.map((label, index) => (
          <div key={label} className="flex flex-col items-center gap-2">
            {/* 柱状 */}
            <div className="flex items-end gap-1 h-full">
              {data.datasets.map((dataset, datasetIndex) => {
                const value = dataset.data[index] || 0;
                const percentage = (value / maxValue) * 100;
                
                return (
                  <motion.div
                    key={datasetIndex}
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ delay: index * 0.05 + datasetIndex * 0.1, duration: 0.5 }}
                    className="w-4 rounded-t"
                    style={{ backgroundColor: dataset.color }}
                    title={`${dataset.label}: ${value}`}
                  />
                );
              })}
            </div>
            
            {/* X 轴标签 */}
            {showLabels && (
              <span className="text-xs text-slate-400 truncate max-w-[60px]">{label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 简易折线图
export function LineChart({ 
  data, 
  height = 200,
}: { 
  data: ChartData; 
  height?: number;
}) {
  const maxValue = useMemo(() => {
    return Math.max(...data.datasets.flatMap(d => d.data));
  }, [data]);

  const points = useMemo(() => {
    return data.datasets.map((dataset) => {
      const points = dataset.data.map((value, index) => {
        const x = (index / (data.labels.length - 1)) * 100;
        const y = 100 - (value / maxValue) * 100;
        return `${x},${y}`;
      });
      return points.join(' ');
    });
  }, [data, maxValue]);

  return (
    <div className="relative" style={{ height }}>
      {/* Y 轴标签 */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-slate-500 py-2">
        <span>{maxValue}</span>
        <span>{Math.round(maxValue / 2)}</span>
        <span>0</span>
      </div>

      {/* 图表区域 */}
      <div className="ml-12 h-full relative">
        {/* 网格线 */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border-t border-white/5" />
          ))}
        </div>

        {/* 折线 */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {points.map((point, index) => (
            <motion.polyline
              key={index}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.2 }}
              points={point}
              fill="none"
              stroke={data.datasets[index].color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* X 轴标签 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between translate-y-6">
          {data.labels.map((label, index) => (
            <span key={index} className="text-xs text-slate-400">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 简易环形图
export function DonutChart({ 
  data,
  size = 120,
}: { 
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const segments = useMemo(() => {
    let currentAngle = -90;
    return data.map((item) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      return {
        ...item,
        startAngle,
        angle,
      };
    });
  }, [data, total]);

  return (
    <div className="flex items-center gap-4">
      {/* 图表 */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {segments.map((segment, index) => {
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = `${(segment.angle / 360) * circumference} ${circumference}`;
            const rotation = segment.startAngle + 90;

            return (
              <motion.circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="15"
                strokeDasharray={strokeDasharray}
                transform={`rotate(${rotation} 50 50)`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            );
          })}
        </svg>
        
        {/* 中心文字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-slate-400">总计</div>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-slate-300">{item.label}</span>
            <span className="text-sm text-slate-500 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 数据卡片
export function StatCard({
  title,
  value,
  change,
  icon,
  color = '#06B6D4',
}: {
  title: string;
  value: string | number;
  change?: { value: number; trend: 'up' | 'down' };
  icon?: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border border-white/5 bg-slate-800/50"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-slate-400">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        
        {change && (
          <span className={`text-sm ${change.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {change.trend === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
          </span>
        )}
      </div>

      {/* 迷你进度条 */}
      <div className="mt-3 h-1 rounded-full bg-slate-700 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

export default { BarChart, LineChart, DonutChart, StatCard };