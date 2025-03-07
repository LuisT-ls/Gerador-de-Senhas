// modals.js - Controle dos diálogos modais

/**
 * Inicializa os diálogos modais
 */
export function initModals() {
  // Adicionar suporte a fechamento com ESC para todos os modais
  const dialogs = document.querySelectorAll('dialog')

  dialogs.forEach(dialog => {
    // Fechar com ESC
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        dialog.close()
      }
    })

    // Fechar ao clicar fora (exceto para modais de confirmação)
    if (!dialog.id.includes('Confirmacao')) {
      dialog.addEventListener('click', event => {
        // Verificar se o clique foi fora do conteúdo do modal
        const rect = dialog.getBoundingClientRect()
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width

        if (!isInDialog) {
          dialog.close()
        }
      })
    }
  })

  // Eventos para modais específicos
  setupDicasModal()
  setupModalConfirmacao()
}

/**
 * Configura o modal de dicas
 */
function setupDicasModal() {
  const modalDicas = document.getElementById('modalDicas')
  const fecharDicas = document.getElementById('fecharDicas')

  if (modalDicas && fecharDicas) {
    fecharDicas.addEventListener('click', () => {
      modalDicas.close()
    })
  }
}

/**
 * Configura o modal de confirmação
 */
function setupModalConfirmacao() {
  const modalConfirmacao = document.getElementById('modalConfirmacao')
  const cancelarConfirmacao = document.getElementById('cancelarConfirmacao')

  if (modalConfirmacao && cancelarConfirmacao) {
    cancelarConfirmacao.addEventListener('click', () => {
      modalConfirmacao.close()
    })

    // Evitar fechar ao clicar no backdrop
    modalConfirmacao.addEventListener('click', event => {
      event.stopPropagation()
    })
  }
}

/**
 * Abre um modal de confirmação com mensagem e callbacks personalizados
 * @param {string} message - Mensagem a ser exibida
 * @param {Function} onConfirm - Callback para confirmação
 * @param {Function} onCancel - Callback para cancelamento
 */
export function showConfirmationModal(message, onConfirm, onCancel = null) {
  const modalConfirmacao = document.getElementById('modalConfirmacao')
  const mensagemConfirmacao = document.getElementById('mensagemConfirmacao')
  const confirmarAcao = document.getElementById('confirmarAcao')
  const cancelarConfirmacao = document.getElementById('cancelarConfirmacao')

  if (!modalConfirmacao || !mensagemConfirmacao) return

  // Definir a mensagem
  mensagemConfirmacao.textContent = message

  // Configurar callbacks
  confirmarAcao.onclick = () => {
    if (onConfirm) onConfirm()
    modalConfirmacao.close()
  }

  cancelarConfirmacao.onclick = () => {
    if (onCancel) onCancel()
    modalConfirmacao.close()
  }

  // Abrir o modal
  modalConfirmacao.showModal()
}
