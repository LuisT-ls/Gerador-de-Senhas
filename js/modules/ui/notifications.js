// notifications.js - Sistema de notificações

/**
 * Inicializa o sistema de notificações
 */
export function initNotifications() {
  // Criar o container se não existir
  const notificationsContainer = document.getElementById('notificacoes')

  // Limpar notificações ao carregar a página
  clearAllNotifications()
}

/**
 * Exibe uma notificação
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de notificação: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duração em ms (0 para não desaparecer)
 */
export function showNotification(message, type = 'info', duration = 4000) {
  const notificationsContainer = document.getElementById('notificacoes')

  if (!notificationsContainer) return

  // Criar elemento de notificação
  const notification = document.createElement('div')
  notification.className = `notificacao ${type}`

  // Gerar ID único
  const notificationId = 'notification-' + Date.now()
  notification.id = notificationId

  // Configurar ícone baseado no tipo
  let icon = ''
  switch (type) {
    case 'success':
      icon = 'check_circle'
      break
    case 'error':
      icon = 'error'
      break
    case 'warning':
      icon = 'warning'
      break
    default:
      icon = 'info'
  }

  // Criar conteúdo
  notification.innerHTML = `
    <span class="material-icons" aria-hidden="true">${icon}</span>
    <p>${message}</p>
    <button type="button" class="fechar-notificacao" aria-label="Fechar notificação">
      <span class="material-icons" aria-hidden="true">close</span>
    </button>
  `

  // Adicionar ao container
  notificationsContainer.appendChild(notification)

  // Adicionar evento para fechar
  const closeButton = notification.querySelector('.fechar-notificacao')
  closeButton.addEventListener('click', () => {
    closeNotification(notificationId)
  })

  // Adicionar animação de entrada
  setTimeout(() => {
    notification.classList.add('visivel')
  }, 10)

  // Configurar remoção automática após o tempo definido
  if (duration > 0) {
    setTimeout(() => {
      closeNotification(notificationId)
    }, duration)
  }

  return notificationId
}

/**
 * Fecha uma notificação específica
 * @param {string} id - ID da notificação a fechar
 */
export function closeNotification(id) {
  const notification = document.getElementById(id)

  if (!notification) return

  // Adicionar classe para animar a saída
  notification.classList.remove('visivel')
  notification.classList.add('saindo')

  // Remover após a animação
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

/**
 * Limpa todas as notificações
 */
export function clearAllNotifications() {
  const notificationsContainer = document.getElementById('notificacoes')

  if (!notificationsContainer) return

  // Remover todas as notificações
  while (notificationsContainer.firstChild) {
    notificationsContainer.removeChild(notificationsContainer.firstChild)
  }
}
