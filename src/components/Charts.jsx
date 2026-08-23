import { useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Filler,
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Filler)

function formatCurrency(val) {
  if (val == null || isNaN(val)) return '$0'
  const abs = Math.abs(val)
  if (abs >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  return `$${(abs / 1000).toFixed(1)}K`
}

export default function Charts({ positions }) {
  const [view, setView] = useState('pnl')

  if (!positions.length) return null

  const winning = positions.filter((p) => (p.cashPnl || 0) > 0)
  const losing = positions.filter((p) => (p.cashPnl || 0) < 0)
  const totalPnL = positions.reduce((s, p) => s + (p.cashPnl || 0), 0)
  const best = [...positions].sort((a, b) => (b.cashPnl || 0) - (a.cashPnl || 0))[0]
  const worst = [...positions].sort((a, b) => (a.cashPnl || 0) - (b.cashPnl || 0))[0]
  const largest = [...positions].sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0))[0]

  const top10 = [...positions]
    .sort((a, b) => Math.abs(b.cashPnl || 0) - Math.abs(a.cashPnl || 0))
    .slice(0, 10)
    .reverse()

  const barData = {
    labels: top10.map((p) => (p.title || '').length > 28 ? (p.title || '').slice(0, 28) + '...' : (p.title || '')),
    datasets: [{
      label: 'P&L',
      data: top10.map((p) => (p.cashPnl || 0)),
      backgroundColor: top10.map((p) =>
        (p.cashPnl || 0) >= 0 ? 'rgba(52,211,153,0.85)' : 'rgba(248,113,113,0.85)'
      ),
      borderRadius: 6,
      borderSkipped: false,
    }],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    cutout: '65%',
  }

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a20',
        titleColor: '#e4e4e7',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` P&L: ${ctx.raw >= 0 ? '+' : ''}$${Number(ctx.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#71717a', font: { size: 11 }, callback: (v) => formatCurrency(v) },
        grid: { color: 'rgba(255,255,255,0.03)' },
        border: { display: false },
      },
      y: {
        ticks: { color: '#a1a1aa', font: { size: 11 }, padding: 8 },
        grid: { display: false },
        border: { display: false },
      },
    },
  }

  const StatBox = ({ label, value, subtitle, color = 'text-white' }) => (
    <div className="bg-[#0b0b10] rounded-xl p-4 border border-white/[0.04]">
      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-zinc-600 mt-1 truncate">{subtitle}</p>}
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div className="lg:col-span-3 bg-[#12121a] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.04]">
          <h3 className="text-sm font-semibold text-white">Performance</h3>
          <div className="flex bg-[#0b0b10] rounded-xl p-0.5 border border-white/[0.04]">
            {[
              { key: 'pnl', label: 'Top P&L' },
              { key: 'sizing', label: 'Position Size' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  view === t.key ? 'bg-white/[0.08] text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 h-[360px]">
          {view === 'pnl' && <Bar data={barData} options={barOptions} />}
          {view === 'sizing' && (
            <Bar
              data={{
                labels: top10.map((p) => (p.title || '').length > 28 ? (p.title || '').slice(0, 28) + '...' : (p.title || '')),
                datasets: [{
                  label: 'Value',
                  data: top10.map((p) => p.currentValue || 0),
                  backgroundColor: 'rgba(139,92,246,0.7)',
                  borderRadius: 6,
                  borderSkipped: false,
                }],
              }}
              options={barOptions}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl p-5 flex-1">
          <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">Win / Loss</h3>
          <div className="h-[120px] relative mb-3">
            <Pie
              data={{
                labels: ['Winning', 'Losing'],
                datasets: [{
                  data: [winning.length, losing.length],
                  backgroundColor: ['rgba(52,211,153,0.7)', 'rgba(248,113,113,0.7)'],
                  borderColor: ['#34d399', '#f87171'],
                  borderWidth: 2,
                }],
              }}
              options={pieOptions}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{positions.length}</p>
                <p className="text-[10px] text-zinc-500">total</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-zinc-400">{winning.length} won</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-zinc-400">{losing.length} lost</span>
            </div>
          </div>
        </div>

        <StatBox label="Best Position" value={best ? `+${formatCurrency(best.cashPnl)}` : '-'} subtitle={best?.title} color="text-emerald-400" />
        <StatBox label="Worst Position" value={worst ? `-${formatCurrency(Math.abs(worst.cashPnl))}` : '-'} subtitle={worst?.title} color="text-red-400" />
        <StatBox label="Largest Position" value={largest ? formatCurrency(largest.currentValue) : '-'} subtitle={largest?.title} />

        <div className={`rounded-xl p-4 border border-white/[0.06] ${totalPnL >= 0 ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Total P&L</p>
          <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </p>
        </div>
      </div>
    </div>
  )
}
