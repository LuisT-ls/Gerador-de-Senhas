document.addEventListener('DOMContentLoaded', function () {
  const comprimentoInput = document.getElementById('comprimento')
  const incluirMaiusculasInput = document.getElementById('incluirMaiusculas')
  const incluirMinusculasInput = document.getElementById('incluirMinusculas')
  const incluirNumerosInput = document.getElementById('incluirNumeros')
  const incluirSimbolosInput = document.getElementById('incluirSimbolos')
  const excluirAmbiguosInput = document.getElementById('excluirAmbiguos')
  const gerarSenhaButton = document.getElementById('gerarSenha')
  const senhaGeradaInput = document.getElementById('senhaGerada')
  const copiarSenhaButton = document.getElementById('copiarSenha')
  const barraForca = document.getElementById('barraForca')
  const feedbackForca = document.getElementById('feedbackForca')
  const dicasForca = document.getElementById('dicasForca')
  const senhaTesteInput = document.getElementById('senhaTeste')
  const testarForcaButton = document.getElementById('testarForca')
  const gerarSenhaWifiButton = document.getElementById('gerarSenhaWifi')
  const comprimentoPinInput = document.getElementById('comprimentoPin')
  const gerarPinButton = document.getElementById('gerarPin')
  const historiaTextarea = document.getElementById('historia')
  const gerarSenhaHistoriaButton = document.getElementById('gerarSenhaHistoria')
  const temaSelect = document.getElementById('tema')
  const gerarSenhaTemaButton = document.getElementById('gerarSenhaTema')

  const caracteres = {
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%^&*()_-+=[{]};:<>,.?/~',
    ambiguos: 'il1Lo0O'
  }

  const temas = {
    geral: {
      palavras: [
        'aventura',
        'coragem',
        'esperança',
        'felicidade',
        'liberdade',
        'magia',
        'mistério',
        'sonho',
        'viagem'
      ]
    },
    filmes: {
      palavras: [
        'jedi',
        'hobbit',
        'infinito',
        'vingadores',
        'avatar',
        'matrix',
        'batman',
        'coringa',
        'dumbledore'
      ]
    },
    series: {
      palavras: [
        'westeros',
        'dragões',
        'tardis',
        'friends',
        'sherlock',
        'eleven',
        'demogorgon',
        'papel',
        'professor'
      ]
    },
    games: {
      palavras: [
        'mario',
        'zelda',
        'kratos',
        'link',
        'masterchief',
        'cortana',
        'overwatch',
        'league',
        'minecraft'
      ]
    }
  }

  let historicoSenhas = []

  function gerarSenha() {
    const comprimento = parseInt(comprimentoInput.value)
    let caracteresValidos = ''
    let senha = ''

    if (incluirMaiusculasInput.checked)
      caracteresValidos += caracteres.maiusculas
    if (incluirMinusculasInput.checked)
      caracteresValidos += caracteres.minusculas
    if (incluirNumerosInput.checked) caracteresValidos += caracteres.numeros
    if (incluirSimbolosInput.checked) caracteresValidos += caracteres.simbolos

    if (excluirAmbiguosInput.checked) {
      caracteresValidos = caracteresValidos.replace(
        new RegExp(`[${caracteres.ambiguos}]`, 'g'),
        ''
      )
    }

    if (caracteresValidos.length === 0) {
      alert('Selecione pelo menos um tipo de caractere.')
      return
    }

    for (let i = 0; i < comprimento; i++) {
      senha += caracteresValidos.charAt(
        Math.floor(Math.random() * caracteresValidos.length)
      )
    }

    senhaGeradaInput.value = senha
    avaliarForca(senha)
    adicionarAoHistorico(senha)
  }

  function avaliarForca(senha) {
    let forca = 0
    const comprimento = senha.length

    comprimento >= 12 && forca++,
      /[A-Z]/.test(senha) && forca++,
      /[a-z]/.test(senha) && forca++,
      /[0-9]/.test(senha) && forca++,
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha) && forca++

    let nivelForca = 'Muito Fraca'
    let corBarra = 'very-weak'
    let tempoQuebra = 'instantaneamente'
    let dicas = []

    if (forca === 1) {
      nivelForca = 'Fraca'
      corBarra = 'weak'
      tempoQuebra = 'em segundos'
    } else if (forca === 2) {
      nivelForca = 'Regular'
      corBarra = 'medium'
      tempoQuebra = 'em minutos'
    } else if (forca === 3) {
      nivelForca = 'Boa'
      corBarra = 'good'
      tempoQuebra = 'em horas'
    } else if (forca === 4) {
      nivelForca = 'Forte'
      corBarra = 'strong'
      tempoQuebra = 'em dias'
    } else if (forca >= 5) {
      nivelForca = 'Muito Forte'
      corBarra = 'very-strong'
      tempoQuebra = 'em anos'
    }

    comprimento < 12 && dicas.push('Use pelo menos 12 caracteres.')
    !/[A-Z]/.test(senha) && dicas.push('Inclua letras maiúsculas.')
    !/[a-z]/.test(senha) && dicas.push('Inclua letras minúsculas.')
    !/[0-9]/.test(senha) && dicas.push('Inclua números.')
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha) &&
      dicas.push('Inclua símbolos.')

    barraForca.innerHTML = `<div class="${corBarra}" style="width:${
      forca * 20
    }%"></div>`
    feedbackForca.innerHTML = `Força: ${nivelForca} <span class="forca-indicador forca-${corBarra.replace(
      'very-',
      ''
    )}"></span> (Quebra: ${tempoQuebra})`
    dicasForca.innerHTML = dicas.map(dica => `<li>${dica}</li>`).join('')
  }

  function copiarSenha() {
    senhaGeradaInput.select()
    document.execCommand('copy')
    copiarSenhaButton.classList.add('copiado')
    copiarSenhaButton.innerHTML = '<i class="material-icons">check</i> Copiado!'
    setTimeout(() => {
      copiarSenhaButton.classList.remove('copiado')
      copiarSenhaButton.innerHTML =
        '<i class="material-icons">content_copy</i> Copiar'
    }, 1500)
  }

  function gerarSenhaWifi() {
    const comprimento = 12
    let senha = ''
    const caracteresValidos =
      caracteres.maiusculas + caracteres.minusculas + caracteres.numeros + '-_.'
    for (let i = 0; i < comprimento; i++) {
      senha += caracteresValidos.charAt(
        Math.floor(Math.random() * caracteresValidos.length)
      )
    }
    senhaGeradaInput.value = senha
    avaliarForca(senha)
    adicionarAoHistorico(senha)
  }

  function gerarPin() {
    const comprimento = parseInt(comprimentoPinInput.value)
    let pin = ''
    for (let i = 0; i < comprimento; i++) {
      pin += Math.floor(Math.random() * 10)
    }
    senhaGeradaInput.value = pin
    avaliarForca(pin)
    adicionarAoHistorico(pin)
  }

  function gerarSenhaHistoria() {
    const historia = historiaTextarea.value.toLowerCase()
    const palavras = historia.split(/\s+/)
    const senha = palavras
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '')
    senhaGeradaInput.value = senha
    avaliarForca(senha)
    adicionarAoHistorico(senha)
  }

  function gerarSenhaTema() {
    const tema = temaSelect.value
    const palavrasTema = temas[tema].palavras
    const palavraAleatoria =
      palavrasTema[Math.floor(Math.random() * palavrasTema.length)]
    const numeroAleatorio = Math.floor(Math.random() * 100)
    const simboloAleatorio = caracteres.simbolos.charAt(
      Math.floor(Math.random() * caracteres.simbolos.length)
    )
    const senha = `${palavraAleatoria}${numeroAleatorio}${simboloAleatorio}`
    senhaGeradaInput.value = senha
    avaliarForca(senha)
    adicionarAoHistorico(senha)
  }

  function adicionarAoHistorico(senha) {
    historicoSenhas.unshift(senha)
    if (historicoSenhas.length > 5) {
      historicoSenhas.pop()
    }
    atualizarHistoricoUI()
  }

  function atualizarHistoricoUI() {
    const lista = document.getElementById('listaSenhas')
    if (!lista) return
    lista.innerHTML = ''
    historicoSenhas.forEach((senha, index) => {
      const li = document.createElement('li')
      li.textContent = senha
      const btn = document.createElement('button')
      btn.textContent = 'Copiar'
      btn.onclick = () => copiarSenhaDoHistorico(senha, btn)
      li.appendChild(btn)
      lista.appendChild(li)
    })
  }

  function copiarSenhaDoHistorico(senha, button) {
    navigator.clipboard
      .writeText(senha)
      .then(() => {
        // Animação de copiado
        button.classList.add('copiado')
        const textoOriginal = button.textContent
        button.innerHTML = '<i class="material-icons">check</i> Copiado!'

        setTimeout(() => {
          button.classList.remove('copiado')
          button.textContent = textoOriginal
        }, 1500)
      })
      .catch(err => {
        console.error('Erro ao copiar senha: ', err)
      })
  }

  function copiarSenha() {
    navigator.clipboard
      .writeText(senhaGeradaInput.value)
      .then(() => {
        copiarSenhaButton.classList.add('copiado')
        copiarSenhaButton.innerHTML =
          '<i class="material-icons">check</i> Copiado!'
        setTimeout(() => {
          copiarSenhaButton.classList.remove('copiado')
          copiarSenhaButton.innerHTML =
            '<i class="material-icons">content_copy</i> Copiar'
        }, 1500)
      })
      .catch(err => {
        console.error('Erro ao copiar senha: ', err)
      })
  }

  function usarSenhaDoHistorico(index) {
    senhaGeradaInput.value = historicoSenhas[index]
    avaliarForca(historicoSenhas[index])
  }

  // Event listeners
  gerarSenhaButton.addEventListener('click', gerarSenha)
  copiarSenhaButton.addEventListener('click', copiarSenha)
  testarForcaButton.addEventListener('click', () =>
    avaliarForca(senhaTesteInput.value)
  )
  gerarSenhaWifiButton.addEventListener('click', gerarSenhaWifi)
  gerarPinButton.addEventListener('click', gerarPin)
  gerarSenhaHistoriaButton.addEventListener('click', gerarSenhaHistoria)
  gerarSenhaTemaButton.addEventListener('click', gerarSenhaTema)

  // Dark mode toggle
  const toggleButton = document.getElementById('darkModeToggle')
  let currentTheme = localStorage.getItem('theme')

  // Defina o tema inicial
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)
  } else {
    currentTheme = 'light'
    document.documentElement.setAttribute('data-theme', currentTheme)
  }

  toggleButton.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)

    // Atualize o ícone do botão (opcional)
    updateDarkModeIcon(currentTheme)
  })

  // Sistema avançado de visualização de força de senha
  class PasswordStrengthVisualizer {
    constructor(passwordInput, outputElement) {
      this.passwordInput = passwordInput
      this.outputElement = outputElement
      this.strengthCategories = [
        {
          name: 'Muito Fraca',
          color: '#FF4D4D',
          icon: '😱',
          description: 'Extremamente vulnerável',
          minScore: 0,
          maxScore: 20
        },
        {
          name: 'Fraca',
          color: '#FFA64D',
          icon: '🛡️',
          description: 'Fácil de quebrar',
          minScore: 21,
          maxScore: 40
        },
        {
          name: 'Média',
          color: '#FFD700',
          icon: '🔒',
          description: 'Necessita melhorias',
          minScore: 41,
          maxScore: 60
        },
        {
          name: 'Boa',
          color: '#4DFF4D',
          icon: '✅',
          description: 'Razoavelmente segura',
          minScore: 61,
          maxScore: 80
        },
        {
          name: 'Forte',
          color: '#4D4DFF',
          icon: '🚀',
          description: 'Altamente segura',
          minScore: 81,
          maxScore: 95
        },
        {
          name: 'Excepcionalmente Forte',
          color: '#8A2BE2',
          icon: '💎',
          description: 'Praticamente inquebrável',
          minScore: 96,
          maxScore: 100
        }
      ]
    }

    calculateStrength(password) {
      let score = 0

      // Comprimento da senha
      score += Math.min(password.length * 4, 40)

      // Variedade de caracteres
      const hasLowercase = /[a-z]/.test(password)
      const hasUppercase = /[A-Z]/.test(password)
      const hasNumbers = /[0-9]/.test(password)
      const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

      if (hasLowercase) score += 10
      if (hasUppercase) score += 10
      if (hasNumbers) score += 10
      if (hasSymbols) score += 15

      // Penalidades para padrões comuns
      if (/123|abc|qwe|password/i.test(password)) score -= 15

      // Normaliza o score
      score = Math.min(Math.max(score, 0), 100)
      return score
    }

    getStrengthCategory(score) {
      return this.strengthCategories.find(
        category => score >= category.minScore && score <= category.maxScore
      )
    }

    visualize(password) {
      const score = this.calculateStrength(password)
      const category = this.getStrengthCategory(score)

      // Elemento de visualização circular
      const circleElement = `
      <div class="strength-circle" style="
        background: conic-gradient(${category.color} ${score}%, #e0e0e0 ${score}%);
      ">
        <span class="strength-icon">${category.icon}</span>
      </div>
    `

      // Feedback detalhado
      const detailedFeedback = `
      <div class="strength-details">
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <small>Força: ${score}%</small>
      </div>
    `

      this.outputElement.innerHTML = circleElement + detailedFeedback
    }
  }

  // Exemplo de uso
  document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('senha')
    const strengthOutput = document.getElementById('forcaSenha')
    const visualizer = new PasswordStrengthVisualizer(
      passwordInput,
      strengthOutput
    )

    passwordInput.addEventListener('input', () => {
      visualizer.visualize(passwordInput.value)
    })
  })

  // Função para atualizar o ícone do botão de modo escuro (opcional)
  function updateDarkModeIcon(theme) {
    const iconPath =
      theme === 'dark'
        ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Cline x1='12' y1='1' x2='12' y2='3'/%3E%3Cline x1='12' y1='21' x2='12' y2='23'/%3E%3Cline x1='4.22' y1='4.22' x2='5.64' y2='5.64'/%3E%3Cline x1='18.36' y1='18.36' x2='19.78' y2='19.78'/%3E%3Cline x1='1' y1='12' x2='3' y2='12'/%3E%3Cline x1='21' y1='12' x2='23' y2='12'/%3E%3Cline x1='4.22' y1='19.78' x2='5.64' y2='18.36'/%3E%3Cline x1='18.36' y1='5.64' x2='19.78' y2='4.22'/%3E%3C/svg%3E"
        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'%3E%3C/path%3E%3C/svg%3E"

    toggleButton.querySelector('img').src = iconPath
  }

  // Inicialize o ícone correto
  updateDarkModeIcon(currentTheme)

  // Inicialização
  gerarSenha()
})
