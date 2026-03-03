import s from './App.module.css'
import { ConversionHistory } from './components/ConversionHistory'
import { CurrencyInput } from './components/CurrencyInput'
import { InstallPrompt } from './components/InstallPrompt'
import { RateInfo } from './components/RateInfo'
import { RatesTable } from './components/RatesTable'
import { StatusBar } from './components/StatusBar'
import { useConverter } from './hooks/useConverter'
import { useHistory, useAutoSaveHistory } from './hooks/useHistory'
import { useRates } from './hooks/useRates'
import { useSparkline } from './hooks/useSparkline'
import { useTrend } from './hooks/useTrend'
import { haptic } from './utils/haptics'
import type { Currency } from './types'

export default function App() {
  const { rates, status, isFallback, updatedAt, reload } = useRates()

  const {
    fromAmount,
    setFromAmount,
    toAmount,
    from,
    to,
    selectFrom,
    selectTo,
    swap,
    rate,
    currencies,
  } = useConverter(rates)

  const { trends, loading: trendLoading, days: trendDays } = useTrend(rates)
  const sparklines = useSparkline(rates)
  const { history, add: historyAdd } = useHistory()

  useAutoSaveHistory(fromAmount, toAmount, from, to, rate, historyAdd, rates)

  const handleSwap = () => {
    haptic([8, 40, 8])
    swap()
  }
  const handleSelectFrom = (c: Currency) => {
    haptic(6)
    selectFrom(c)
  }
  const handleSelectTo = (c: Currency) => {
    haptic(6)
    selectTo(c)
  }
  const handleRestore = (f: Currency, t: Currency, amt: string) => {
    haptic(10)
    selectFrom(f)
    selectTo(t)
    setFromAmount(amt)
  }

  return (
    <div className="app">
      <div className="orb3" aria-hidden="true" />
      <InstallPrompt />

      <div className={s.card}>
        <header className={s.header}>
          <h1 className={s.title}>💱 Currency Converter</h1>
        </header>

        <StatusBar
          status={status}
          date={rates?.date}
          isFallback={isFallback}
          updatedAt={updatedAt}
          onReload={() => {
            void reload()
          }}
        />

        <div className={s.converter}>
          <CurrencyInput
            label="From"
            amount={fromAmount}
            onAmountChange={setFromAmount}
            selectedCurrency={from}
            currencies={currencies}
            onCurrencyChange={handleSelectFrom}
          />
          <button className={s.swapBtn} onClick={handleSwap} aria-label="Swap currencies">
            ⇄
          </button>
          <CurrencyInput
            label="To"
            amount={toAmount}
            onAmountChange={() => {}}
            selectedCurrency={to}
            currencies={currencies}
            onCurrencyChange={handleSelectTo}
          />
        </div>

        <RateInfo from={from} to={to} rate={rate} toAmount={toAmount} />
        <ConversionHistory history={history} onRestore={handleRestore} />

        <RatesTable
          rates={rates}
          loading={status === 'loading'}
          trends={trends}
          trendLoading={trendLoading}
          trendDays={trendDays}
          sparklines={sparklines}
        />

        <footer className={s.footer}>
          {isFallback
            ? '⚠️ Статичные курсы · API недоступен'
            : '📡 fawazahmed0/currency-api · ECB + open sources'}
        </footer>
      </div>
    </div>
  )
}
