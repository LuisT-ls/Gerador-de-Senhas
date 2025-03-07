// passwordManager.js - Gerenciamento das senhas salvas

import {
  generateUniqueId,
  formatDate,
  copyToClipboard,
  escapeHTML
} from '../core/utils.js'
import { showNotification } from '../ui/notifications.js'

// Nome da chave no localStorage
const SAVED_PASSWORDS_KEY = 'savedPasswords'

/**
 * Inicializa o gerenciador de senhas
 */
export function initPasswordManager() {
  // Referências DOM
  const modalSalvar = document.getElementById('modalSalvar')
  const formSalvarSenha = document.getElementById('formSalvarSenha')
  const cancelarSalvar = document.getElementById('cancelarSalvar')
  const senhasSalvas = document.getElementById('senhasSalvas')
  const modalDetalhes = document.getElementById('modalDetalhes')
  const modalConfirmacao = document.getElementById('modalConfirmacao')
  const pesquisaSenhas = document.getElementById('pesquisaSenhas')
  const limparSalvas = document.getElementById('limparSalvas')

  // Evento para cancelar salvamento
  cancelarSalvar.addEventListener('click', () => {
    modalSalvar.close()
  })

  // Evento para submeter o formulário de salvamento
  formSalvarSenha.addEventListener('submit', event => {
    event.preventDefault()

    const nomeSenha = document.getElementById('nomeSenha').value.trim()
    const categoriaSenha = document.getElementById('categoriaSenha').value
    const notasSenha = document.getElementById('notasSenha').value.trim()
    const senha = document.getElementById('senhaGerada').value

    if (!nomeSenha) {
      showNotification('Digite um nome para a senha', 'warning')
      return
    }

    if (!senha) {
      showNotification('Gere uma senha primeiro', 'warning')
      return
    }

    // Salvar a senha
    const savedPassword = {
      id: generateUniqueId(),
      name: nomeSenha,
      category: categoriaSenha,
      password: senha,
      notes: notasSenha,
      createdAt: Date.now()
    }

    savePassword(savedPassword)

    // Limpar e fechar o modal
    formSalvarSenha.reset()
    modalSalvar.close()

    // Exibir notificação
    showNotification('Senha salva com sucesso', 'success')

    // Atualizar a lista
    renderSavedPasswords()
  })

  // Evento para pesquisar senhas
  pesquisaSenhas.addEventListener('input', () => {
    renderSavedPasswords()
  })

  // Evento para limpar todas as senhas
  limparSalvas.addEventListener('click', () => {
    // Configurar o modal de confirmação
    document.getElementById('mensagemConfirmacao').textContent =
      'Tem certeza que deseja excluir todas as senhas salvas? Esta ação não pode ser desfeita.'

    // Configurar o callback de confirmação
    document.getElementById('confirmarAcao').onclick = () => {
      // Limpar todas as senhas
      localStorage.removeItem(SAVED_PASSWORDS_KEY)

      // Atualizar a interface
      renderSavedPasswords()

      // Fechar o modal
      modalConfirmacao.close()

      // Exibir notificação
      showNotification('Todas as senhas foram excluídas', 'success')
    }

    // Configurar o callback de cancelamento
    document.getElementById('cancelarConfirmacao').onclick = () => {
      modalConfirmacao.close()
    }

    // Abrir o modal
    modalConfirmacao.showModal()
  })

  // Renderizar senhas salvas inicialmente
  renderSavedPasswords()

  /**
   * Salva uma senha no armazenamento
   * @param {Object} passwordData - Dados da senha a salvar
   */
  function savePassword(passwordData) {
    // Obter senhas existentes
    const savedPasswords = getSavedPasswords()

    // Adicionar a nova senha
    savedPasswords.push(passwordData)

    // Salvar no localStorage
    localStorage.setItem(SAVED_PASSWORDS_KEY, JSON.stringify(savedPasswords))
  }

  /**
   * Obtém as senhas salvas do armazenamento
   * @returns {Array} Array de senhas salvas
   */
  function getSavedPasswords() {
    const savedPasswordsJSON = localStorage.getItem(SAVED_PASSWORDS_KEY)
    return savedPasswordsJSON ? JSON.parse(savedPasswordsJSON) : []
  }

  /**
   * Exclui uma senha do armazenamento
   * @param {string} id - ID da senha a excluir
   */
  function deletePassword(id) {
    // Obter senhas existentes
    const savedPasswords = getSavedPasswords()

    // Filtrar a senha a ser excluída
    const updatedPasswords = savedPasswords.filter(
      password => password.id !== id
    )

    // Salvar a lista atualizada
    localStorage.setItem(SAVED_PASSWORDS_KEY, JSON.stringify(updatedPasswords))
  }

  /**
   * Renderiza as senhas salvas na interface
   */
  function renderSavedPasswords() {
    // Obter senhas
    const savedPasswords = getSavedPasswords()

    // Obter termo de pesquisa
    const searchTerm = pesquisaSenhas.value.toLowerCase()

    // Filtrar senhas pela pesquisa
    const filteredPasswords = savedPasswords.filter(password => {
      return (
        password.name.toLowerCase().includes(searchTerm) ||
        password.category.toLowerCase().includes(searchTerm) ||
        password.notes.toLowerCase().includes(searchTerm)
      )
    })

    // Verificar se há senhas
    if (filteredPasswords.length === 0) {
      // Mostrar estado vazio
      if (searchTerm) {
        senhasSalvas.innerHTML = `
          <p class="empty-state">
            Nenhuma senha encontrada para "${escapeHTML(searchTerm)}".
          </p>
        `
      } else {
        senhasSalvas.innerHTML = `
          <p class="empty-state">
            Nenhuma senha salva. Use o botão
            <span class="material-icons" aria-hidden="true">bookmark</span>
            para salvar senhas.
          </p>
        `
      }
      return
    }

    // Criar a lista de senhas
    let html = '<div class="senha-cards">'

    // Classificar por data mais recente
    const sortedPasswords = [...filteredPasswords].sort(
      (a, b) => b.createdAt - a.createdAt
    )

    // Adicionar cada senha
    sortedPasswords.forEach(password => {
      const categoryIcon = getCategoryIcon(password.category)
      const formattedDate = formatDate(password.createdAt)

      html += `
        <div class="senha-card" data-id="${escapeHTML(password.id)}">
          <div class="senha-header">
            <span class="senha-categoria" title="${escapeHTML(
              password.category
            )}">
              <span class="material-icons" aria-hidden="true">${categoryIcon}</span>
            </span>
            <h3 class="senha-nome">${escapeHTML(password.name)}</h3>
            <span class="senha-data">${formattedDate}</span>
          </div>
          <div class="senha-actions">
            <button type="button" class="btn-icon visualizar-senha" aria-label="Ver detalhes" title="Ver detalhes">
              <span class="material-icons" aria-hidden="true">visibility</span>
            </button>
            <button type="button" class="btn-icon copiar-senha" aria-label="Copiar senha" title="Copiar senha">
              <span class="material-icons" aria-hidden="true">content_copy</span>
            </button>
            <button type="button" class="btn-icon excluir-senha" aria-label="Excluir senha" title="Excluir senha">
              <span class="material-icons" aria-hidden="true">delete</span>
            </button>
          </div>
        </div>
      `
    })

    html += '</div>'

    // Atualizar o conteúdo
    senhasSalvas.innerHTML = html

    // Adicionar eventos aos botões

    // Eventos para visualizar detalhes
    document.querySelectorAll('.visualizar-senha').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.closest('.senha-card').dataset.id
        showPasswordDetails(id)
      })
    })

    // Eventos para copiar senha
    document.querySelectorAll('.copiar-senha').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.closest('.senha-card').dataset.id
        const password = getSavedPasswords().find(p => p.id === id)

        if (password) {
          const success = await copyToClipboard(password.password)

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
    })

    // Eventos para excluir senha
    document.querySelectorAll('.excluir-senha').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.closest('.senha-card').dataset.id
        const password = getSavedPasswords().find(p => p.id === id)

        if (password) {
          // Configurar o modal de confirmação
          document.getElementById(
            'mensagemConfirmacao'
          ).textContent = `Tem certeza que deseja excluir a senha "${password.name}"?`

          // Configurar o callback de confirmação
          document.getElementById('confirmarAcao').onclick = () => {
            // Excluir a senha
            deletePassword(id)

            // Atualizar a interface
            renderSavedPasswords()

            // Fechar o modal
            modalConfirmacao.close()

            // Exibir notificação
            showNotification('Senha excluída com sucesso', 'success')
          }

          // Configurar o callback de cancelamento
          document.getElementById('cancelarConfirmacao').onclick = () => {
            modalConfirmacao.close()
          }

          // Abrir o modal
          modalConfirmacao.showModal()
        }
      })
    })
  }

  /**
   * Exibe os detalhes de uma senha específica
   * @param {string} id - ID da senha a exibir
   */
  function showPasswordDetails(id) {
    // Encontrar a senha pelo ID
    const password = getSavedPasswords().find(p => p.id === id)

    if (!password) return

    // Preencher o modal de detalhes
    document.getElementById('detalheNome').textContent = password.name
    document.getElementById('detalheCategoria').textContent = password.category
    document.getElementById('detalheSenha').value = password.password
    document.getElementById('detalheData').textContent = formatDate(
      password.createdAt
    )
    document.getElementById('detalheNotas').textContent =
      password.notes || 'Nenhuma nota adicional.'

    // Configurar o botão de excluir
    document.getElementById('excluirSenha').onclick = () => {
      // Fechar o modal de detalhes
      modalDetalhes.close()

      // Configurar o modal de confirmação
      document.getElementById(
        'mensagemConfirmacao'
      ).textContent = `Tem certeza que deseja excluir a senha "${password.name}"?`

      // Configurar o callback de confirmação
      document.getElementById('confirmarAcao').onclick = () => {
        // Excluir a senha
        deletePassword(id)

        // Atualizar a interface
        renderSavedPasswords()

        // Fechar o modal
        modalConfirmacao.close()

        // Exibir notificação
        showNotification('Senha excluída com sucesso', 'success')
      }

      // Configurar o callback de cancelamento
      document.getElementById('cancelarConfirmacao').onclick = () => {
        modalConfirmacao.close()

        // Reabrir o modal de detalhes
        modalDetalhes.showModal()
      }

      // Abrir o modal
      modalConfirmacao.showModal()
    }

    // Configurar o botão de copiar
    document.getElementById('copiarSenhaDetalhe').onclick = async () => {
      const success = await copyToClipboard(password.password)

      if (success) {
        showNotification(
          'Senha copiada para a área de transferência',
          'success'
        )
      } else {
        showNotification('Não foi possível copiar a senha', 'error')
      }
    }

    // Configurar o botão de fechar
    document.getElementById('fecharDetalhes').onclick = () => {
      modalDetalhes.close()
    }

    // Configurar o botão de alternar visibilidade
    const toggleButton = document.querySelector(
      '#senhaDetalhes .toggle-visibility'
    )
    const senhaInput = document.getElementById('detalheSenha')

    toggleButton.onclick = () => {
      if (senhaInput.type === 'password') {
        senhaInput.type = 'text'
        toggleButton.querySelector('.material-icons').textContent =
          'visibility_off'
      } else {
        senhaInput.type = 'password'
        toggleButton.querySelector('.material-icons').textContent = 'visibility'
      }
    }

    // Abrir o modal
    modalDetalhes.showModal()
  }

  /**
   * Obtém o ícone para uma categoria de senha
   * @param {string} category - Nome da categoria
   * @returns {string} - Nome do ícone da categoria
   */
  function getCategoryIcon(category) {
    switch (category.toLowerCase()) {
      case 'email':
        return 'email'
      case 'financeiro':
        return 'account_balance'
      case 'trabalho':
        return 'work'
      case 'entretenimento':
        return 'movie'
      case 'redes-sociais':
        return 'group'
      default:
        return 'vpn_key'
    }
  }
}
