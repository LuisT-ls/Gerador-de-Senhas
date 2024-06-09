// Dark Mode
const darkModeToggle = document.getElementById('darkModeToggle')
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode')
})

// Detectar preferência de cor do sistema e definir o tema inicial
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
const currentTheme = prefersDarkScheme.matches ? 'dark' : 'light'
document.documentElement.setAttribute('data-theme', currentTheme)
localStorage.setItem('theme', currentTheme)

// Adicionar ouvinte de evento para mudanças na preferência de cor do sistema
prefersDarkScheme.addEventListener('change', e => {
  const newTheme = e.matches ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
})

// Animações de entrada
const sections = document.querySelectorAll('main section')
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
      }
    })
  },
  { threshold: 0.5 }
)
sections.forEach(section => {
  observer.observe(section)
})

// Função para gerar senhas
function gerarSenha({
  comprimento,
  incluirMaiusculas,
  incluirMinusculas,
  incluirNumeros,
  incluirSimbolos,
  excluirAmbiguos
}) {
  const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz'
  const numeros = '0123456789'
  const simbolos = '!@#$%^&*()_+~`|}{[]:;?><,./-='
  const ambiguos = '{}[]()/\'"`~,;:.<>'

  let caracteres = ''
  if (incluirMaiusculas) caracteres += letrasMaiusculas
  if (incluirMinusculas) caracteres += letrasMinusculas
  if (incluirNumeros) caracteres += numeros
  if (incluirSimbolos) caracteres += simbolos
  if (excluirAmbiguos) {
    caracteres = caracteres
      .split('')
      .filter(c => !ambiguos.includes(c))
      .join('')
  }

  if (!caracteres) {
    alert('Selecione pelo menos um tipo de caractere!')
    return ''
  }

  let senha = ''
  for (let i = 0; i < comprimento; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length)
    senha += caracteres[randomIndex]
  }
  return senha
}

// Atualizar barra de força da senha
function atualizarBarraForca(senha) {
  const barra = document.getElementById('barraForca')
  const feedback = document.getElementById('feedbackForca')
  const dicas = document.getElementById('dicasForca')

  const comprimento = senha.length
  const temMinuscula = /[a-z]/.test(senha)
  const temMaiuscula = /[A-Z]/.test(senha)
  const temNumero = /[0-9]/.test(senha)
  const temSimbolo = /[^a-zA-Z0-9]/.test(senha)

  // Cálculo da força da senha (mais granular)
  let forca = 0
  if (comprimento >= 12) forca += 25
  if (comprimento >= 16) forca += 15
  if (temMinuscula) forca += 10
  if (temMaiuscula) forca += 10
  if (temNumero) forca += 10
  if (temSimbolo) forca += 10
  if (temMinuscula && temMaiuscula && temNumero && temSimbolo) forca += 20

  barra.style.width = `${forca}%`

  // Mensagens de feedback mais detalhadas
  if (forca < 30) {
    barra.style.backgroundColor = 'red'
    feedback.textContent = 'Muito Fraca'
  } else if (forca < 50) {
    barra.style.backgroundColor = 'orange'
    feedback.textContent = 'Fraca'
  } else if (forca < 70) {
    barra.style.backgroundColor = 'yellow'
    feedback.textContent = 'Média'
  } else if (forca < 90) {
    barra.style.backgroundColor = 'lightgreen'
    feedback.textContent = 'Forte'
  } else {
    barra.style.backgroundColor = 'green'
    feedback.textContent = 'Muito Forte'
  }

  // Estimativa de tempo para quebrar a senha (simplificada)
  let tempoQuebra = 'instantaneamente'
  if (forca >= 30) tempoQuebra = 'alguns minutos'
  if (forca >= 50) tempoQuebra = 'algumas horas'
  if (forca >= 70) tempoQuebra = 'alguns dias'
  if (forca >= 90) tempoQuebra = 'muitos anos'
  feedback.textContent += ` (quebrável em ${tempoQuebra})`

  // Dicas mais específicas
  dicas.innerHTML = ''
  if (comprimento < 12)
    dicas.innerHTML += '<li>Use pelo menos 12 caracteres.</li>'
  if (!temMinuscula) dicas.innerHTML += '<li>Inclua letras minúsculas.</li>'
  if (!temMaiuscula) dicas.innerHTML += '<li>Inclua letras maiúsculas.</li>'
  if (!temNumero) dicas.innerHTML += '<li>Inclua números.</li>'
  if (!temSimbolo) dicas.innerHTML += '<li>Inclua símbolos (!@#$%).</li>'
}

