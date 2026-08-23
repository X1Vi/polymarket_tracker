export default function Header({ onViewChange, activeView }) {
  const tabs = [
    { key: 'dashboard', label: 'Overview' },
    { key: 'positions', label: 'Positions' },
    { key: 'charts', label: 'Analytics' },
  ]

  return (
    <header className="border-b border-white/[0.06] bg-[#0b0b10]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-lg" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">Polymarket Tracker</h1>
            <p className="text-[11px] text-zinc-500 leading-none mt-0.5">Portfolio P&L Dashboard</p>
          </div>
        </div>

        <nav className="flex bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeView === tab.key
                  ? 'text-white bg-white/[0.08] shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export function WalletInput({
  inputValue,
  setInputValue,
  onSubmit,
  onClear,
  loading,
  error,
  address,
  profile,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit(inputValue)
  }

  if (address && profile) {
    return (
      <div className="relative group">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-violet-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <div className="relative bg-[#12121a] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile.image_uri ? (
              <img src={profile.image_uri} alt="" className="w-12 h-12 rounded-full ring-2 ring-violet-500/20" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center ring-2 ring-violet-500/20">
                <span className="text-violet-300 font-bold text-lg">
                  {profile.username?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <div>
              <p className="text-white font-semibold">
                {profile.username || `${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl transition-all duration-200 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-violet-500/5 rounded-2xl blur-2xl -z-10" />
      <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl p-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center ring-1 ring-white/[0.06]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Track Your Polymarket Portfolio</h2>
          <p className="text-sm text-zinc-500 mb-8">
            Enter any wallet address to view positions, P&L, and analytics — all pulled live from Polymarket.
          </p>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter wallet address 0x..."
                className="w-full pl-11 pr-4 py-3.5 bg-[#0b0b10] border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 font-mono transition-all duration-200"
                disabled={loading}
              />
            </div>
            <button
              onClick={() => onSubmit(inputValue)}
              disabled={loading}
              className="px-7 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading
                </span>
              ) : (
                'Track Portfolio'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
