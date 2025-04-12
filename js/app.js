// app.js - Arquivo principal da aplicação
import { initDarkMode } from './modules/ui/darkMode.js'
import { initTabs } from './modules/ui/tabs.js'
import { initFormControls } from './modules/ui/formControls.js'
import { initModals } from './modules/ui/modals.js'
import { initNotifications } from './modules/ui/notifications.js'
import { initPasswordGenerator } from './modules/features/passwordGen.js'
import { initMultipleGenerator } from './modules/features/multipleGen.js'
import { initPasswordAnalyzer } from './modules/features/analyzer.js'
import { initWifiGenerator } from './modules/features/wifiGen.js'
import { initPinGenerator } from './modules/features/pinGen.js'
import { initPassphraseGenerator } from './modules/features/passphraseGen.js'
import { initPasswordManager } from './modules/storage/passwordManager.js'
import { initHistoryManager } from './modules/storage/history.js'
import { initExportImport } from './modules/storage/exportImport.js'
import { initGlossarySearch } from './modules/glossary/glossarySearch.js'
import { initFooterFeatures } from './modules/ui/footerFeatures.js'

// Função de inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar componentes da UI
  initDarkMode()
  initTabs()
  initFormControls()
  initModals()
  initNotifications()
  initFooterFeatures()

  // Inicializar geradores de senha
  initPasswordGenerator()
  initMultipleGenerator()
  initPasswordAnalyzer()
  initWifiGenerator()
  initPinGenerator()
  initPassphraseGenerator()

  // Inicializar gerenciamento de senhas
  initPasswordManager()
  initHistoryManager()
  initExportImport()

  // Inicializar glossário
  initGlossarySearch()

  // Exibir dicas na primeira visita
  showTipsIfFirstVisit()
})

// Função para mostrar dicas na primeira visita
function showTipsIfFirstVisit() {
  if (!localStorage.getItem('passwordGeneratorVisited')) {
    // Marcar como visitado
    localStorage.setItem('passwordGeneratorVisited', 'true')

    // Mostrar o modal de dicas após um pequeno delay
    setTimeout(() => {
      const modalDicas = document.getElementById('modalDicas')
      if (modalDicas) {
        modalDicas.showModal()
      }
    }, 1000)
  }
}
