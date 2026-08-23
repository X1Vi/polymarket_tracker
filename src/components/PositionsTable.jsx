import { useState, useMemo } from 'react'

function formatCurrency(val) {
  if (val == null || isNaN(val)) return '$0.00'
  return `$${Number(val).toFixed(2)}`
}

function formatSize(val) {
  if (val == null || isNaN(val)) return '0'
  const n = Number(val)
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toFixed(2)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PositionsTable({ positions }) {
  const [sortBy, setSortBy] = useState('cashPnl')
  const [sortDir, setSortDir] = useState('desc')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const handleSort = (field) => {
    setSortDir(sortBy === field ? (sortDir === 'desc' ? 'asc' : 'desc') : 'desc')
    setSortBy(field)
  }

  const filtered = useMemo(() => {
    let data = [...positions]
    if (filter === 'winning') data = data.filter((p) => (p.cashPnl || 0) > 0)
    if (filter === 'losing') data = data.filter((p) => (p.cashPnl || 0) < 0)
    if (filter === 'redeemable') data = data.filter((p) => p.redeemable)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((p) => p.title?.toLowerCase().includes(q))
    }
    data.sort((a, b) => {
      const aVal = a[sortBy] ?? 0
      const bVal = b[sortBy] ?? 0
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal
    })
    return data
  }, [positions, sortBy, sortDir, filter, search])

  if (!positions.length) {
    return (
      <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.02] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <h3 className="text-white font-semibold mb-1">No open positions</h3>
        <p className="text-sm text-zinc-500">Enter a wallet address above to start tracking</p>
      </div>
    )
  }

  const SortIcon = ({ field }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`inline-block ml-1 transition-colors ${sortBy === field ? 'text-white' : 'text-zinc-700'}`}>
      <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
    </svg>
  )

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'winning', label: '↑ Winning' },
    { key: 'losing', label: '↓ Losing' },
    { key: 'redeemable', label: 'Redeemable' },
  ]

  return (
    <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">Positions</h3>
          <span className="text-xs text-zinc-600 bg-white/[0.03] px-2.5 py-1 rounded-lg font-medium">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter markets..."
              className="w-44 pl-9 pr-3 py-2 text-xs bg-[#0b0b10] border border-white/[0.06] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/[0.15] transition-all"
            />
          </div>
          <div className="flex bg-[#0b0b10] rounded-xl p-0.5 border border-white/[0.04]">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filter === f.key ? 'bg-white/[0.08] text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {[
                { field: 'title', label: 'Market', className: 'w-[30%]' },
                { field: null, label: 'Side' },
                { field: 'size', label: 'Shares' },
                { field: 'avgPrice', label: 'Avg Price' },
                { field: 'curPrice', label: 'Current' },
                { field: 'currentValue', label: 'Value' },
                { field: 'cashPnl', label: 'P&L' },
                { field: 'percentPnl', label: 'Return' },
                { field: 'endDate', label: 'Ends' },
              ].map((col) => (
                <th
                  key={col.field || col.label}
                  className={`text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ${col.className || ''} ${col.field ? 'cursor-pointer hover:text-zinc-300 select-none' : ''}`}
                  onClick={() => col.field && handleSort(col.field)}
                >
                  {col.label}
                  {col.field && <SortIcon field={col.field} />}
                </th>
              ))}
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const isProfit = (p.cashPnl || 0) >= 0
              const slug = p.slug || p.eventSlug || ''

              return (
                <tr
                  key={p.conditionId}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.icon ? (
                        <img src={p.icon} alt="" className="w-7 h-7 rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex-shrink-0" />
                      )}
                      <span className="text-sm text-white font-medium line-clamp-2 max-w-[300px] leading-snug" title={p.title}>
                        {p.title || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      p.outcome === 'Yes'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : p.outcome === 'No'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-white/[0.04] text-zinc-400'
                    }`}>
                      {p.outcome || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-zinc-300 font-mono tabular-nums">
                    {formatSize(p.size)}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-zinc-400 font-mono tabular-nums">
                    ${Number(p.avgPrice || 0).toFixed(4)}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-white font-mono tabular-nums">
                    ${Number(p.curPrice || 0).toFixed(4)}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-zinc-300 font-mono tabular-nums">
                    {formatCurrency(p.currentValue)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-mono font-semibold tabular-nums ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}{formatCurrency(p.cashPnl)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold tabular-nums ${
                      (p.percentPnl || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {(p.percentPnl || 0) >= 0 ? '↑' : '↓'} {Math.abs(p.percentPnl || 0).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500">
                    {formatDate(p.endDate)}
                  </td>
                  <td className="px-4 py-3.5">
                    {slug && (
                      <a
                        href={`https://polymarket.com/event/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-600 hover:text-white hover:bg-white/[0.04] transition-all opacity-0 group-hover:opacity-100"
                        title="View on Polymarket"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-500">No positions match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
