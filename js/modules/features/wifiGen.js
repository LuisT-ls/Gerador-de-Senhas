// wifiGen.js - Controle do gerador de senhas para Wi-Fi

import { generateWifiPassword } from '../core/generator.js'
import { copyToClipboard } from '../core/utils.js'
import { showNotification } from '../ui/notifications.js'
import { addPasswordToHistory } from '../storage/history.js'

/**
 * Inicializa o gerador de senhas para Wi-Fi
 */
export function initWifiGenerator() {
  // Referências DOM
  const comprimentoWifi = document.getElementById('comprimentoWifi')
  const wifiValor = document.getElementById('wifiValor')
  const wifiMemorizavel = document.getElementById('wifiMemorizavel')
  const gerarSenhaWifi = document.getElementById('gerarSenhaWifi')
  const senhaWifiResultado = document.getElementById('senhaWifiResultado')
  const senhaWifiTexto = document.getElementById('senhaWifiTexto')
  const copiarSenhaWifi = document.getElementById('copiarSenhaWifi')

  // Atualizar valor exibido do comprimento
  comprimentoWifi.addEventListener('input', () => {
    wifiValor.textContent = comprimentoWifi.value
  })

  // Gerar senha Wi-Fi
  gerarSenhaWifi.addEventListener('click', () => {
    // Obter opções
    const options = {
      length: parseInt(comprimentoWifi.value),
      memorable: wifiMemorizavel.checked
    }

    // Gerar senha
    const password = generateWifiPassword(options)

    // Exibir senha
    senhaWifiTexto.textContent = password
    senhaWifiResultado.classList.remove('hidden')

    // Adicionar ao histórico
    addPasswordToHistory(password, 'Wi-Fi')

    // Rolar até o resultado
    senhaWifiResultado.scrollIntoView({ behavior: 'smooth' })
  })

  // Copiar senha
  copiarSenhaWifi.addEventListener('click', async () => {
    const password = senhaWifiTexto.textContent

    if (password) {
      const success = await copyToClipboard(password)

      if (success) {
        showNotification(
          'Senha Wi-Fi copiada para a área de transferência',
          'success'
        )
      } else {
        showNotification('Não foi possível copiar a senha', 'error')
      }
    }
  })

  // Verificar se o resultado precisa ser mostrado inicialmente
  if (senhaWifiTexto.textContent.trim() !== '') {
    senhaWifiResultado.classList.remove('hidden')
  }
}
