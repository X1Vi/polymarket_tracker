import { useState, useEffect, useRef } from 'react'
import Header, { WalletInput } from './components/Header'
import SummaryCards from './components/SummaryCards'
import PositionsTable from './components/PositionsTable'
import Charts from './components/Charts'
import { usePortfolio } from './hooks/usePortfolio'
import { trackWalletLookup } from './services/analytics'

function App() {
  const tracked = useRef(null)
  const [view, setView] = useState('dashboard')
  const portfolio = usePortfolio()

  useEffect(() => {
    if (portfolio.address && portfolio.positions.length > 0 && tracked.current !== portfolio.address) {
      tracked.current = portfolio.address
      trackWalletLookup(portfolio.address)
    }
  }, [portfolio.address, portfolio.positions])

  return (
    <div className="min-h-screen bg-[#0b0b10]">
      <Header activeView={view} onViewChange={setView} />

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <WalletInput
          inputValue={portfolio.inputValue}
          setInputValue={portfolio.setInputValue}
          onSubmit={portfolio.handleSubmit}
          onClear={portfolio.handleClear}
          loading={portfolio.loading}
          error={portfolio.error}
          address={portfolio.address}
          profile={portfolio.profile}
        />

        {!portfolio.address && !portfolio.loading && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-[22px] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center ring-1 ring-white/[0.06]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#8b5cf6"/><stop offset="1" stopColor="#d946ef"/></linearGradient></defs>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Welcome to Polymarket Tracker</h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Enter a wallet address above to see positions, profit/loss, win rate, and more — all live from Polymarket's Data API.
            </p>
          </div>
        )}

        {portfolio.loading && (
          <div className="py-32 flex flex-col items-center gap-5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
            </div>
            <p className="text-sm text-zinc-500">Loading portfolio data...</p>
          </div>
        )}

        {portfolio.error && (
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Failed to load portfolio</p>
                <p className="text-xs text-zinc-500 mt-0.5">{portfolio.error}</p>
              </div>
            </div>
          </div>
        )}

        {portfolio.address && !portfolio.loading && !portfolio.error && (
          <>
            {view === 'dashboard' && (
              <>
                <SummaryCards
                  totalPnL={portfolio.totalPnL}
                  totalCurrentValue={portfolio.totalCurrentValue}
                  totalInitialValue={portfolio.totalInitialValue}
                  positions={portfolio.positions}
                  winRate={portfolio.winRate}
                  realizedPnL={portfolio.realizedPnL}
                  portfolioValue={portfolio.portfolioValue}
                />
                <Charts positions={portfolio.positions} />
                <PositionsTable positions={portfolio.positions} />
              </>
            )}

            {view === 'positions' && (
              <PositionsTable positions={portfolio.positions} />
            )}

            {view === 'charts' && (
              <>
                <SummaryCards
                  totalPnL={portfolio.totalPnL}
                  totalCurrentValue={portfolio.totalCurrentValue}
                  totalInitialValue={portfolio.totalInitialValue}
                  positions={portfolio.positions}
                  winRate={portfolio.winRate}
                  realizedPnL={portfolio.realizedPnL}
                  portfolioValue={portfolio.portfolioValue}
                />
                <Charts positions={portfolio.positions} />
              </>
            )}
          </>
        )}

        {portfolio.address && (
          <footer className="border-t border-white/[0.04] py-6 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-zinc-600">
                Data from{' '}
                <a href="https://docs.polymarket.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Polymarket Data API
                </a>
              </p>
              <p className="text-xs text-zinc-700">Not affiliated with Polymarket</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  )
}

export default App
