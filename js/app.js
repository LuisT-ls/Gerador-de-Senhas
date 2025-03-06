/**
 * Gerador de Senhas - Aplicativo Principal
 * Este arquivo importa e inicializa todos os módulos necessários
 */

// Importar módulos principais
import { initConfig } from './modules/config.js'
import { initDarkMode } from './modules/ui/darkMode.js'
import { initTabs } from './modules/ui/tabs.js'
import { initNotifications } from './modules/ui/notifications.js'
import { initModals } from './modules/ui/modals.js'
import { initFormControls } from './modules/ui/formControls.js'

// Importar recursos de geração de senha
import { initPasswordGenerator } from './modules/features/passwordGen.js'
import { initWifiGenerator } from './modules/features/wifiGen.js'
import { initPinGenerator } from './modules/features/pinGen.js'
import { initPassphraseGenerator } from './modules/features/passphraseGen.js'
import { initMultipleGenerator } from './modules/features/multipleGen.js'
import { initPasswordAnalyzer } from './modules/features/analyzer.js'

// Importar recursos de gestão de senhas
import { initPasswordManager } from './modules/storage/passwordManager.js'
import { initPasswordHistory } from './modules/storage/history.js'
import { initExportImport } from './modules/storage/exportImport.js'

// Importar recursos do glossário
import { initGlossarySearch } from './modules/glossary/glossarySearch.js'

// Função para inicializar o aplicativo
const initApp = () => {
  console.log('Inicializando Gerador de Senhas...')

  // Inicializar configurações
  initConfig()

  // Inicializar interface de usuário
  initDarkMode()
  initTabs()
  initNotifications()
  initModals()
  initFormControls()

  // Inicializar recursos de senha
  initPasswordGenerator()
  initWifiGenerator()
  initPinGenerator()
  initPassphraseGenerator()
  initMultipleGenerator()
  initPasswordAnalyzer()

  // Inicializar armazenamento
  initPasswordManager()
  initPasswordHistory()
  initExportImport()

  // Inicializar glossário
  initGlossarySearch()

  console.log('Gerador de Senhas inicializado com sucesso!')
}

// Inicializar aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initApp)
