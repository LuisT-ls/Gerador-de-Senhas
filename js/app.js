// Dark Mode Toggle
const toggleButton = document.getElementById('darkModeToggle')
const currentTheme = localStorage.getItem('theme') || 'light'

document.documentElement.setAttribute('data-theme', currentTheme)

toggleButton.addEventListener('click', () => {
  const theme =
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light'
      : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
})

// Atualizar valor do slider
const comprimentoSlider = document.getElementById('comprimento')
const comprimentoValor = document.getElementById('comprimentoValor')

comprimentoSlider.addEventListener('input', () => {
  comprimentoValor.textContent = comprimentoSlider.value
})

// Implementação das tabs
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    // Encontrar o grupo de tabs pai
    const tabGroup =
      button.closest('.tabs, .tab-navigation').nextElementSibling ||
      button.closest('.tabs, .tab-navigation').parentElement

    // Desativar todas as tabs neste grupo
    tabGroup.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active')
      panel.hidden = true
    })

    // Desativar todos os botões neste grupo
    button
      .closest('.tabs, .tab-navigation')
      .querySelectorAll('.tab-button')
      .forEach(btn => {
        btn.classList.remove('active')
        btn.setAttribute('aria-selected', 'false')
      })

    // Ativar a tab clicada
    button.classList.add('active')
    button.setAttribute('aria-selected', 'true')

    // Ativar o painel correspondente
    const targetPanel = document.getElementById(
      button.getAttribute('aria-controls')
    )
    if (targetPanel) {
      targetPanel.classList.add('active')
      targetPanel.hidden = false
    }
  })
})

// Simulação de geração de senha (para demonstração)
document.getElementById('gerarSenha').addEventListener('click', () => {
  const senhaGerada = document.getElementById('senhaGerada')
  // Esta é apenas uma demonstração - a geração real seria mais complexa
  senhaGerada.value = 'X7@bP9#tL2qR5!kZ'

  // Atualizar medidor de força (simulação)
  const barraForca = document.querySelector('#barraForca .barra-progresso')
  barraForca.setAttribute('data-strength', 'forte')

  const feedbackForca = document.getElementById('feedbackForca')
  feedbackForca.textContent = 'Senha Forte'

  // Atualizar análise de segurança
  document.getElementById('detalhesSeguranca').open = true

  // Adicionar ao histórico (simulação)
  adicionarAoHistorico('X7@bP9#tL2qR5!kZ')

  // Mostrar notificação
  mostrarNotificacao('Senha gerada com sucesso!', 'success')
})

// Função para adicionar ao histórico
function adicionarAoHistorico(senha) {
  const lista = document.getElementById('listaSenhas')
  const item = document.createElement('li')
  item.className = 'senha-item'

  const dataHora = new Date().toLocaleString()

  item.innerHTML = `
<div class="senha-conteudo">
  <input type="password" value="${senha}" readonly />
  <span class="senha-data">${dataHora}</span>
</div>
<div class="senha-acoes">
  <button class="toggle-visibility" aria-label="Mostrar/ocultar senha">
    <span class="material-icons" aria-hidden="true">visibility</span>
  </button>
  <button class="copiar-senha" aria-label="Copiar senha">
    <span class="material-icons" aria-hidden="true">content_copy</span>
  </button>
</div>
`

  // Adicionar ao início da lista
  if (lista.firstChild) {
    lista.insertBefore(item, lista.firstChild)
  } else {
    lista.appendChild(item)
  }

  // Atualizar contador
  atualizarContadorHistorico()
}

// Função para atualizar contador de histórico
function atualizarContadorHistorico() {
  const contador = document.querySelector('#historicoContagem strong')
  const quantidade = document.getElementById('listaSenhas').childElementCount
  contador.textContent = quantidade
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
  const notificacoes = document.getElementById('notificacoes')
  const notificacao = document.createElement('div')
  notificacao.className = `notificacao ${tipo}`

  let icone = 'info'
  if (tipo === 'success') icone = 'check_circle'
  if (tipo === 'error') icone = 'error'
  if (tipo === 'warning') icone = 'warning'

  notificacao.innerHTML = `
<span class="material-icons" aria-hidden="true">${icone}</span>
<p>${mensagem}</p>
<button class="fechar-notificacao" aria-label="Fechar notificação">
  <span class="material-icons" aria-hidden="true">close</span>
</button>
`

  notificacoes.appendChild(notificacao)

  // Auto-remover após 5 segundos
  setTimeout(() => {
    notificacao.classList.add('fadeout')
    setTimeout(() => {
      notificacao.remove()
    }, 300)
  }, 5000)

  // Botão de fechar
  notificacao
    .querySelector('.fechar-notificacao')
    .addEventListener('click', () => {
      notificacao.classList.add('fadeout')
      setTimeout(() => {
        notificacao.remove()
      }, 300)
    })
}

