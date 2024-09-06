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
        'aventura', 'coragem', 'esperança', 'felicidade', 'liberdade',
        'magia', 'mistério', 'sonho', 'viagem'
      ]
    },
    filmes: {
      palavras: [
        'jedi', 'hobbit', 'infinito', 'vingadores', 'avatar',
        'matrix', 'batman', 'coringa', 'dumbledore'
      ]
    },
    series: {
      palavras: [
        'westeros', 'dragões', 'tardis', 'friends', 'sherlock',
        'eleven', 'demogorgon', 'papel', 'professor'
      ]
    },
    games: {
      palavras: [
        'mario', 'zelda', 'kratos', 'link', 'masterchief',
        'cortana', 'overwatch', 'league', 'minecraft'
      ]
    }
  }
  
  let historicoSenhas = []

  function gerarSenha() {
    const comprimento = parseInt(comprimentoInput.value)
    let caracteresValidos = ''
    let senha = ''
  
    if (incluirMaiusculasInput.checked) caracteresValidos += caracteres.maiusculas
    if (incluirMinusculasInput.checked) caracteresValidos += caracteres.minusculas
    if (incluirNumerosInput.checked) caracteresValidos += caracteres.numeros
    if (incluirSimbolosInput.checked) caracteresValidos += caracteres.simbolos
  
    if (excluirAmbiguosInput.checked) {
      caracteresValidos = caracteresValidos.replace(new RegExp(`[${caracteres.ambiguos}]`, 'g'), '')
    }
  
    if (caracteresValidos.length === 0) {
      alert('Selecione pelo menos um tipo de caractere.')
      return
    }
  
    for (let i = 0; i < comprimento; i++) {
      senha += caracteresValidos.charAt(Math.floor(Math.random() * caracteresValidos.length))
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
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha) && dicas.push('Inclua símbolos.')

    barraForca.innerHTML = `<div class="${corBarra}" style="width:${forca * 20}%"></div>`
    feedbackForca.innerHTML = `Força: ${nivelForca} <span class="forca-indicador forca-${corBarra.replace('very-', '')}"></span> (Quebra: ${tempoQuebra})`
    dicasForca.innerHTML = dicas.map(dica => `<li>${dica}</li>`).join('')
  }

  function copiarSenha() {
    senhaGeradaInput.select()
    document.execCommand('copy')
    copiarSenhaButton.classList.add('copiado')
    copiarSenhaButton.innerHTML = '<i class="material-icons">check</i> Copiado!'
    setTimeout(() => {
      copiarSenhaButton.classList.remove('copiado')
      copiarSenhaButton.innerHTML = '<i class="material-icons">content_copy</i> Copiar'
    }, 1500)
  }

  function gerarSenhaWifi() {
    const comprimento = 12
    let senha = ''
    const caracteresValidos = caracteres.maiusculas + caracteres.minusculas + caracteres.numeros + '-_.'
    for (let i = 0; i < comprimento; i++) {
      senha += caracteresValidos.charAt(Math.floor(Math.random() * caracteresValidos.length))
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
    const palavraAleatoria = palavrasTema[Math.floor(Math.random() * palavrasTema.length)]
    const numeroAleatorio = Math.floor(Math.random() * 100)
    const simboloAleatorio = caracteres.simbolos.charAt(Math.floor(Math.random() * caracteres.simbolos.length))
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
      btn.textContent = 'Usar'
      btn.onclick = () => usarSenhaDoHistorico(index)
      li.appendChild(btn)
      lista.appendChild(li)
    })
  }

  function usarSenhaDoHistorico(index) {
    senhaGeradaInput.value = historicoSenhas[index]
    avaliarForca(historicoSenhas[index])
  }

// Event listeners
gerarSenhaButton.addEventListener('click', gerarSenha)
copiarSenhaButton.addEventListener('click', copiarSenha)
testarForcaButton.addEventListener('click', () => avaliarForca(senhaTesteInput.value))
gerarSenhaWifiButton.addEventListener('click', gerarSenhaWifi)
gerarPinButton.addEventListener('click', gerarPin)
gerarSenhaHistoriaButton.addEventListener('click', gerarSenhaHistoria)
gerarSenhaTemaButton.addEventListener('click', gerarSenhaTema)

// Dark mode toggle
const toggleButton = document.getElementById('darkModeToggle')
const currentTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', currentTheme)

toggleButton.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
})

// Inicialização
gerarSenha()
})