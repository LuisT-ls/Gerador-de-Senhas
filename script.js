// Seleção dos elementos do DOM
const comprimentoInput = document.getElementById('comprimento')
const incluirNumerosInput = document.getElementById('incluirNumeros')
const incluirSimbolosInput = document.getElementById('incluirSimbolos')
const gerarSenhaButton = document.getElementById('gerarSenha')
const senhaGeradaInput = document.getElementById('senhaGerada')
const copiarSenhaButton = document.getElementById('copiarSenha')
const barraForca = document.getElementById('barraForca')
const historiaInput = document.getElementById('historia')
const gerarSenhaHistoriaButton = document.getElementById('gerarSenhaHistoria')
const temaSelect = document.getElementById('tema')
const gerarSenhaTemaButton = document.getElementById('gerarSenhaTema')
const incluirMaiusculasInput = document.getElementById('incluirMaiusculas')
const incluirMinusculasInput = document.getElementById('incluirMinusculas')
const excluirAmbiguosInput = document.getElementById('excluirAmbiguos')
const feedbackForca = document.getElementById('feedbackForca')
const dicasForca = document.getElementById('dicasForca')

// Caracteres para gerar as senhas
const caracteres = {
  letras: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numeros: '0123456789',
  simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

// Listas de palavras temáticas (exemplo)
const palavrasTematicas = {
  geral: ['coragem', 'esperanca', 'felicidade', 'amor', 'paz'],
  filmes: ['jedi', 'hobbit', 'vingadores', 'batman', 'matrix'],
  series: ['got', 'strangerthings', 'thewitcher', 'friends', 'theoffice'],
  games: ['mario', 'zelda', 'sonic', 'kratos', 'link']
}

// Função para gerar a senha
function gerarSenha() {
  const comprimento = parseInt(comprimentoInput.value)
  const incluirMaiusculas = incluirMaiusculasInput.checked
  const incluirMinusculas = incluirMinusculasInput.checked
  const incluirNumeros = incluirNumerosInput.checked
  const incluirSimbolos = incluirSimbolosInput.checked
  const excluirAmbiguos = excluirAmbiguosInput.checked

  if (comprimento < 8 || comprimento > 30) {
    alert('O comprimento da senha deve ser entre 8 e 30 caracteres.')
    return
  }

  let caracteresValidos = ''
  if (incluirMaiusculas) caracteresValidos += caracteres.letras.toUpperCase()
  if (incluirMinusculas) caracteresValidos += caracteres.letras.toLowerCase()
  if (incluirNumeros) caracteresValidos += caracteres.numeros
  if (incluirSimbolos) caracteresValidos += caracteres.simbolos

  if (excluirAmbiguos) {
    caracteresValidos = caracteresValidos.replace(/[0O1Il]/g, '')
  }

  let senha = ''
  for (let i = 0; i < comprimento; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteresValidos.length)
    senha += caracteresValidos.charAt(indiceAleatorio)
  }

  senhaGeradaInput.value = senha
  calcularForcaSenha(senha)
}

// Adiciona um event listener para verificar a senha em tempo real
senhaGeradaInput.addEventListener('input', () => {
  const senha = senhaGeradaInput.value
  calcularForcaSenha(senha)
})