// Toggle visibilidade da senha
document.querySelectorAll('.toggle-visibility').forEach(button => {
  button.addEventListener('click', e => {
    const input = e.target
      .closest('.password-display, .senha-acoes, .senha-item')
      .querySelector('input')
    const icon = e.target.closest('button').querySelector('.material-icons')

    if (input.type === 'password') {
      input.type = 'text'
      icon.textContent = 'visibility_off'
    } else {
      input.type = 'password'
      icon.textContent = 'visibility'
    }
  })
})

// Copiar senha gerada
document.getElementById('copiarSenha').addEventListener('click', () => {
  const senha = document.getElementById('senhaGerada')
  navigator.clipboard
    .writeText(senha.value)
    .then(() => {
      mostrarNotificacao(
        'Senha copiada para a área de transferência!',
        'success'
      )
    })
    .catch(() => {
      mostrarNotificacao('Não foi possível copiar a senha.', 'error')
    })
})

// Abrir modal de salvar senha
document.getElementById('salvarSenha').addEventListener('click', () => {
  const senha = document.getElementById('senhaGerada').value
  if (!senha) {
    mostrarNotificacao('Gere uma senha primeiro!', 'warning')
    return
  }

  const modal = document.getElementById('modalSalvar')
  modal.showModal()
})

// Manipuladores para modais
document.querySelectorAll('dialog').forEach(dialog => {
  // Fechar com o botão Cancelar
  const cancelarButton = dialog.querySelector('[id^="cancelar"]')
  if (cancelarButton) {
    cancelarButton.addEventListener('click', () => {
      dialog.close()
    })
  }

  // Fechar com o botão Fechar
  const fecharButton = dialog.querySelector('[id^="fechar"]')
  if (fecharButton) {
    fecharButton.addEventListener('click', () => {
      dialog.close()
    })
  }

  // Fechar clicando fora do modal
  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect()
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    if (!isInDialog) {
      dialog.close()
    }
  })
})

// Gerar múltiplas senhas
document.getElementById('gerarMultiplas').addEventListener('click', () => {
  document.getElementById('modalMultiplas').showModal()
})

// Simulação de envio do formulário de múltiplas senhas
document.getElementById('formMultiplasSenhas').addEventListener('submit', e => {
  e.preventDefault()

  const quantidade = parseInt(document.getElementById('quantidadeSenhas').value)
  const senhasMultiplas = document.getElementById('senhasMultiplas')
  const senhasGrid = senhasMultiplas.querySelector('.senhas-grid')

  // Limpar senhas anteriores
  senhasGrid.innerHTML = ''

  // Gerar novas senhas (simulação)
  for (let i = 0; i < quantidade; i++) {
    // Na implementação real, cada senha seria gerada com o algoritmo real
    const senha = `Senha${i + 1}_${Math.random().toString(36).substring(2, 8)}`

    const senhaItem = document.createElement('div')
    senhaItem.className = 'senha-multipla'
    senhaItem.innerHTML = `
  <input type="text" value="${senha}" readonly />
  <div class="acoes">
    <button class="copiar-senha" aria-label="Copiar senha">
      <span class="material-icons" aria-hidden="true">content_copy</span>
    </button>
    <button class="salvar-senha" aria-label="Salvar senha">
      <span class="material-icons" aria-hidden="true">bookmark</span>
    </button>
  </div>
`

    senhasGrid.appendChild(senhaItem)
  }

  // Mostrar seção de múltiplas senhas
  senhasMultiplas.classList.remove('hidden')

  // Fechar modal
  document.getElementById('modalMultiplas').close()

  // Scroll até a seção
  senhasMultiplas.scrollIntoView({ behavior: 'smooth' })
})

// Inicializar outras funcionalidades
document.addEventListener('DOMContentLoaded', () => {
  // Atualizar contagem inicial do histórico
  atualizarContadorHistorico()

  // Mostrar dicas se for primeira visita (simulação)
  if (!localStorage.getItem('visitado')) {
    setTimeout(() => {
      document.getElementById('modalDicas').showModal()
      localStorage.setItem('visitado', 'true')
    }, 2000)
  }
})
