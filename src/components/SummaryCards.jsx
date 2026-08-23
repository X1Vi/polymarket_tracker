function formatCurrency(val) {
  if (val == null || isNaN(val)) return '$0.00'
  const abs = Math.abs(val)
  if (abs >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `$${(val / 1_000).toFixed(2)}K`
  return `$${val.toFixed(2)}`
}

export default function SummaryCards({
  totalPnL, totalCurrentValue, totalInitialValue,
  positions, winRate, realizedPnL, portfolioValue,
}) {
  const cards = [
    {
      label: 'Portfolio Value',
      value: formatCurrency(portfolioValue?.value ?? totalCurrentValue),
      gradient: 'from-violet-500 to-indigo-500',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      ),
    },
    {
      label: 'Unrealized P&L',
      value: `${totalPnL >= 0 ? '+' : ''}${formatCurrency(totalPnL)}`,
      change: `${((totalPnL / (totalInitialValue || 1)) * 100).toFixed(1)}%`,
      isPositive: totalPnL > 0,
      isNegative: totalPnL < 0,
      gradient: totalPnL >= 0 ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-rose-500',
      icon:
        totalPnL >= 0 ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
          </svg>
        ),
    },
    {
      label: 'Win Rate',
      value: `${winRate}%`,
      sub: `${positions.filter((p) => (p.cashPnl || 0) > 0).length}W / ${positions.filter((p) => (p.cashPnl || 0) < 0).length}L`,
      gradient: parseFloat(winRate) >= 50 ? 'from-amber-500 to-orange-500' : 'from-zinc-500 to-zinc-400',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: 'Total Positions',
      value: String(positions.length),
      sub: 'Open',
      gradient: 'from-sky-500 to-cyan-500',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      label: 'Cost Basis',
      value: formatCurrency(totalInitialValue),
      sub: 'Invested',
      gradient: 'from-zinc-500 to-zinc-400',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Realized P&L',
      value: `${realizedPnL >= 0 ? '+' : ''}${formatCurrency(realizedPnL)}`,
      isPositive: realizedPnL > 0,
      isNegative: realizedPnL < 0,
      gradient: realizedPnL >= 0 ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-rose-500',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="relative group bg-[#12121a] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
              {card.label}
            </span>
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${card.gradient} bg-opacity-10 flex items-center justify-center text-white shadow-lg`}
              style={{ opacity: 0.15 }}
            />
          </div>

          <p className={`text-2xl font-bold tracking-tight ${
            card.isPositive ? 'text-emerald-400' : card.isNegative ? 'text-red-400' : 'text-white'
          }`}>
            {card.value}
          </p>

          {(card.change || card.sub) && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {card.change && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  card.isPositive ? 'text-emerald-400' : card.isNegative ? 'text-red-400' : 'text-zinc-400'
                }`}>
                  {card.isPositive ? '↑' : card.isNegative ? '↓' : ''} {card.change}
                </span>
              )}
              {card.sub && (
                <span className="text-xs text-zinc-600">{card.sub}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