// Função para calcular a força da senha e fornecer dicas
function calcularForcaSenha(senha) {
  let forca = 0
  const comprimento = senha.length

  if (comprimento >= 16) forca += 4
  else if (comprimento >= 12) forca += 3
  else if (comprimento >= 8) forca += 2
  else forca += 1

  if (senha.match(/[A-Z]/) && senha.match(/[a-z]/)) forca += 2
  if (senha.match(/[0-9]/)) forca += 2
  if (senha.match(/[^A-Za-z0-9]/)) forca += 3

  if (senha.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) forca += 2
  if (senha.match(/([a-zA-Z])/) && senha.match(/([0-9])/)) forca += 2
  if (senha.match(/([a-zA-Z0-9])/) && senha.match(/([^A-Za-z0-9])/)) forca += 3

  forca = Math.min(Math.round(forca / 3), 5)

  barraForca.style.width = `${forca * 20}%`

  for (let i = 1; i <= 5; i++) {
    barraForca.classList.remove(`forca-${i}`)
  }

  barraForca.classList.add(`forca-${forca}`)

  const feedbackForca = document.getElementById('feedbackForca')
  const dicasForca = document.getElementById('dicasForca')
  dicasForca.innerHTML = ''

  switch (forca) {
    case 1:
      feedbackForca.textContent = 'Muito fraca'
      dicasForca.innerHTML =
        '<li>Use pelo menos 12 caracteres</li><li>Inclua letras maiúsculas, minúsculas, números e símbolos</li>'
      break
    case 2:
      feedbackForca.textContent = 'Fraca'
      dicasForca.innerHTML =
        '<li>Use pelo menos 12 caracteres</li><li>Inclua diferentes tipos de caracteres (maiúsculas, minúsculas, números e símbolos)</li>'
      break
    case 3:
      feedbackForca.textContent = 'Média'
      dicasForca.innerHTML =
        '<li>Use pelo menos 16 caracteres para torná-la mais forte</li><li>Inclua mais variações de caracteres (maiúsculas, minúsculas, números e símbolos)</li>'
      break
    case 4:
      feedbackForca.textContent = 'Forte'
      dicasForca.innerHTML =
        '<li>Sua senha é forte, mas pode ser ainda melhor!</li><li>Tente usar uma frase ou combinação de palavras para facilitar a memorização.</li>'
      break
    case 5:
      feedbackForca.textContent = 'Muito forte'
      dicasForca.innerHTML = '<li>Parabéns! Sua senha é excelente.</li>'
      break
  }
  dicasForca.style.display = 'block'
}

// Função para copiar a senha
async function copiarSenha() {
  const senha = senhaGeradaInput.value
  if (senha) {
    await navigator.clipboard.writeText(senha)

    // Feedback visual de cópia
    copiarSenhaButton.innerHTML = '<i class="fas fa-check"></i> Copiado!'
    copiarSenhaButton.classList.add('copiado')

    setTimeout(() => {
      copiarSenhaButton.innerHTML = '<i class="fas fa-copy"></i> Copiar'
      copiarSenhaButton.classList.remove('copiado')
    }, 2000)
  } else {
    alert('Não há senha para copiar.')
  }
}

// Função para gerar senha com base na história
function gerarSenhaHistoria() {
  const historia = historiaInput.value.toLowerCase()
  const palavras = historia.split(/\s+/)
  const comprimento = parseInt(comprimentoInput.value)

  if (palavras.length === 0) {
    alert('Por favor, digite uma história para gerar a senha.')
    return
  }

  let senha = ''
  for (let i = 0; i < comprimento; i++) {
    const palavraAleatoria =
      palavras[Math.floor(Math.random() * palavras.length)]
    senha += palavraAleatoria.charAt(0)
  }

  senha = senha.replace(/[^a-zA-Z0-9]/g, '')
  senhaGeradaInput.value = senha
  calcularForcaSenha(senha)
}

// Função para gerar senha com base no tema
function gerarSenhaTema() {
  const tema = temaSelect.value
  const palavras = palavrasTematicas[tema]
  const comprimento = parseInt(comprimentoInput.value)

  let senha = ''
  for (let i = 0; i < comprimento; i++) {
    const palavraAleatoria =
      palavras[Math.floor(Math.random() * palavras.length)]
    senha += palavraAleatoria.charAt(0)
  }

  senha = senha.replace(/[^a-zA-Z0-9]/g, '')
  senhaGeradaInput.value = senha
  calcularForcaSenha(senha)
}

// Adiciona os eventos aos elementos do DOM
gerarSenhaButton.addEventListener('click', gerarSenha)
copiarSenhaButton.addEventListener('click', copiarSenha)
gerarSenhaHistoriaButton.addEventListener('click', gerarSenhaHistoria)
gerarSenhaTemaButton.addEventListener('click', gerarSenhaTema)
senhaGeradaInput.addEventListener('input', () => {
  const senha = senhaGeradaInput.value
  calcularForcaSenha(senha)
})
