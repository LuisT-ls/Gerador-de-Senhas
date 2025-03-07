// tabs.js - Controle das abas da interface

/**
 * Inicializa o sistema de abas
 */
export function initTabs() {
  // Inicializar abas de ferramentas
  initTabSystem('.tab-navigation:not(.secondary)', '.tab-button', '.tab-panel')

  // Inicializar abas de gerenciamento
  initTabSystem('.tab-navigation.secondary', '.tab-button', '.tab-panel')

  // Navegação principal
  initMainNavigation()

  /**
   * Inicializa um sistema de abas
   * @param {string} navSelector - Seletor para o elemento de navegação
   * @param {string} tabSelector - Seletor para os botões de abas
   * @param {string} panelSelector - Seletor para os painéis de conteúdo
   */
  function initTabSystem(navSelector, tabSelector, panelSelector) {
    const tabNavs = document.querySelectorAll(navSelector)

    tabNavs.forEach(tabNav => {
      const tabButtons = tabNav.querySelectorAll(tabSelector)

      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Obter o ID do painel alvo
          const targetId = button.getAttribute('aria-controls')
          const targetPanel = document.getElementById(targetId)

          if (!targetPanel) return

          // Desativar todas as abas no mesmo grupo
          const siblingButtons = tabNav.querySelectorAll(tabSelector)
          siblingButtons.forEach(btn => {
            btn.classList.remove('active')
            btn.setAttribute('aria-selected', 'false')

            // Ocultar o painel correspondente
            const panelId = btn.getAttribute('aria-controls')
            const panel = document.getElementById(panelId)

            if (panel) {
              panel.classList.remove('active')
              panel.hidden = true
            }
          })

          // Ativar a aba clicada
          button.classList.add('active')
          button.setAttribute('aria-selected', 'true')

          // Mostrar o painel correspondente
          targetPanel.classList.add('active')
          targetPanel.hidden = false
        })
      })
    })
  }

  /**
   * Inicializa a navegação principal
   */
  function initMainNavigation() {
    const navLinks = document.querySelectorAll('header nav a')

    navLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault()

        // Obter o ID da seção alvo
        const targetId = link.getAttribute('href').substring(1)
        const targetSection = document.getElementById(targetId)

        if (!targetSection) return

        // Desativar todos os links
        navLinks.forEach(navLink => {
          navLink.classList.remove('active')
        })

        // Ativar o link clicado
        link.classList.add('active')

        // Rolar até a seção
        targetSection.scrollIntoView({ behavior: 'smooth' })
      })
    })

    // Ao rolar a página, marcar o link ativo
    window.addEventListener('scroll', () => {
      // Usar throttle para evitar chamar muitas vezes durante rolagem
      if (window.scrollUpdateTimeout) return

      window.scrollUpdateTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('main section')
        let foundActive = false

        // Verificar todas as seções, de cima para baixo
        for (const section of sections) {
          const rect = section.getBoundingClientRect()
          const id = section.getAttribute('id')
          const link = document.querySelector(`header nav a[href="#${id}"]`)

          // Se o topo da seção estiver próximo ao topo da viewport
          if (rect.top <= 100 && rect.bottom > 100) {
            navLinks.forEach(navLink => navLink.classList.remove('active'))
            if (link) link.classList.add('active')
            foundActive = true
            break
          }
        }

        // Se nenhuma seção estiver ativa, ativar a primeira
        if (!foundActive && sections.length > 0) {
          const firstSectionId = sections[0].getAttribute('id')
          const firstLink = document.querySelector(
            `header nav a[href="#${firstSectionId}"]`
          )

          if (firstLink) {
            navLinks.forEach(navLink => navLink.classList.remove('active'))
            firstLink.classList.add('active')
          }
        }

        window.scrollUpdateTimeout = null
      }, 100)
    })

    // Ativar o link correspondente à seção inicialmente visível
    setTimeout(() => {
      const scrollEvent = new Event('scroll')
      window.dispatchEvent(scrollEvent)
    }, 100)
  }
}
