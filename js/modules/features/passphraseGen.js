// passphraseGen.js - Controle do gerador de passphrase

import { generatePassphrase } from '../core/generator.js'
import { copyToClipboard } from '../core/utils.js'
import { showNotification } from '../ui/notifications.js'
import { addPasswordToHistory } from '../storage/history.js'

/**
 * Inicializa o gerador de passphrase
 */
export function initPassphraseGenerator() {
  // Referências DOM
  const numeroPalavras = document.getElementById('numeropalavras')
  const palavrasValor = document.getElementById('palavrasValor')
  const separador = document.getElementById('separador')
  const capitalizarPalavras = document.getElementById('capitalizarPalavras')
  const adicionarNumeros = document.getElementById('adicionarNumeros')
  const gerarPassphraseButton = document.getElementById('gerarPassphrase')
  const passphraseResultado = document.getElementById('passphraseResultado')
  const passphraseTexto = document.getElementById('passphraseTexto')
  const copiarPassphraseButton = document.getElementById('copiarPassphrase')

  // Atualizar valor exibido do número de palavras
  numeroPalavras.addEventListener('input', () => {
    palavrasValor.textContent = numeroPalavras.value
  })

  // Gerar passphrase
  gerarPassphraseButton.addEventListener('click', () => {
    // Obter opções
    const options = {
      wordCount: parseInt(numeroPalavras.value),
      separator: separador.value,
      capitalize: capitalizarPalavras.checked,
      addNumbers: adicionarNumeros.checked
    }

    // Gerar passphrase
    const passphrase = generatePassphrase(options)

    // Exibir passphrase
    passphraseTexto.textContent = passphrase
    passphraseResultado.classList.remove('hidden')

    // Adicionar ao histórico
    addPasswordToHistory(passphrase, 'Passphrase')

    // Rolar até o resultado
    passphraseResultado.scrollIntoView({ behavior: 'smooth' })
  })

  // Copiar passphrase
  copiarPassphraseButton.addEventListener('click', async () => {
    const passphrase = passphraseTexto.textContent

    if (passphrase) {
      const success = await copyToClipboard(passphrase)

      if (success) {
        showNotification(
          'Passphrase copiada para a área de transferência',
          'success'
        )
      } else {
        showNotification('Não foi possível copiar a passphrase', 'error')
      }
    }
  })

  // Verificar se o resultado precisa ser mostrado inicialmente
  if (passphraseTexto.textContent.trim() !== '') {
    passphraseResultado.classList.remove('hidden')
  }
}
