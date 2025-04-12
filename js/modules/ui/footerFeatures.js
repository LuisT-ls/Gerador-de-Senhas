// JavaScript para as funcionalidades interativas do footer

// Função para inicializar as funcionalidades do footer
export function initFooterFeatures() {
  // Alternador de tema no footer (sincronizado com o alternador do header)
  const footerThemeToggle = document.getElementById('footer-theme-toggle')
  const headerThemeToggle = document.getElementById('darkModeToggle')

  if (footerThemeToggle && headerThemeToggle) {
    footerThemeToggle.addEventListener('click', function () {
      // Aciona o click no botão do header para manter a sincronização
      headerThemeToggle.click()
    })
  }

  // Botão de voltar ao topo
  const backToTopButton = document.getElementById('back-to-top')
  if (backToTopButton) {
    // Inicialmente oculto
    backToTopButton.classList.remove('visible')

    // Mostrar/ocultar baseado no scroll
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible')
      } else {
        backToTopButton.classList.remove('visible')
      }
    })

    // Ação de voltar ao topo
    backToTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }

  // Gerenciar o changelog
  const changelogLink = document.getElementById('changelog-link')
  const footerChangelog = document.getElementById('footer-changelog')
  const closeChangelog = document.getElementById('close-changelog')

  if (changelogLink && footerChangelog && closeChangelog) {
    changelogLink.addEventListener('click', function (e) {
      e.preventDefault()
      footerChangelog.classList.toggle('hidden')

      // Scroll para o changelog se estiver visível
      if (!footerChangelog.classList.contains('hidden')) {
        footerChangelog.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })

    closeChangelog.addEventListener('click', function () {
      footerChangelog.classList.add('hidden')
    })
  }

  // Formulário de newsletter
  const newsletterForm = document.getElementById('newsletter-form')
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault()

      const emailInput = document.getElementById('newsletter-email')
      const email = emailInput.value.trim()

      if (email && validateEmail(email)) {
        // Simulação de envio do formulário
        emailInput.value = ''
        document.getElementById('newsletter-consent').checked = false

        // Mostrar notificação de sucesso se o sistema de notificações estiver disponível
        if (typeof showNotification === 'function') {
          showNotification(
            'Inscrição realizada com sucesso! Verifique seu email para confirmar.',
            'success'
          )
        } else {
          alert(
            'Inscrição realizada com sucesso! Verifique seu email para confirmar.'
          )
        }
      } else {
        // Mostrar notificação de erro
        if (typeof showNotification === 'function') {
          showNotification('Por favor, insira um email válido.', 'error')
        } else {
          alert('Por favor, insira um email válido.')
        }
      }
    })
  }
}

// Função auxiliar para validar email
function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}

// Função para acessar a função de notificação do sistema
function showNotification(message, type) {
  // Verifica se o módulo de notificações está disponível no escopo global
  if (
    window.appNotifications &&
    typeof window.appNotifications.show === 'function'
  ) {
    window.appNotifications.show(message, type)
  } else {
    // Tenta buscar o elemento de notificações e criar uma notificação manualmente
    const notificacoesContainer = document.getElementById('notificacoes')

    if (notificacoesContainer) {
      const notificacao = document.createElement('div')
      notificacao.className = `notificacao ${type}`
      notificacao.innerHTML = `
        <div class="notificacao-conteudo">
          <span class="material-icons">${
            type === 'success' ? 'check_circle' : 'error'
          }</span>
          <p>${message}</p>
        </div>
        <button class="fechar-notificacao" aria-label="Fechar notificação">
          <span class="material-icons">close</span>
        </button>
      `

      // Adicionar ao container
      notificacoesContainer.appendChild(notificacao)

      // Configurar botão de fechar
      const fecharBtn = notificacao.querySelector('.fechar-notificacao')
      if (fecharBtn) {
        fecharBtn.addEventListener('click', function () {
          notificacao.remove()
        })
      }

      // Auto-remover após 5 segundos
      setTimeout(() => {
        if (notificacao.parentNode) {
          notificacao.remove()
        }
      }, 5000)
    }
  }
}
