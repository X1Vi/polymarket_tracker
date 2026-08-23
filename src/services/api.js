const DATA_API = 'https://data-api.polymarket.com'
const GAMMA_API = 'https://gamma-api.polymarket.com'

const VALID_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export function isValidAddress(address) {
  return VALID_ADDRESS.test(address)
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchProfile(address) {
  try {
    const data = await fetchJson(
      `https://gamma-api.polymarket.com/users/${address}`
    )
    return data
  } catch {
    return null
  }
}

export async function fetchPositions(address) {
  const data = await fetchJson(
    `${DATA_API}/positions?user=${address}&limit=500&sortBy=TOKENS&sortDirection=DESC`
  )
  return data
}

export async function fetchPortfolioValue(address) {
  const data = await fetchJson(
    `${DATA_API}/value?user=${address}`
  )
  return data
}

export async function fetchActivity(address) {
  const data = await fetchJson(
    `${DATA_API}/activity?user=${address}&limit=200&sortBy=TIMESTAMP&sortDirection=DESC`
  )
  return data
}

export async function fetchTrades(address) {
  const data = await fetchJson(
    `${DATA_API}/trades?user=${address}&limit=200`
  )
  return data
}

export async function fetchOrderBook(tokenId) {
  const data = await fetchJson(
    `${GAMMA_API}/markets/${tokenId}/order-book`
  )
  return data
}

export async function fetchMarkets(limit = 100) {
  const data = await fetchJson(
    `${GAMMA_API}/markets/keyset?closed=false&limit=${limit}&order=volume&ascending=false`
  )
  return data
}

export async function fetchPricesHistory(marketId, intervals = ['1d']) {
  const params = new URLSearchParams({
    market: marketId,
  })
  intervals.forEach((i) => params.append('intervals', i))
  const data = await fetchJson(
    `${DATA_API}/prices-history?${params}`
  )
  return data
}
