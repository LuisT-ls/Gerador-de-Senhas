// glossarySearch.js - Funcionalidade de pesquisa e interações no glossário reestruturado

import { removeAccents, debounce } from '../core/utils.js'

/**
 * Inicializa a funcionalidade de pesquisa e interações do glossário
 */
export function initGlossarySearch() {
  const pesquisaGlossario = document.getElementById('pesquisaGlossario')
  const termos = document.querySelectorAll('.termo-container')
  const glossarioSection = document.getElementById('glossario')
  const tabButtons = document.querySelectorAll('.tab-btn')
  const tabPanels = document.querySelectorAll('.tab-panel')

  if (!pesquisaGlossario || !glossarioSection) return

  // Inicializar sistema de abas
  initTabs()

  // Adicionar efeitos de hover aos termos
  addHoverEffects()

  // Criar função debounce para pesquisar
  const debouncedSearch = debounce(searchTerm => {
    searchGlossary(searchTerm)
  }, 300)

  // Adicionar evento de input para o campo de pesquisa
  pesquisaGlossario.addEventListener('input', event => {
    const searchTerm = event.target.value.trim()
    debouncedSearch(searchTerm)
  })

  // Limpar pesquisa quando pressionar ESC
  pesquisaGlossario.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      pesquisaGlossario.value = ''
      showAllTerms()

      // Focar novamente o campo após limpar
      setTimeout(() => {
        pesquisaGlossario.focus()
      }, 10)
    }
  })

  /**
   * Inicializa o sistema de abas
   */
  function initTabs() {
    // Adicionar evento de clique para cada botão de aba
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Desativar todas as abas
        tabButtons.forEach(btn => btn.classList.remove('active'))
        tabPanels.forEach(panel => panel.classList.remove('active'))

        // Ativar a aba clicada
        button.classList.add('active')

        // Ativar o painel correspondente
        const targetId = button.dataset.target
        if (targetId) {
          const targetPanel = document.getElementById(targetId)
          if (targetPanel) {
            targetPanel.classList.add('active')
          }
        }
      })
    })
  }

  /**
   * Realiza a pesquisa no glossário
   * @param {string} searchTerm - Termo de pesquisa
   */
  function searchGlossary(searchTerm) {
    if (!searchTerm) {
      showAllTerms()
      return
    }

    // Normalizar termo de pesquisa
    const normalizedSearch = normalizeText(searchTerm)

    // Contador de resultados
    let foundCount = 0
    let hasResultInPanels = {}

    // Inicializar contagem de resultados por painel
    tabPanels.forEach(panel => {
      hasResultInPanels[panel.id] = false
    })

    // Verificar cada termo
    termos.forEach(termo => {
      const dt = termo.querySelector('dt')
      const dd = termo.querySelector('dd')

      if (!dt || !dd) return

      const termText = normalizeText(dt.textContent)
      const definitionText = normalizeText(dd.textContent)

      // Guardar conteúdo original se ainda não foi guardado
      if (!dt.dataset.original) {
        dt.dataset.original = dt.innerHTML
      }
      if (!dd.dataset.original) {
        dd.dataset.original = dd.innerHTML
      }

      // Verificar se o termo ou a definição contém o texto de pesquisa
      if (
        termText.includes(normalizedSearch) ||
        definitionText.includes(normalizedSearch)
      ) {
        // Adicionar classes com animação
        termo.classList.remove('pesquisa-oculto')

        // Usar setTimeout para criar efeito de cascata na animação
        setTimeout(() => {
          termo.classList.add('pesquisa-resultado')
        }, foundCount * 50)

        // Destacar o texto que corresponde à pesquisa
        highlightMatchingText(dt, searchTerm, dt.dataset.original)
        highlightMatchingText(dd, searchTerm, dd.dataset.original)

        // Registrar que o painel pai tem resultados
        const parentPanel = termo.closest('.tab-panel')
        if (parentPanel) {
          hasResultInPanels[parentPanel.id] = true
        }

        foundCount++
      } else {
        // Remover as classes com animação de fade out
        termo.classList.add('fade-out')

        setTimeout(() => {
          termo.classList.add('pesquisa-oculto')
          termo.classList.remove('pesquisa-resultado', 'fade-out')
        }, 300)

        // Restaurar o texto original
        dt.innerHTML = dt.dataset.original
        dd.innerHTML = dd.dataset.original
      }
    })

    // Mostrar mensagem se nenhum resultado for encontrado
    if (foundCount === 0) {
      showNoResultsMessage(searchTerm)

      // Mostrar o primeiro painel
      showFirstPanel()
    } else {
      removeNoResultsMessage()

      // Mostrar contador de resultados
      showResultsCount(foundCount, searchTerm)

      // Mostrar o primeiro painel com resultados
      showFirstPanelWithResults(hasResultInPanels)
    }
  }

  /**
   * Mostra o primeiro painel com resultados
   * @param {Object} resultsMap - Mapa de painéis com resultados
   */
  function showFirstPanelWithResults(resultsMap) {
    // Tentar encontrar o primeiro painel com resultados
    for (const panelId in resultsMap) {
      if (resultsMap[panelId]) {
        // Encontrar o botão correspondente
        const targetButton = document.querySelector(
          `.tab-btn[data-target="${panelId}"]`
        )
        if (targetButton) {
          // Simular clique no botão
          targetButton.click()
          return
        }
      }
    }

    // Se não encontrou nenhum painel com resultados, mostrar o primeiro painel
    showFirstPanel()
  }

  /**
   * Mostra o primeiro painel
   */
  function showFirstPanel() {
    if (tabButtons.length > 0) {
      tabButtons[0].click()
    }
  }

  /**
   * Mostra todos os termos (limpa a pesquisa)
   */
  function showAllTerms() {
    // Remover contador de resultados
    removeResultsCount()

    // Remover mensagem "nenhum resultado"
    removeNoResultsMessage()

    // Mostrar todos os termos
    termos.forEach((termo, index) => {
      const dt = termo.querySelector('dt')
      const dd = termo.querySelector('dd')

      // Restaurar conteúdo original se existir
      if (dt && dt.dataset.original) {
        dt.innerHTML = dt.dataset.original
      }

      if (dd && dd.dataset.original) {
        dd.innerHTML = dd.dataset.original
      }

      // Remover classes de resultado com animação de fade
      if (termo.classList.contains('pesquisa-resultado')) {
        termo.classList.add('fade-out')

        setTimeout(() => {
          termo.classList.remove('pesquisa-resultado', 'fade-out')
        }, 300)
      }

      // Mostrar termos ocultos com animação suave
      if (termo.classList.contains('pesquisa-oculto')) {
        termo.classList.remove('pesquisa-oculto')
        termo.style.opacity = '0'

        setTimeout(() => {
          termo.style.opacity = '1'
          termo.style.transition = 'opacity 0.3s ease-in-out'
        }, index * 30)

        setTimeout(() => {
          termo.style.transition = ''
        }, index * 30 + 300)
      }
    })
  }

  /**
   * Mostra mensagem de nenhum resultado encontrado
   * @param {string} searchTerm - Termo pesquisado
   */
  function showNoResultsMessage(searchTerm) {
    removeNoResultsMessage()
    removeResultsCount()

    const glossarioHeader = document.querySelector('.glossario-header')

    if (glossarioHeader) {
      const noResultsMessage = document.createElement('div')
      noResultsMessage.className = 'sem-resultados'
      noResultsMessage.innerHTML = `
        Nenhum resultado encontrado para "<strong>${searchTerm}</strong>". 
        <div>
          <p>Sugestões:</p>
          <ul>
            <li>Verifique a ortografia</li>
            <li>Tente palavras-chave diferentes</li>
            <li>Use termos mais gerais</li>
          </ul>
        </div>
      `

      glossarioHeader.parentNode.insertBefore(
        noResultsMessage,
        glossarioHeader.nextSibling
      )

      // Adicionar animação de entrada
      noResultsMessage.style.opacity = '0'
      noResultsMessage.style.transform = 'translateY(20px)'

      setTimeout(() => {
        noResultsMessage.style.opacity = '1'
        noResultsMessage.style.transform = 'translateY(0)'
        noResultsMessage.style.transition =
          'opacity 0.5s ease, transform 0.5s ease'
      }, 10)
    }
  }

  /**
   * Remove a mensagem de nenhum resultado
   */
  function removeNoResultsMessage() {
    const noResultsMessage = document.querySelector('.sem-resultados')

    if (noResultsMessage) {
      noResultsMessage.style.opacity = '0'
      noResultsMessage.style.transform = 'translateY(20px)'
      noResultsMessage.style.transition =
        'opacity 0.3s ease, transform 0.3s ease'

      setTimeout(() => {
        if (noResultsMessage.parentNode) {
          noResultsMessage.parentNode.removeChild(noResultsMessage)
        }
      }, 300)
    }
  }

  /**
   * Mostra contador de resultados encontrados
   * @param {number} count - Número de resultados
   * @param {string} searchTerm - Termo pesquisado
   */
  function showResultsCount(count, searchTerm) {
    removeResultsCount()

    const searchContainer = document.querySelector(
      '#glossario .search-container'
    )

    if (searchContainer) {
      const resultsCount = document.createElement('div')
      resultsCount.className = 'resultados-contagem'
      resultsCount.innerHTML = `
        <span>${count} ${
        count === 1 ? 'resultado encontrado' : 'resultados encontrados'
      } para "${searchTerm}"</span>
      `

      searchContainer.appendChild(resultsCount)

      // Animar entrada
      resultsCount.style.opacity = '0'

      setTimeout(() => {
        resultsCount.style.opacity = '1'
        resultsCount.style.transition = 'opacity 0.3s ease'
      }, 10)
    }
  }

  /**
   * Remove o contador de resultados
   */
  function removeResultsCount() {
    const resultsCount = document.querySelector('.resultados-contagem')

    if (resultsCount) {
      resultsCount.style.opacity = '0'
      resultsCount.style.transition = 'opacity 0.3s ease'

      setTimeout(() => {
        if (resultsCount.parentNode) {
          resultsCount.parentNode.removeChild(resultsCount)
        }
      }, 300)
    }
  }

  /**
   * Destaca o texto correspondente à pesquisa
   * @param {Element} element - Elemento contendo o texto
   * @param {string} searchTerm - Termo de pesquisa
   * @param {string} originalContent - Conteúdo original do elemento
   */
  function highlightMatchingText(element, searchTerm, originalContent) {
    if (!element || !searchTerm) return

    // Se não temos conteúdo original, usar o conteúdo atual
    const originalText = originalContent || element.textContent

    // Escapar caracteres especiais de regex
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Criar regex para pesquisa case insensitive
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')

    // Substituir ocorrências com spans destacados
    const highlightedText = originalText.replace(regex, '<mark>$1</mark>')

    // Atualizar o conteúdo com animação
    element.innerHTML = highlightedText
  }

  /**
   * Adiciona efeitos de hover aos termos
   */
  function addHoverEffects() {
    termos.forEach(termo => {
      // Adicionar classe para estilização avançada no hover
      termo.classList.add('termo-interativo')

      // Adicionar efeito de foco ao clicar
      termo.tabIndex = 0

      // Adicionar evento para acessibilidade via teclado
      termo.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          termo.classList.add('termo-focus')
          setTimeout(() => {
            termo.classList.remove('termo-focus')
          }, 300)
        }
      })
    })
  }

  /**
   * Normaliza o texto para pesquisa (remove acentos, converte para minúsculas)
   * @param {string} text - Texto a normalizar
   * @returns {string} Texto normalizado
   */
  function normalizeText(text) {
    if (!text) return ''

    return removeAccents(text.toLowerCase())
  }

  /**
   * Adiciona funcionalidade de acessibilidade para usuários de teclado
   */
  function setupKeyboardAccessibility() {
    // Adicionar navegação de teclado para as abas
    tabButtons.forEach((button, index) => {
      button.addEventListener('keydown', e => {
        // Teclas de seta esquerda e direita para navegar entre abas
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          const nextIndex = (index + 1) % tabButtons.length
          tabButtons[nextIndex].focus()
          tabButtons[nextIndex].click()
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const prevIndex = (index - 1 + tabButtons.length) % tabButtons.length
          tabButtons[prevIndex].focus()
          tabButtons[prevIndex].click()
        }
      })
    })
  }

  // Verificar se a URL contém um parâmetro de pesquisa
  function checkUrlForSearch() {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get('search')

    if (searchParam) {
      // Preencher o campo de pesquisa
      pesquisaGlossario.value = searchParam

      // Executar a pesquisa
      searchGlossary(searchParam)
    }
  }

  // Inicializar funcionalidades adicionais
  setupKeyboardAccessibility()
  checkUrlForSearch()

  // Iniciar com o primeiro painel ativo
  showFirstPanel()
}
