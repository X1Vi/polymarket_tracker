export function trackPageView(path) {
  if (window.gtag) {
    window.gtag('event', 'page_view', { page_path: path })
  }
}

export function trackEvent(action, params = {}) {
  if (window.gtag) {
    window.gtag('event', action, params)
  }
}

export function trackWalletLookup(address) {
  if (window.gtag) {
    window.gtag('event', 'wallet_lookup', {
      wallet_prefix: address.slice(0, 6),
    })
  }
}

export function trackError(action, error) {
  if (window.gtag) {
    window.gtag('event', 'error', {
      action,
      message: String(error).slice(0, 100),
    })
  }
}
