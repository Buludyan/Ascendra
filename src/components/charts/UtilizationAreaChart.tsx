import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { FleetUtilization as FleetUtilizationData } from '../../domain/types'

interface UtilizationAreaChartProps {
  data: FleetUtilizationData['utilizationTrend']
}

export function UtilizationAreaChart({ data }: UtilizationAreaChartProps) {
  const chartData = data.map((point) => ({
    time: new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(point.timestamp)),
    CPU: point.cpuPercent,
    Memory: point.memoryPercent,
    'Running VMs': point.runningVms,
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={chartData}
          margin={{
            bottom: 0,
            left: -18,
            right: 8,
            top: 8,
          }}
        >
          <defs>
            <linearGradient id="cpuGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0891b2" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="memoryGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0f172a" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#0f172a" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
          <XAxis
            axisLine={false}
            dataKey="time"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
            }}
          />
          <Area
            dataKey="CPU"
            fill="url(#cpuGradient)"
            stroke="#0891b2"
            strokeWidth={3}
            type="monotone"
          />
          <Area
            dataKey="Memory"
            fill="url(#memoryGradient)"
            stroke="#0f172a"
            strokeWidth={3}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
