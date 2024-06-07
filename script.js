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

let encryptedPasswords = []

// Função para gerar a senha
function gerarSenha() {
  const comprimento = parseInt(comprimentoInput.value)
  const incluirMaiusculas = incluirMaiusculasInput.checked
  const incluirMinusculas = incluirMinusculasInput.checked
  const incluirNumeros = incluirNumerosInput.checked
  const incluirSimbolos = incluirSimbolosInput.checked
  const excluirAmbiguos = excluirAmbiguosInput.checked

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

  salvarSenhaNoHistorico(senha)
  carregarHistoricoSenhas()
}

// Adiciona um event listener para verificar a senha em tempo real
senhaGeradaInput.addEventListener('input', () => {
  const senha = senhaGeradaInput.value
  calcularForcaSenha(senha)
})

// Função para calcular a força da senha e fornecer dicas
function calcularForcaSenha(senha) {
  let forca = 0
  const comprimento = senha.length // Pontos por comprimento

  if (comprimento >= 16) forca += 4
  else if (comprimento >= 12) forca += 3
  else if (comprimento >= 8) forca += 2
  else forca += 1 // Pontos por tipo de caractere

  if (senha.match(/[A-Z]/) && senha.match(/[a-z]/)) forca += 2
  if (senha.match(/[0-9]/)) forca += 2
  if (senha.match(/[^A-Za-z0-9]/)) forca += 3 // Pontos extras por combinações

  if (senha.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) forca += 2
  if (senha.match(/([a-zA-Z])/) && senha.match(/([0-9])/)) forca += 2
  if (senha.match(/([a-zA-Z0-9])/) && senha.match(/([^A-Za-z0-9])/)) forca += 3 // Normalizar a força para 5 níveis

  forca = Math.min(Math.round(forca / 3), 5) // Atualizar a barra de força

  barraForca.style.width = `${forca * 20}%` // Remove todas as classes de força anteriores

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

    // Feedback visual de cópia (opcional)
    const copiarButton = document.getElementById('copiarSenha')
    copiarButton.innerHTML = '<i class="fas fa-check"></i> Copiado!' // Altera o ícone e o texto do botão para indicar sucesso
    setTimeout(() => {
      copiarButton.innerHTML = '<i class="fas fa-copy"></i> Copiar' // Retorna ao estado original após um tempo
    }, 2000) // 2 segundos (2000 milissegundos)
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

// Função para criptografar a senha
async function encryptPassword(password) {
  const key = await generateKey()
  const iv = crypto.getRandomValues(new Uint8Array(12)) // Vetor de inicialização
  const encoded = new TextEncoder().encode(password)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  )

  return {
    ciphertext: Array.from(new Uint8Array(ciphertext)),
    iv: Array.from(iv)
  }
}

// Função para descriptografar a senha
async function decryptPassword(encryptedData) {
  const key = await generateKey()
  const ciphertext = new Uint8Array(encryptedData.ciphertext)
  const iv = new Uint8Array(encryptedData.iv)

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  )

  return new TextDecoder().decode(decrypted)
}

// Função para gerar a chave de criptografia (AES-GCM)
async function generateKey() {
  // Use uma senha mestra ou um método mais seguro para derivar a chave
  const masterPassword = 'sua_senha_mestra_forte' // Substitua por uma senha forte ou outro método
  const encoded = new TextEncoder().encode(masterPassword)
  return await crypto.subtle.importKey(
    'raw',
    encoded,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
}

// Função para salvar a senha criptografada no histórico (modificada)
async function salvarSenhaNoHistorico(senha) {
  const encryptedData = await encryptPassword(senha)
  encryptedPasswords.push(encryptedData)

  // Salva as senhas criptografadas no localStorage
  localStorage.setItem('historicoSenhas', JSON.stringify(encryptedPasswords))
}

// Função para carregar o histórico de senhas (modificada)
async function carregarHistoricoSenhas() {
  const encryptedPasswordsString = localStorage.getItem('historicoSenhas')
  if (encryptedPasswordsString) {
    encryptedPasswords = JSON.parse(encryptedPasswordsString)
  }

  const listaSenhas = document.getElementById('listaSenhas')
  listaSenhas.innerHTML = '' // Limpa a lista

  const cabecalho = document.createElement('li')
  cabecalho.classList.add('cabecalho')
  cabecalho.innerHTML = `
    <span>Senha</span>
    <span>Ações</span>
  `
  listaSenhas.appendChild(cabecalho)

  // Declaração e preenchimento do array decryptedPasswords (corrigido)
  const decryptedPasswords = await Promise.all(
    encryptedPasswords.map(decryptPassword)
  )

  for (let i = 0; i < decryptedPasswords.length; i++) {
    const senha = decryptedPasswords[i]
    const listItem = document.createElement('li')
    listItem.textContent = senha

    const acoes = document.createElement('div')
    acoes.classList.add('acoes')

    const copiarButton = document.createElement('button')
    copiarButton.innerHTML = '<i class="fas fa-copy"></i>'
    copiarButton.addEventListener('click', () => {
      navigator.clipboard.writeText(senha)
      alert('Senha copiada para a área de transferência!')
    })
    acoes.appendChild(copiarButton)

    const excluirButton = document.createElement('button')
    excluirButton.innerHTML = '<i class="fas fa-trash-alt"></i>'
    excluirButton.addEventListener('click', () => {
      encryptedPasswords.splice(i, 1)
      localStorage.setItem(
        'historicoSenhas',
        JSON.stringify(encryptedPasswords)
      )
      carregarHistoricoSenhas() // Recarrega o histórico
    })
    acoes.appendChild(excluirButton)

    listItem.appendChild(acoes)
    listaSenhas.appendChild(listItem)
  }
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

// Carrega o histórico de senhas ao iniciar
carregarHistoricoSenhas()
