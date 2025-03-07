// analyzer.js - Controle da interface do analisador de senhas

import { fullPasswordAnalysis } from '../core/analyzer.js'
import { showNotification } from '../ui/notifications.js'

/**
 * Inicializa o analisador de senhas
 */
export function initPasswordAnalyzer() {
  // Referências DOM
  const senhaTesteInput = document.getElementById('senhaTeste')
  const verSenhaTesteButton = document.getElementById('verSenhaTeste')
  const testarForcaButton = document.getElementById('testarForca')
  const resultadoAnalise = document.getElementById('resultadoAnalise')
  const forcaAnalise = document.getElementById('forcaAnalise')
  const detalhesAnalise = document.getElementById('detalhesAnalise')

  // Mostrar/ocultar senha
  verSenhaTesteButton.addEventListener('click', () => {
    if (senhaTesteInput.type === 'password') {
      senhaTesteInput.type = 'text'
      verSenhaTesteButton.querySelector('.material-icons').textContent =
        'visibility_off'
    } else {
      senhaTesteInput.type = 'password'
      verSenhaTesteButton.querySelector('.material-icons').textContent =
        'visibility'
    }
  })

  // Analisar senha quando o botão for clicado
  testarForcaButton.addEventListener('click', async () => {
    const password = senhaTesteInput.value

    if (!password) {
      showNotification('Digite uma senha para analisar', 'warning')
      return
    }

    // Mostrar indicador de carregamento
    testarForcaButton.disabled = true
    testarForcaButton.innerHTML =
      '<span class="material-icons loading">sync</span> Analisando...'

    try {
      // Analisar a senha
      const analysis = await fullPasswordAnalysis(password)

      // Exibir o resultado
      displayAnalysisResult(analysis)
    } catch (error) {
      console.error('Erro ao analisar senha:', error)
      showNotification('Ocorreu um erro ao analisar a senha', 'error')
    } finally {
      // Restaurar o botão
      testarForcaButton.disabled = false
      testarForcaButton.innerHTML =
        '<span class="material-icons">check_circle</span> Analisar Senha'
    }
  })

  /**
   * Exibe o resultado da análise na interface
   * @param {Object} analysis - Resultado da análise da senha
   */
  function displayAnalysisResult(analysis) {
    // Construir a barra de força
    let strengthLabel = ''
    let strengthClass = ''

    switch (analysis.strength) {
      case 'muito-fraca':
        strengthLabel = 'Muito Fraca'
        strengthClass = 'muito-fraca'
        break
      case 'fraca':
        strengthLabel = 'Fraca'
        strengthClass = 'fraca'
        break
      case 'media':
        strengthLabel = 'Média'
        strengthClass = 'media'
        break
      case 'forte':
        strengthLabel = 'Forte'
        strengthClass = 'forte'
        break
      case 'muito-forte':
        strengthLabel = 'Muito Forte'
        strengthClass = 'muito-forte'
        break
    }

    // Construir o HTML da barra de força
    forcaAnalise.innerHTML = `
      <div class="forca-container">
        <div class="barra-progresso" data-strength="${analysis.strength}">
          <div class="barra-valor" style="width: ${Math.min(
            100,
            analysis.entropy
          )}%"></div>
        </div>
        <p class="forca-valor ${strengthClass}">${strengthLabel}</p>
        <p class="forca-info">Entropia: ${analysis.entropy} bits</p>
        <p class="forca-info">Tempo estimado para quebrar: ${
          analysis.crackTime
        }</p>
      </div>
    `

    // Construir detalhes da análise
    let detailsHTML = '<div class="analise-detalhes">'

    // Adicionar aviso se a senha foi comprometida
    if (analysis.isCompromised) {
      detailsHTML += `
        <div class="aviso-compromisso">
          <span class="material-icons">warning</span>
          <p>Esta senha foi encontrada em vazamentos de dados e não é segura!</p>
        </div>
      `
    }

    // Adicionar aviso se a senha contém informações pessoais
    if (analysis.hasPersonalInfo) {
      detailsHTML += `
        <div class="aviso-info-pessoal">
          <span class="material-icons">person</span>
          <p>A senha parece conter informações pessoais, o que reduz a segurança.</p>
        </div>
      `
    }

    // Feedback e sugestões
    detailsHTML += '<h4>Análise Detalhada</h4><ul class="analise-lista">'

    // Adicionar itens de feedback
    analysis.feedback.forEach(item => {
      detailsHTML += `<li class="${item.type}">${item.message}</li>`
    })

    detailsHTML += '</ul>'

    // Sugestões para melhorar
    if (analysis.suggestions && analysis.suggestions.length > 0) {
      detailsHTML +=
        '<h4>Sugestões para Melhorar</h4><ul class="sugestoes-lista">'

      analysis.suggestions.forEach(suggestion => {
        detailsHTML += `<li>${suggestion}</li>`
      })

      detailsHTML += '</ul>'
    }

    detailsHTML += '</div>'

    // Atualizar o conteúdo
    detalhesAnalise.innerHTML = detailsHTML

    // Mostrar o resultado
    resultadoAnalise.classList.remove('hidden')

    // Rolar até o resultado
    resultadoAnalise.scrollIntoView({ behavior: 'smooth' })
  }

  // Analisar senha quando pressionar Enter no campo
  senhaTesteInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      testarForcaButton.click()
    }
  })
}
