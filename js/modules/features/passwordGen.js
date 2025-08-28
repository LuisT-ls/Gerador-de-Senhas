// passwordGen.js - Controle do gerador de senha principal

import { generatePassword } from '../core/generator.js'
import { analyzePassword } from '../core/entropy.js'
import { copyToClipboard } from '../core/utils.js'
import { showNotification } from '../ui/notifications.js'
import { addPasswordToHistory } from '../storage/history.js'

/**
 * Inicializa o gerador de senhas principal
 */
export function initPasswordGenerator() {
  // Referências DOM
  const lengthSlider = document.getElementById('comprimento')
  const lengthOutput = document.getElementById('comprimentoValor')
  const includeUppercase = document.getElementById('incluirMaiusculas')
  const includeLowercase = document.getElementById('incluirMinusculas')
  const includeNumbers = document.getElementById('incluirNumeros')
  const includeSymbols = document.getElementById('incluirSimbolos')
  const excludeAmbiguous = document.getElementById('excluirAmbiguos')
  const excludeRepeating = document.getElementById('excluirRepetidos')
  const startWithUppercase = document.getElementById('iniciaMaiuscula')
  const endWithNumber = document.getElementById('terminaNumero')

  const generateButton = document.getElementById('gerarSenha')
  const passwordField = document.getElementById('senhaGerada')
  const viewPasswordButton = document.getElementById('verSenha')
  const refreshPasswordButton = document.getElementById('atualizarSenha')
  const copyPasswordButton = document.getElementById('copiarSenha')
  const savePasswordButton = document.getElementById('salvarSenha')

  const strengthBar = document.querySelector('.barra-progresso')
  const strengthFeedback = document.getElementById('feedbackForca')
  const securityAnalysisList = document.getElementById('analiseSeguranca')

  // Verificar se os elementos existem
  if (!strengthBar) {
    console.error('Elemento .barra-progresso não encontrado')
  }
  if (!strengthFeedback) {
    console.error('Elemento #feedbackForca não encontrado')
  }
  if (!securityAnalysisList) {
    console.error('Elemento #analiseSeguranca não encontrado')
  }

  // Variável para controlar o temporizador de delay
  let sliderTimeout = null

  // Atualizar valor do comprimento
  lengthSlider.addEventListener('input', () => {
    // Atualizar o valor exibido imediatamente
    lengthOutput.textContent = lengthSlider.value

    // Gerar nova senha sem adicionar ao histórico
    generateAndDisplayPassword(false)
  })

  // Quando o usuário terminar de ajustar o slider, adicionar ao histórico
  lengthSlider.addEventListener('change', () => {
    // Adicionar a senha final ao histórico
    const password = passwordField.value
    if (password) {
      addPasswordToHistory(password)
    }
  })

  // Adicionar event listeners para todas as opções de checkbox
  const optionElements = [
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    excludeRepeating,
    startWithUppercase,
    endWithNumber
  ]

  optionElements.forEach(element => {
    element.addEventListener('change', () => {
      // Quando mudar qualquer opção, gerar senha e adicionar ao histórico
      generateAndDisplayPassword(true)
    })
  })

  // Gerar senha quando o botão for clicado (sempre adiciona ao histórico)
  generateButton.addEventListener('click', () => {
    generateAndDisplayPassword(true)
  })

  // Atualizar senha
  refreshPasswordButton.addEventListener('click', () => {
    generateAndDisplayPassword(true)
  })

  // Mostrar/esconder senha
  viewPasswordButton.addEventListener('click', () => {
    if (passwordField.type === 'password') {
      passwordField.type = 'text'
      viewPasswordButton.querySelector('.material-icons').textContent =
        'visibility_off'
    } else {
      passwordField.type = 'password'
      viewPasswordButton.querySelector('.material-icons').textContent =
        'visibility'
    }
  })

  // Copiar senha
  copyPasswordButton.addEventListener('click', async () => {
    const password = passwordField.value
    if (password) {
      const success = await copyToClipboard(password)
      if (success) {
        showNotification(
          'Senha copiada para a área de transferência',
          'success'
        )
      } else {
        showNotification('Não foi possível copiar a senha', 'error')
      }
    }
  })

  // Salvar senha - abre o modal de salvamento
  savePasswordButton.addEventListener('click', () => {
    const password = passwordField.value
    if (password) {
      document.getElementById('modalSalvar').showModal()
    } else {
      showNotification('Gere uma senha primeiro', 'warning')
    }
  })

  /**
   * Gera e exibe uma senha
   * @param {boolean} addToHistory - Se verdadeiro, adiciona a senha ao histórico
   */
  function generateAndDisplayPassword(addToHistory = true) {
    // Obter opções da interface
    const options = {
      length: parseInt(lengthSlider.value),
      uppercase: includeUppercase.checked,
      lowercase: includeLowercase.checked,
      numbers: includeNumbers.checked,
      symbols: includeSymbols.checked,
      excludeAmbiguous: excludeAmbiguous.checked,
      excludeRepeating: excludeRepeating.checked,
      startWithUppercase: startWithUppercase.checked,
      endWithNumber: endWithNumber.checked
    }

    // Verificar se pelo menos um tipo de caractere foi selecionado
    if (
      !options.uppercase &&
      !options.lowercase &&
      !options.numbers &&
      !options.symbols
    ) {
      showNotification('Selecione pelo menos um tipo de caractere', 'warning')
      options.lowercase = true // Fallback para letras minúsculas
      includeLowercase.checked = true // Atualizar UI
    }

    // Gerar a senha
    const password = generatePassword(options)

    // Exibir a senha
    passwordField.value = password

    // Analisar a força da senha
    updatePasswordStrength(password)

    // Adicionar ao histórico apenas se solicitado
    if (addToHistory) {
      addPasswordToHistory(password)
    }
  }

  // Função para atualizar os indicadores de força da senha
  function updatePasswordStrength(password) {
    if (!password) return

    // Obter análise da senha
    const analysis = analyzePassword(password)

    // Atualizar barra de progresso
    strengthBar.setAttribute('data-strength', analysis.strength)

    // Atualizar texto de feedback
    let strengthText = ''
    switch (analysis.strength) {
      case 'muito-fraca':
        strengthText = 'Muito Fraca'
        break
      case 'fraca':
        strengthText = 'Fraca'
        break
      case 'media':
        strengthText = 'Média'
        break
      case 'forte':
        strengthText = 'Forte'
        break
      case 'muito-forte':
        strengthText = 'Muito Forte'
        break
    }
    strengthFeedback.textContent = `Força ${strengthText}`

    // Atualizar lista de análise de segurança
    securityAnalysisList.innerHTML = ''

    analysis.feedback.forEach(item => {
      const listItem = document.createElement('li')
      listItem.className = item.type
      listItem.textContent = item.message
      securityAnalysisList.appendChild(listItem)
    })
  }

  // Gerar uma senha inicial quando a página carrega
  generateAndDisplayPassword(true)
}
