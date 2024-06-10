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

  // Função para gerar a senha
  function gerarSenha() {
    const comprimento = parseInt(comprimentoInput.value)
    let caracteresValidos = ''
    let senha = ''

    incluirMaiusculasInput.checked &&
      (caracteresValidos += caracteres.maiusculas)
    incluirMinusculasInput.checked &&
      (caracteresValidos += caracteres.minusculas)
    incluirNumerosInput.checked && (caracteresValidos += caracteres.numeros)
    incluirSimbolosInput.checked && (caracteresValidos += caracteres.simbolos)

    excluirAmbiguosInput.checked &&
      (caracteresValidos = caracteresValidos.replace(
        new RegExp(`[${caracteres.ambiguos}]`, 'g'),
        ''
      ))

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
  }

  // Função para avaliar a força da senha e atualizar a barra de força
  function avaliarForca(senha) {
    let forca = 0
    const comprimento = senha.length

    comprimento >= 12 && forca++
    ;/[A-Z]/.test(senha) && forca++
    ;/[a-z]/.test(senha) && forca++
    ;/[0-9]/.test(senha) && forca++
    ;/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha) && forca++

    // Níveis de força e cores da barra
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

    // Dicas para melhorar a senha
    comprimento < 12 && dicas.push('Use pelo menos 12 caracteres.')
    !/[A-Z]/.test(senha) && dicas.push('Inclua letras maiúsculas.')
    !/[a-z]/.test(senha) && dicas.push('Inclua letras minúsculas.')
    !/[0-9]/.test(senha) && dicas.push('Inclua números.')
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha) &&
      dicas.push('Inclua símbolos.')

    // Atualiza a barra de força
    barraForca.innerHTML = `<div class="${corBarra}" style="width:${
      forca * 20
    }%"></div>`

    // Atualiza o feedback de força e as dicas
    feedbackForca.textContent = `Força: ${nivelForca} (Quebra: ${tempoQuebra})`
    dicasForca.innerHTML = dicas.map(dica => `<li>${dica}</li>`).join('')
  }

  // Função para copiar a senha gerada para a área de transferência
  function copiarSenha() {
    senhaGeradaInput.select()
    document.execCommand('copy')

    // Adiciona a classe para a animação
    copiarSenhaButton.classList.add('copiado')

    // Altera o texto do botão para "Copiado!"
    copiarSenhaButton.innerHTML = '<i class="material-icons">check</i> Copiado!'

    // Remove a classe e restaura o texto após um curto período
    setTimeout(() => {
      copiarSenhaButton.classList.remove('copiado')
      copiarSenhaButton.innerHTML =
        '<i class="material-icons">content_copy</i> Copiar'
    }, 1500) // 1.5 segundos
  }

  // Função para gerar uma senha Wi-Fi
  function gerarSenhaWifi() {
    const comprimento = 12
    let senha = ''

    // Inclui letras maiúsculas, minúsculas, números e alguns símbolos seguros para Wi-Fi
    const caracteresValidos =
      caracteres.maiusculas + caracteres.minusculas + caracteres.numeros + '-_.'
    for (let i = 0; i < comprimento; i++) {
      senha += caracteresValidos.charAt(
        Math.floor(Math.random() * caracteresValidos.length)
      )
    }

    senhaGeradaInput.value = senha
    avaliarForca(senha)
  }

  // Função para gerar um PIN
  function gerarPin() {
    const comprimento = parseInt(comprimentoPinInput.value)
    let pin = ''
    for (let i = 0; i < comprimento; i++) {
      pin += Math.floor(Math.random() * 10)
    }
    senhaGeradaInput.value = pin
    avaliarForca(pin)
  }

  // Função para gerar uma senha a partir de uma história
  function gerarSenhaHistoria() {
    const historia = historiaTextarea.value.toLowerCase()
    const palavras = historia.split(/\s+/)
    const senha = palavras
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '')
    senhaGeradaInput.value = senha
    avaliarForca(senha)
  }

  // Função para gerar uma senha a partir de um tema
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
  }

  // Eventos
  gerarSenhaButton.addEventListener('click', gerarSenha)
  copiarSenhaButton.addEventListener('click', copiarSenha)
  testarForcaButton.addEventListener('click', function () {
    avaliarForca(senhaTesteInput.value)
  })
  gerarSenhaWifiButton.addEventListener('click', gerarSenhaWifi)
  gerarPinButton.addEventListener('click', gerarPin)
  gerarSenhaHistoriaButton.addEventListener('click', gerarSenhaHistoria)
  gerarSenhaTemaButton.addEventListener('click', gerarSenhaTema)
})