// Função para copiar senha para a área de transferência
function copiarParaClipboard(texto) {
  navigator.clipboard
    .writeText(texto)
    .then(() => {
      alert('Senha copiada para a área de transferência!')
    })
    .catch(() => {
      alert('Falha ao copiar senha!')
    })
}

// Evento de clique no botão de gerar senha
document.getElementById('gerarSenha').addEventListener('click', () => {
  const opcoes = {
    comprimento: parseInt(document.getElementById('comprimento').value, 10),
    incluirMaiusculas: document.getElementById('incluirMaiusculas').checked,
    incluirMinusculas: document.getElementById('incluirMinusculas').checked,
    incluirNumeros: document.getElementById('incluirNumeros').checked,
    incluirSimbolos: document.getElementById('incluirSimbolos').checked,
    excluirAmbiguos: document.getElementById('excluirAmbiguos').checked
  }

  const senha = gerarSenha(opcoes)
  document.getElementById('senhaGerada').value = senha
  atualizarBarraForca(senha)
  document.getElementById('confirmarSenha').value = ''
})

// Evento de clique no botão de copiar senha
document.getElementById('copiarSenha').addEventListener('click', () => {
  const senha = document.getElementById('senhaGerada').value
  const confirmarSenha = document.getElementById('confirmarSenha').value

  if (senha && senha === confirmarSenha) {
    copiarParaClipboard(senha)
  } else {
    alert('Senhas não coincidem ou não foram geradas!')
  }
})

// Evento de clique no botão de testar força da senha
document.getElementById('testarForca').addEventListener('click', () => {
  const senha = document.getElementById('senhaTeste').value
  atualizarBarraForca(senha)
})

// Funções adicionais para geradores rápidos
document.getElementById('gerarSenhaWifi').addEventListener('click', () => {
  const senha = gerarSenha({
    comprimento: 16,
    incluirMaiusculas: true,
    incluirMinusculas: true,
    incluirNumeros: true,
    incluirSimbolos: true,
    excluirAmbiguos: false
  })
  document.getElementById('senhaGerada').value = senha
  atualizarBarraForca(senha)
})

document.getElementById('gerarPin').addEventListener('click', () => {
  const comprimentoPin = parseInt(
    document.getElementById('comprimentoPin').value,
    10
  )
  const senha = gerarSenha({
    comprimento: comprimentoPin,
    incluirMaiusculas: false,
    incluirMinusculas: false,
    incluirNumeros: true,
    incluirSimbolos: false,
    excluirAmbiguos: false
  })
  document.getElementById('senhaGerada').value = senha
  atualizarBarraForca(senha)
})

document.getElementById('gerarSenhaHistoria').addEventListener('click', () => {
  const historia = document.getElementById('historia').value
  const senha =
    historia
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join('') + Math.floor(Math.random() * 10000)
  document.getElementById('senhaGerada').value = senha
  atualizarBarraForca(senha)
})

document.getElementById('gerarSenhaTema').addEventListener('click', () => {
  const tema = document.getElementById('tema').value
  const palavras = {
    geral: ['Segura', 'Senha', 'Forte', 'Unica'],
    filmes: ['Matrix', 'StarWars', 'Inception', 'Avatar'],
    series: ['BreakingBad', 'StrangerThings', 'GameOfThrones', 'TheCrown'],
    games: ['Minecraft', 'Fortnite', 'Cyberpunk', 'Overwatch']
  }
  const senha =
    palavras[tema][Math.floor(Math.random() * palavras[tema].length)] +
    Math.floor(Math.random() * 10000)
  document.getElementById('senhaGerada').value = senha
  atualizarBarraForca(senha)
})
