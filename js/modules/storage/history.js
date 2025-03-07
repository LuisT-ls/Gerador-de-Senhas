// history.js - Gerenciamento do histórico de senhas geradas

import {
  formatDate,
  copyToClipboard,
  truncateString,
  escapeHTML
} from '../core/utils.js'
import { showNotification } from '../ui/notifications.js'

// Nome da chave no localStorage
const PASSWORD_HISTORY_KEY = 'passwordHistory'
// Número máximo de senhas no histórico
const MAX_HISTORY_SIZE = 50

/**
 * Inicializa o gerenciador de histórico
 */
export function initHistoryManager() {
  // Referências DOM
  const historicoContagem = document.getElementById('historicoContagem')
  const listaSenhas = document.getElementById('listaSenhas')
  const limparHistorico = document.getElementById('limparHistorico')
  const modalConfirmacao = document.getElementById('modalConfirmacao')

  // Evento para limpar histórico
  limparHistorico.addEventListener('click', () => {
    // Configurar o modal de confirmação
    document.getElementById('mensagemConfirmacao').textContent =
      'Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.'

    // Configurar o callback de confirmação
    document.getElementById('confirmarAcao').onclick = () => {
      // Limpar o histórico
      localStorage.removeItem(PASSWORD_HISTORY_KEY)

      // Atualizar a interface
      renderPasswordHistory()

      // Fechar o modal
      modalConfirmacao.close()

      // Exibir notificação
      showNotification('Histórico de senhas limpo', 'success')
    }

    // Configurar o callback de cancelamento
    document.getElementById('cancelarConfirmacao').onclick = () => {
      modalConfirmacao.close()
    }

    // Abrir o modal
    modalConfirmacao.showModal()
  })

  // Renderizar histórico inicial
  renderPasswordHistory()

  /**
   * Renderiza o histórico de senhas na interface
   */
  function renderPasswordHistory() {
    // Obter histórico
    const history = getPasswordHistory()

    // Atualizar contagem
    historicoContagem.innerHTML = `Senhas geradas recentemente: <strong>${history.length}</strong>`

    // Verificar se há histórico
    if (history.length === 0) {
      listaSenhas.innerHTML = `
        <p class="empty-state">
          Nenhuma senha no histórico. Gere senhas para vê-las aqui.
        </p>
      `
      return
    }

    // Criar a lista de senhas
    let html = ''

    // Classificar por data mais recente
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp)

    // Adicionar cada senha
    sortedHistory.forEach(item => {
      const date = formatDate(item.timestamp)
      const truncatedPassword = truncateString(item.password, 18)
      const typeLabel = item.type
        ? `<span class="senha-tipo">${escapeHTML(item.type)}</span>`
        : ''

      html += `
        <li class="senha-item">
          <div class="senha-info">
            <div class="senha-texto">
              <span class="senha-valor">${escapeHTML(truncatedPassword)}</span>
              ${typeLabel}
            </div>
            <span class="senha-data">${date}</span>
          </div>
          <div class="senha-acoes">
            <button type="button" class="btn-icon usar-senha" 
                    aria-label="Usar esta senha" title="Usar esta senha"
                    data-password="${escapeHTML(item.password)}">
              <span class="material-icons" aria-hidden="true">check_circle</span>
            </button>
            <button type="button" class="btn-icon copiar-senha" 
                    aria-label="Copiar senha" title="Copiar senha"
                    data-password="${escapeHTML(item.password)}">
              <span class="material-icons" aria-hidden="true">content_copy</span>
            </button>
          </div>
        </li>
      `
    })

    // Atualizar o conteúdo
    listaSenhas.innerHTML = html

    // Adicionar eventos aos botões

    // Eventos para usar senha
    document.querySelectorAll('.usar-senha').forEach(button => {
      button.addEventListener('click', () => {
        const password = button.dataset.password

        // Preencher no campo principal
        const mainPasswordField = document.getElementById('senhaGerada')
        mainPasswordField.value = password

        // Mudar para a aba do gerador principal
        document.querySelector('a[href="#geradorPrincipal"]').click()

        // Simular análise de força
        const event = new Event('input', { bubbles: true })
        mainPasswordField.dispatchEvent(event)

        // Notificar o usuário
        showNotification('Senha carregada no gerador principal', 'success')
      })
    })

    // Eventos para copiar senha
    document.querySelectorAll('.copiar-senha').forEach(button => {
      button.addEventListener('click', async () => {
        const password = button.dataset.password

        const success = await copyToClipboard(password)

        if (success) {
          showNotification(
            'Senha copiada para a área de transferência',
            'success'
          )
        } else {
          showNotification('Não foi possível copiar a senha', 'error')
        }
      })
    })
  }
}

/**
 * Adiciona uma senha ao histórico
 * @param {string} password - Senha a adicionar
 * @param {string} type - Tipo de senha (opcional)
 */
export function addPasswordToHistory(password, type = 'Padrão') {
  if (!password) return

  // Obter histórico existente
  const history = getPasswordHistory()

  // Verificar se a senha já existe no histórico
  const existingIndex = history.findIndex(item => item.password === password)

  // Se existir, remover a entrada antiga
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1)
  }

  // Adicionar a nova senha ao início
  history.unshift({
    password,
    type,
    timestamp: Date.now()
  })

  // Limitar o tamanho do histórico
  if (history.length > MAX_HISTORY_SIZE) {
    history.pop()
  }

  // Salvar o histórico atualizado
  localStorage.setItem(PASSWORD_HISTORY_KEY, JSON.stringify(history))

  // Atualizar contador se estiver na aba de histórico
  const historicoContagem = document.getElementById('historicoContagem')
  if (historicoContagem) {
    historicoContagem.innerHTML = `Senhas geradas recentemente: <strong>${history.length}</strong>`
  }
}

/**
 * Obtém o histórico de senhas
 * @returns {Array} Array de senhas no histórico
 */
function getPasswordHistory() {
  const historyJSON = localStorage.getItem(PASSWORD_HISTORY_KEY)
  return historyJSON ? JSON.parse(historyJSON) : []
}
