import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import s from './InstallPrompt.module.css'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installDismissed, setInstallDismissed] = useState(false)

  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted' || outcome === 'dismissed') setInstallPrompt(null)
  }

  if (needRefresh) {
    return (
      <div className={s.prompt}>
        <div className={s.text}>
          <span className={s.icon}>🔄</span>
          <div>
            <strong>Доступно обновление</strong>
            <p>Новая версия приложения</p>
          </div>
        </div>
        <div className={s.actions}>
          <button className={`${s.btn} ${s.btnInstall}`} onClick={() => updateServiceWorker(true)}>
            Обновить
          </button>
        </div>
      </div>
    )
  }

  if (!installPrompt || installDismissed) return null

  return (
    <div className={s.prompt}>
      <div className={s.text}>
        <span className={s.icon}>📲</span>
        <div>
          <strong>Установить приложение</strong>
          <p>Работает офлайн · Нет браузера</p>
        </div>
      </div>
      <div className={s.actions}>
        <button className={`${s.btn} ${s.btnInstall}`} onClick={handleInstall}>
          Установить
        </button>
        <button className={`${s.btn} ${s.btnDismiss}`} onClick={() => setInstallDismissed(true)}>
          ✕
        </button>
      </div>
    </div>
  )
}
