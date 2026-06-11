import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { VMUsagePoint } from '../../domain/types'

interface UsageLineChartProps {
  data: VMUsagePoint[]
}

export function UsageLineChart({ data }: UsageLineChartProps) {
  const chartData = data.map((point) => ({
    time: new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(point.timestamp)),
    CPU: point.cpuPercent,
    Memory: point.memoryPercent,
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={chartData}
          margin={{
            bottom: 0,
            left: -18,
            right: 8,
            top: 8,
          }}
        >
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
          <Line
            activeDot={{ r: 6 }}
            dataKey="CPU"
            dot={false}
            stroke="#0891b2"
            strokeWidth={3}
            type="monotone"
          />
          <Line
            activeDot={{ r: 6 }}
            dataKey="Memory"
            dot={false}
            stroke="#0f172a"
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
