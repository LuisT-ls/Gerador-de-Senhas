// glossarySearch.js - Funcionalidade de pesquisa no glossário

import { removeAccents, debounce } from '../core/utils.js'

/**
 * Inicializa a funcionalidade de pesquisa no glossário
 */
export function initGlossarySearch() {
  const pesquisaGlossario = document.getElementById('pesquisaGlossario')
  const termos = document.querySelectorAll('.termo-container')
  const categorias = document.querySelectorAll('.categoria')

  if (!pesquisaGlossario) return

  // Criar função debounce para pesquisar
  const debouncedSearch = debounce(searchTerm => {
    searchGlossary(searchTerm)
  }, 300)

  // Adicionar evento de input
  pesquisaGlossario.addEventListener('input', event => {
    const searchTerm = event.target.value.trim()
    debouncedSearch(searchTerm)
  })

  // Limpar pesquisa quando pressionar ESC
  pesquisaGlossario.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      pesquisaGlossario.value = ''
      showAllTerms()
    }
  })

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

    // Verificar cada termo
    termos.forEach(termo => {
      const dt = termo.querySelector('dt')
      const dd = termo.querySelector('dd')

      if (!dt || !dd) return

      const termText = normalizeText(dt.textContent)
      const definitionText = normalizeText(dd.textContent)

      // Verificar se o termo ou a definição contém o texto de pesquisa
      if (
        termText.includes(normalizedSearch) ||
        definitionText.includes(normalizedSearch)
      ) {
        termo.classList.add('pesquisa-resultado')
        termo.classList.remove('pesquisa-oculto')
        highlightMatchingText(dt, searchTerm)
        highlightMatchingText(dd, searchTerm)
        foundCount++
      } else {
        termo.classList.remove('pesquisa-resultado')
        termo.classList.add('pesquisa-oculto')
        removeHighlighting(dt)
        removeHighlighting(dd)
      }
    })

    // Atualizar visibilidade das categorias
    updateCategoriesVisibility()

    // Mostrar mensagem se nenhum resultado for encontrado
    if (foundCount === 0) {
      showNoResultsMessage(searchTerm)
    } else {
      removeNoResultsMessage()
    }
  }

  /**
   * Mostra todos os termos (limpa a pesquisa)
   */
  function showAllTerms() {
    // Mostrar todos os termos
    termos.forEach(termo => {
      termo.classList.remove('pesquisa-resultado')
      termo.classList.remove('pesquisa-oculto')

      const dt = termo.querySelector('dt')
      const dd = termo.querySelector('dd')

      if (dt) removeHighlighting(dt)
      if (dd) removeHighlighting(dd)
    })

    // Mostrar todas as categorias
    categorias.forEach(categoria => {
      categoria.classList.remove('categoria-vazia')
    })

    // Remover mensagem "nenhum resultado"
    removeNoResultsMessage()
  }

  /**
   * Atualiza a visibilidade das categorias de acordo com os resultados
   */
  function updateCategoriesVisibility() {
    categorias.forEach(categoria => {
      const visibleTerms = categoria.querySelectorAll(
        '.termo-container:not(.pesquisa-oculto)'
      )

      if (visibleTerms.length === 0) {
        categoria.classList.add('categoria-vazia')
      } else {
        categoria.classList.remove('categoria-vazia')
      }
    })
  }

  /**
   * Mostra mensagem de nenhum resultado encontrado
   * @param {string} searchTerm - Termo pesquisado
   */
  function showNoResultsMessage(searchTerm) {
    removeNoResultsMessage()

    const glossarioIntroducao = document.querySelector('.glossario-introducao')

    if (glossarioIntroducao) {
      const noResultsMessage = document.createElement('p')
      noResultsMessage.className = 'sem-resultados'
      noResultsMessage.innerHTML = `Nenhum resultado encontrado para "<strong>${searchTerm}</strong>". Tente termos mais gerais ou verifique a ortografia.`

      glossarioIntroducao.parentNode.insertBefore(
        noResultsMessage,
        glossarioIntroducao.nextSibling
      )
    }
  }

  /**
   * Remove a mensagem de nenhum resultado
   */
  function removeNoResultsMessage() {
    const noResultsMessage = document.querySelector('.sem-resultados')

    if (noResultsMessage && noResultsMessage.parentNode) {
      noResultsMessage.parentNode.removeChild(noResultsMessage)
    }
  }

  /**
   * Destaca o texto correspondente à pesquisa
   * @param {Element} element - Elemento contendo o texto
   * @param {string} searchTerm - Termo de pesquisa
   */
  function highlightMatchingText(element, searchTerm) {
    if (!element || !searchTerm) return

    const originalText = element.textContent

    // Escapar caracteres especiais de regex
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Criar regex para pesquisa case insensitive
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')

    // Substituir ocorrências com spans destacados
    const highlightedText = originalText.replace(regex, '<mark>$1</mark>')

    // Atualizar o conteúdo
    element.innerHTML = highlightedText
  }

  /**
   * Remove o destaque do texto
   * @param {Element} element - Elemento com texto destacado
   */
  function removeHighlighting(element) {
    if (!element) return

    // Restaurar o texto original (sem marcações)
    const originalText = element.textContent
    element.textContent = originalText
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
}
