// darkMode.js - Controle do modo escuro

/**
 * Inicializa o controle de modo escuro
 */
export function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle')
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

  // Verificar configuração salva ou preferência do sistema
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    enableDarkMode()
  } else {
    disableDarkMode()
  }

  // Evento para o botão de alternar tema
  darkModeToggle.addEventListener('click', toggleDarkMode)

  // Atualizar quando a preferência do sistema mudar
  prefersDarkScheme.addEventListener('change', event => {
    // Só atualizar automaticamente se o usuário não tiver uma preferência salva
    if (!localStorage.getItem('theme')) {
      if (event.matches) {
        enableDarkMode()
      } else {
        disableDarkMode()
      }
    }
  })

  /**
   * Alterna entre modo claro e escuro
   */
  function toggleDarkMode() {
    if (document.body.classList.contains('dark-theme')) {
      disableDarkMode()
    } else {
      enableDarkMode()
    }
  }

  /**
   * Ativa o modo escuro
   */
  function enableDarkMode() {
    document.body.classList.add('dark-theme')
    darkModeToggle.setAttribute('aria-label', 'Alternar para modo claro')
    darkModeToggle.title = 'Alternar para modo claro'
    darkModeToggle.querySelector('.material-icons').textContent = 'light_mode'
    localStorage.setItem('theme', 'dark')
  }

  /**
   * Desativa o modo escuro
   */
  function disableDarkMode() {
    document.body.classList.remove('dark-theme')
    darkModeToggle.setAttribute('aria-label', 'Alternar para modo escuro')
    darkModeToggle.title = 'Alternar para modo escuro'
    darkModeToggle.querySelector('.material-icons').textContent = 'dark_mode'
    localStorage.setItem('theme', 'light')
  }
}
