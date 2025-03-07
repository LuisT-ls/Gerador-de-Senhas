// pinGen.js - Controle do gerador de PIN numérico

import { generatePIN } from '../core/generator.js'
import { copyToClipboard } from '../core/utils.js'
import { showNotification } from '../ui/notifications.js'
import { addPasswordToHistory } from '../storage/history.js'

/**
 * Inicializa o gerador de PIN
 */
export function initPinGenerator() {
  // Referências DOM
  const comprimentoPin = document.getElementById('comprimentoPin')
  const evitarSequencias = document.getElementById('evitarSequencias')
  const evitarRepeticoes = document.getElementById('evitarRepeticoes')
  const gerarPinButton = document.getElementById('gerarPin')
  const pinResultado = document.getElementById('pinResultado')
  const pinGerado = document.getElementById('pinGerado')
  const copiarPinButton = document.getElementById('copiarPin')

  // Gerar PIN
  gerarPinButton.addEventListener('click', () => {
    // Obter opções
    const options = {
      length: parseInt(comprimentoPin.value),
      avoidSequences: evitarSequencias.checked,
      avoidRepeating: evitarRepeticoes.checked
    }

    // Gerar PIN
    const pin = generatePIN(options)

    // Exibir PIN com formatação
    pinGerado.textContent = formatPIN(pin)
    pinResultado.classList.remove('hidden')

    // Adicionar ao histórico
    addPasswordToHistory(pin, 'PIN')

    // Rolar até o resultado
    pinResultado.scrollIntoView({ behavior: 'smooth' })
  })

  // Copiar PIN
  copiarPinButton.addEventListener('click', async () => {
    // Remover espaços ao copiar
    const pin = pinGerado.textContent.replace(/\s/g, '')

    if (pin) {
      const success = await copyToClipboard(pin)

      if (success) {
        showNotification('PIN copiado para a área de transferência', 'success')
      } else {
        showNotification('Não foi possível copiar o PIN', 'error')
      }
    }
  })

  /**
   * Formata o PIN para melhor legibilidade
   * @param {string} pin - PIN original
   * @returns {string} PIN formatado
   */
  function formatPIN(pin) {
    // Formatação baseada no comprimento
    if (pin.length <= 4) {
      return pin // 1234
    } else if (pin.length <= 6) {
      return pin.slice(0, 3) + ' ' + pin.slice(3) // 123 456
    } else if (pin.length <= 8) {
      return pin.slice(0, 4) + ' ' + pin.slice(4) // 1234 5678
    } else {
      // Para PINs maiores, agrupar em blocos de 3 ou 4
      return pin.match(/.{1,3}/g).join(' ') // 123 456 789
    }
  }

  // Verificar se o resultado precisa ser mostrado inicialmente
  if (pinGerado.textContent.trim() !== '') {
    pinResultado.classList.remove('hidden')
  }
}
