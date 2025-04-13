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
  initHeaderResponsive() // Nova função para responsividade do header

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

// Função para inicializar a responsividade do header
function initHeaderResponsive() {
  // Funcionalidade de toggle do menu mobile
  const menuToggle = document.querySelector('.menu-mobile-toggle')
  const navMenu = document.querySelector('header nav')

  // Verifica se os elementos existem antes de adicionar eventListeners
  if (menuToggle && navMenu) {
    // Adiciona atributos ARIA para acessibilidade
    menuToggle.setAttribute('aria-controls', 'navMenu')
    menuToggle.setAttribute('aria-expanded', 'false')
    navMenu.id = 'navMenu'

    // Adiciona o ícone do menu se não existir
    if (!menuToggle.querySelector('.material-icons')) {
      const menuIcon = document.createElement('span')
      menuIcon.className = 'material-icons'
      menuIcon.textContent = 'menu'
      menuToggle.appendChild(menuIcon)
    }

    // Adiciona o evento de clique para alternar o menu
    menuToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active')
      menuToggle.classList.toggle('active')

      // Atualiza o atributo aria-expanded para acessibilidade
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true'
      menuToggle.setAttribute('aria-expanded', !isExpanded)

      // Alterna o ícone do botão entre 'menu' e 'close'
      const iconElement = menuToggle.querySelector('.material-icons')
      if (iconElement) {
        iconElement.textContent = isExpanded ? 'menu' : 'close'
      }
    })

    // Fecha o menu ao clicar em um link da navegação
    const navLinks = navMenu.querySelectorAll('a')
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active')
        menuToggle.classList.remove('active')
        menuToggle.setAttribute('aria-expanded', 'false')

        const iconElement = menuToggle.querySelector('.material-icons')
        if (iconElement) {
          iconElement.textContent = 'menu'
        }
      })
    })
  }

  // Header recolhível ao rolar
  let lastScrollTop = 0
  let headerHideThreshold = 200
  let scrollDelta = 10

  window.addEventListener(
    'scroll',
    function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const header = document.querySelector('header')

      // Só ativa o comportamento se o header existir e tivermos rolado além do threshold
      if (header && Math.abs(lastScrollTop - scrollTop) > scrollDelta) {
        // Se estamos rolando para baixo e já passamos do threshold
        if (scrollTop > lastScrollTop && scrollTop > headerHideThreshold) {
          header.classList.add('header-hidden')

          // Fecha o menu mobile se estiver aberto
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active')
            if (menuToggle) {
              menuToggle.classList.remove('active')
              menuToggle.setAttribute('aria-expanded', 'false')

              const iconElement = menuToggle.querySelector('.material-icons')
              if (iconElement) {
                iconElement.textContent = 'menu'
              }
            }
          }
        } else {
          // Rolando para cima ou acima do threshold
          header.classList.remove('header-hidden')
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
      }
    },
    { passive: true }
  )
}

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
