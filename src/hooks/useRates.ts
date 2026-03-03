import { useCallback, useEffect, useReducer } from 'react'
import { fetchRates } from '../api/rates'
import { FALLBACK_RATES } from '../constants/currencies'
import type { RatesState } from '../types'

const REFRESH_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: RatesState['rates'] }
  | { type: 'FETCH_ERROR'; error: string }

const initialState: RatesState = {
  rates: null,
  status: 'idle',
  isFallback: false,
  error: null,
  updatedAt: null,
}

function reducer(state: RatesState, action: Action): RatesState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null }
    case 'FETCH_SUCCESS':
      return { rates: action.payload, status: 'success', isFallback: false, error: null, updatedAt: Date.now() }
    case 'FETCH_ERROR':
      return { rates: FALLBACK_RATES, status: 'error', isFallback: true, error: action.error, updatedAt: Date.now() }
    default:
      return state
  }
}

export function useRates() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const rates = await fetchRates()
      dispatch({ type: 'FETCH_SUCCESS', payload: rates })
    } catch (e) {
      dispatch({ type: 'FETCH_ERROR', error: e instanceof Error ? e.message : 'Unknown error' })
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const id = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [load])

  return { ...state, reload: load }
}
