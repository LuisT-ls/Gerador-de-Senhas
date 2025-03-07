// multipleGen.js - Controle do gerador de múltiplas senhas

import { generateMultiplePasswords } from '../core/generator.js'
import { copyToClipboard } from '../core/utils.js'
import { showNotification } from '../ui/notifications.js'
import { addPasswordToHistory } from '../storage/history.js'

/**
 * Inicializa o gerador de múltiplas senhas
 */
export function initMultipleGenerator() {
  // Referências DOM
  const generateMultipleButton = document.getElementById('gerarMultiplas')
  const senhasMultiplasContainer = document.getElementById('senhasMultiplas')
  const senhasGrid = senhasMultiplasContainer.querySelector('.senhas-grid')
  const cancelMultiplasButton = document.getElementById('cancelarMultiplas')
  const formMultiplas = document.getElementById('formMultiplasSenhas')
  const modalMultiplas = document.getElementById('modalMultiplas')

  // Evento para abrir o modal de múltiplas senhas
  generateMultipleButton.addEventListener('click', () => {
    modalMultiplas.showModal()
  })

  // Evento para cancelar
  cancelMultiplasButton.addEventListener('click', () => {
    modalMultiplas.close()
  })

  // Evento para submeter o formulário
  formMultiplas.addEventListener('submit', event => {
    event.preventDefault()

    const quantityInput = document.getElementById('quantidadeSenhas')
    const quantity = parseInt(quantityInput.value) || 5

    // Limitar a quantidade entre 2 e 20
    const validQuantity = Math.max(2, Math.min(20, quantity))

    // Obter as opções de geração atuais
    const options = {
      length: parseInt(document.getElementById('comprimento').value),
      uppercase: document.getElementById('incluirMaiusculas').checked,
      lowercase: document.getElementById('incluirMinusculas').checked,
      numbers: document.getElementById('incluirNumeros').checked,
      symbols: document.getElementById('incluirSimbolos').checked,
      excludeAmbiguous: document.getElementById('excluirAmbiguos').checked,
      excludeRepeating: document.getElementById('excluirRepetidos').checked,
      startWithUppercase: document.getElementById('iniciaMaiuscula').checked,
      endWithNumber: document.getElementById('terminaNumero').checked
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
    }

    // Gerar as senhas
    const passwords = generateMultiplePasswords(validQuantity, options)

    // Exibir as senhas
    displayMultiplePasswords(passwords)

    // Fechar o modal
    modalMultiplas.close()
  })

  /**
   * Exibe as múltiplas senhas na interface
   * @param {Array<string>} passwords - Array de senhas geradas
   */
  function displayMultiplePasswords(passwords) {
    // Limpar o grid
    senhasGrid.innerHTML = ''

    // Adicionar cada senha
    passwords.forEach((password, index) => {
      const passwordCard = document.createElement('div')
      passwordCard.className = 'senha-card'

      const passwordNumber = document.createElement('span')
      passwordNumber.className = 'senha-numero'
      passwordNumber.textContent = `#${index + 1}`

      const passwordDisplay = document.createElement('div')
      passwordDisplay.className = 'senha-display'

      const passwordInput = document.createElement('input')
      passwordInput.type = 'text'
      passwordInput.value = password
      passwordInput.readOnly = true

      const passwordActions = document.createElement('div')
      passwordActions.className = 'senha-acoes'

      const copyButton = document.createElement('button')
      copyButton.type = 'button'
      copyButton.className = 'btn-icon'
      copyButton.innerHTML = '<span class="material-icons">content_copy</span>'
      copyButton.setAttribute('title', 'Copiar senha')
      copyButton.setAttribute('aria-label', 'Copiar senha')

      const useButton = document.createElement('button')
      useButton.type = 'button'
      useButton.className = 'btn-icon'
      useButton.innerHTML = '<span class="material-icons">check_circle</span>'
      useButton.setAttribute('title', 'Usar esta senha')
      useButton.setAttribute('aria-label', 'Usar esta senha')

      // Adicionar eventos
      copyButton.addEventListener('click', async () => {
        const success = await copyToClipboard(password)
        if (success) {
          showNotification(
            'Senha copiada para a área de transferência',
            'success'
          )
        }
      })

      useButton.addEventListener('click', () => {
        const mainPasswordField = document.getElementById('senhaGerada')
        mainPasswordField.value = password

        // Acionar o evento de verificação de força
        const event = new Event('input', { bubbles: true })
        mainPasswordField.dispatchEvent(event)

        // Adicionar ao histórico
        addPasswordToHistory(password)

        // Fechar a área de múltiplas senhas
        senhasMultiplasContainer.classList.add('hidden')

        showNotification('Senha selecionada', 'success')
      })

      // Montar o card
      passwordActions.appendChild(copyButton)
      passwordActions.appendChild(useButton)

      passwordDisplay.appendChild(passwordInput)
      passwordDisplay.appendChild(passwordActions)

      passwordCard.appendChild(passwordNumber)
      passwordCard.appendChild(passwordDisplay)

      senhasGrid.appendChild(passwordCard)
    })

    // Mostrar o container
    senhasMultiplasContainer.classList.remove('hidden')

    // Rolar até o container
    senhasMultiplasContainer.scrollIntoView({ behavior: 'smooth' })
  }
}
