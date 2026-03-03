import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installDismissed, setInstallDismissed] = useState(false)

  // SW update notification
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

  // SW update available
  if (needRefresh) {
    return (
      <div className="install-prompt">
        <div className="install-prompt__text">
          <span className="install-prompt__icon">🔄</span>
          <div>
            <strong>Доступно обновление</strong>
            <p>Новая версия приложения</p>
          </div>
        </div>
        <div className="install-prompt__actions">
          <button
            className="install-prompt__btn install-prompt__btn--install"
            onClick={() => updateServiceWorker(true)}
          >
            Обновить
          </button>
        </div>
      </div>
    )
  }

  if (!installPrompt || installDismissed) return null

  return (
    <div className="install-prompt">
      <div className="install-prompt__text">
        <span className="install-prompt__icon">📲</span>
        <div>
          <strong>Установить приложение</strong>
          <p>Работает офлайн · Нет браузера</p>
        </div>
      </div>
      <div className="install-prompt__actions">
        <button className="install-prompt__btn install-prompt__btn--install" onClick={handleInstall}>
          Установить
        </button>
        <button className="install-prompt__btn install-prompt__btn--dismiss" onClick={() => setInstallDismissed(true)}>
          ✕
        </button>
      </div>
    </div>
  )
}
