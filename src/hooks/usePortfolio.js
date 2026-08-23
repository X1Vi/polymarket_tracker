import { useState, useEffect, useCallback } from 'react'
import {
  isValidAddress,
  fetchProfile,
  fetchPositions,
  fetchPortfolioValue,
  fetchActivity,
  fetchTrades,
} from '../services/api'

export function usePortfolio() {
  const [address, setAddress] = useState(() => {
    return localStorage.getItem('pm_wallet') || ''
  })
  const [inputValue, setInputValue] = useState(address)
  const [profile, setProfile] = useState(null)
  const [positions, setPositions] = useState([])
  const [portfolioValue, setPortfolioValue] = useState(null)
  const [activity, setActivity] = useState([])
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadData = useCallback(async (addr) => {
    setLoading(true)
    setError(null)

    try {
      const [profileData, positionsData, valueData, activityData, tradesData] =
        await Promise.all([
          fetchProfile(addr).catch(() => null),
          fetchPositions(addr).catch(() => []),
          fetchPortfolioValue(addr).catch(() => null),
          fetchActivity(addr).catch(() => []),
          fetchTrades(addr).catch(() => []),
        ])

      setProfile(profileData)
      setPositions(Array.isArray(positionsData) ? positionsData : [])
      setPortfolioValue(valueData)
      setActivity(Array.isArray(activityData) ? activityData : [])
      setTrades(Array.isArray(tradesData) ? tradesData : [])
      localStorage.setItem('pm_wallet', addr)
      setAddress(addr)
    } catch (err) {
      setError(err.message)
      setProfile(null)
      setPositions([])
      setPortfolioValue(null)
      setActivity([])
      setTrades([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (address && isValidAddress(address)) {
      loadData(address)
    }
  }, [])

  const handleSubmit = (addr) => {
    const trimmed = addr.trim()
    if (!trimmed) {
      setError('Please enter a wallet address')
      return
    }
    if (!isValidAddress(trimmed)) {
      setError('Invalid wallet address format')
      return
    }
    setInputValue(trimmed)
    setError(null)
    loadData(trimmed)
  }

  const handleClear = () => {
    setInputValue('')
    setAddress('')
    setProfile(null)
    setPositions([])
    setPortfolioValue(null)
    setActivity([])
    setTrades([])
    setError(null)
    localStorage.removeItem('pm_wallet')
  }

  const totalPnL = positions.reduce((sum, p) => sum + (p.cashPnl || 0), 0)
  const totalInitialValue = positions.reduce(
    (sum, p) => sum + (p.initialValue || 0),
    0
  )
  const totalCurrentValue = positions.reduce(
    (sum, p) => sum + (p.currentValue || 0),
    0
  )

  const winningPositions = positions.filter((p) => (p.cashPnl || 0) > 0)
  const losingPositions = positions.filter((p) => (p.cashPnl || 0) < 0)
  const winRate =
    positions.length > 0
      ? ((winningPositions.length / positions.length) * 100).toFixed(1)
      : '0.0'

  const realizedPnL = positions.reduce(
    (sum, p) => sum + (p.realizedPnl || 0),
    0
  )

  return {
    address,
    inputValue,
    setInputValue,
    profile,
    positions,
    portfolioValue,
    activity,
    trades,
    loading,
    error,
    handleSubmit,
    handleClear,
    totalPnL,
    totalInitialValue,
    totalCurrentValue,
    winningPositions,
    losingPositions,
    winRate,
    realizedPnL,
  }
}
