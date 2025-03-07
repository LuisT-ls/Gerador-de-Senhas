// generator.js - Módulo de geração de senhas

import { getRandomInt, shuffleArray } from './utils.js'

// Conjuntos de caracteres
const CHARS = {
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  AMBIGUOUS: 'l1IO0'
}

// Lista de palavras para passphrase (versão reduzida para exemplo)
const WORDS = [
  'casa',
  'tempo',
  'amor',
  'vida',
  'dia',
  'ano',
  'pessoa',
  'mundo',
  'caminho',
  'água',
  'terra',
  'sol',
  'mar',
  'cidade',
  'flor',
  'montanha',
  'rio',
  'fogo',
  'livro',
  'música',
  'arte',
  'céu',
  'porta',
  'janela',
  'mesa',
  'cadeira',
  'carro',
  'viagem',
  'festa',
  'amigo',
  'família',
  'trabalho',
  'estudo',
  'filme',
  'comida',
  'bebida',
  'roupa',
  'escola',
  'professor',
  'aluno',
  'médico',
  'saúde',
  'coração',
  'mente',
  'corpo',
  'espírito',
  'paz',
  'felicidade',
  'alegria',
  'sonho',
  'esperança',
  'força',
  'energia',
  'luz',
  'ar',
  'planta',
  'animal',
  'pássaro',
  'verde',
  'azul',
  'vermelho',
  'amarelo',
  'branco',
  'preto',
  'pequeno',
  'grande',
  'novo',
  'velho',
  'rápido',
  'lento',
  'quente',
  'frio',
  'fácil',
  'difícil',
  'digital',
  'seguro',
  'chave',
  'senha',
  'acesso',
  'rede',
  'internet',
  'dados',
  'sistema',
  'código',
  'programa',
  'tecla',
  'mouse',
  'tela',
  'memória',
  'disco',
  'arquivo',
  'pasta',
  'mensagem',
  'email',
  'conectar',
  'download',
  'upload',
  'link'
]

/**
 * Gera uma senha aleatória com base nas opções fornecidas
 * @param {Object} options - Opções de configuração
 * @returns {string} Senha gerada
 */
export function generatePassword(options = {}) {
  // Opções padrão
  const config = {
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
    excludeRepeating: false,
    startWithUppercase: false,
    endWithNumber: false,
    ...options
  }

  // Garantir comprimento mínimo
  config.length = Math.max(config.length, 4)

  // Construir conjunto de caracteres disponíveis
  let charset = ''
  if (config.uppercase) charset += CHARS.UPPERCASE
  if (config.lowercase) charset += CHARS.LOWERCASE
  if (config.numbers) charset += CHARS.NUMBERS
  if (config.symbols) charset += CHARS.SYMBOLS

  // Remover caracteres ambíguos se necessário
  if (config.excludeAmbiguous) {
    for (const char of CHARS.AMBIGUOUS) {
      charset = charset.replace(new RegExp(char, 'g'), '')
    }
  }

  // Se não houver caracteres disponíveis, usar minúsculas como fallback
  if (!charset) {
    charset = CHARS.LOWERCASE
  }

  // Gerar senha
  let password = ''
  let lastChar = ''

  // Se tiver requisito de começar com letra maiúscula
  if (config.startWithUppercase) {
    const uppercaseChars = config.excludeAmbiguous
      ? CHARS.UPPERCASE.replace(/[IO]/g, '')
      : CHARS.UPPERCASE

    if (uppercaseChars.length > 0) {
      const randomChar =
        uppercaseChars[getRandomInt(0, uppercaseChars.length - 1)]
      password += randomChar
      lastChar = randomChar
    }
  }

  // Gerar o resto da senha exceto o último caractere se precisar terminar com número
  const remainingLength = config.endWithNumber
    ? config.length - password.length - 1
    : config.length - password.length

  for (let i = 0; i < remainingLength; i++) {
    let randomChar
    let attempts = 0
    const maxAttempts = 10 // Evitar loop infinito

    do {
      randomChar = charset[getRandomInt(0, charset.length - 1)]
      attempts++
    } while (
      config.excludeRepeating &&
      randomChar === lastChar &&
      attempts < maxAttempts
    )

    password += randomChar
    lastChar = randomChar
  }

  // Se tiver requisito de terminar com número
  if (config.endWithNumber) {
    const numberChars = config.excludeAmbiguous
      ? CHARS.NUMBERS.replace(/[10]/g, '')
      : CHARS.NUMBERS

    if (numberChars.length > 0) {
      password += numberChars[getRandomInt(0, numberChars.length - 1)]
    }
  }

  return password
}

/**
 * Gera uma senha específica para Wi-Fi
 * @param {Object} options - Opções de configuração
 * @returns {string} Senha para Wi-Fi
 */
export function generateWifiPassword(options = {}) {
  const config = {
    length: 12,
    memorable: true,
    ...options
  }

  if (config.memorable) {
    // Gerar senha memorizável combinando palavras e números
    const word1 = WORDS[getRandomInt(0, WORDS.length - 1)]
    const word2 = WORDS[getRandomInt(0, WORDS.length - 1)]
    const number = getRandomInt(100, 999)
    const symbol = '!@#$%&*'[getRandomInt(0, 6)]

    // Capitalizar primeira letra de cada palavra
    const formattedWord1 = word1.charAt(0).toUpperCase() + word1.slice(1)
    const formattedWord2 = word2.charAt(0).toUpperCase() + word2.slice(1)

    return `${formattedWord1}${formattedWord2}${number}${symbol}`
  } else {
    // Usar o gerador padrão mas garantir caracteres de todos os tipos
    return generatePassword({
      length: config.length,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: true
    })
  }
}

/**
 * Gera um PIN numérico
 * @param {Object} options - Opções de configuração
 * @returns {string} PIN gerado
 */
export function generatePIN(options = {}) {
  const config = {
    length: 4,
    avoidSequences: true,
    avoidRepeating: true,
    ...options
  }

  // Garantir comprimento válido
  config.length = Math.max(config.length, 3)
  config.length = Math.min(config.length, 12)

  let pin = ''
  let lastDigit = -1
  const allDigits = '0123456789'

  for (let i = 0; i < config.length; i++) {
    let digit
    let validDigit = false

    while (!validDigit) {
      digit = getRandomInt(0, 9)

      // Verificar se não está repetindo
      const isRepeating = config.avoidRepeating && digit === lastDigit

      // Verificar se não forma sequência
      const isSequence =
        config.avoidSequences &&
        ((lastDigit !== -1 &&
          (digit === lastDigit + 1 || digit === lastDigit - 1)) ||
          (pin.length >= 2 &&
            ((digit === parseInt(pin[pin.length - 1]) + 1 &&
              parseInt(pin[pin.length - 1]) ===
                parseInt(pin[pin.length - 2]) + 1) ||
              (digit === parseInt(pin[pin.length - 1]) - 1 &&
                parseInt(pin[pin.length - 1]) ===
                  parseInt(pin[pin.length - 2]) - 1))))

      validDigit = !isRepeating && !isSequence
    }

    pin += digit
    lastDigit = digit
  }

  return pin
}

/**
 * Gera uma passphrase (frase-senha)
 * @param {Object} options - Opções de configuração
 * @returns {string} Passphrase gerada
 */
export function generatePassphrase(options = {}) {
  const config = {
    wordCount: 4,
    separator: '-',
    capitalize: true,
    addNumbers: true,
    ...options
  }

  // Garantir contagem de palavras válida
  config.wordCount = Math.max(config.wordCount, 2)
  config.wordCount = Math.min(config.wordCount, 10)

  // Selecionar palavras aleatórias
  const selectedWords = []
  const shuffledWords = shuffleArray(WORDS)

  for (let i = 0; i < config.wordCount; i++) {
    if (i < shuffledWords.length) {
      selectedWords.push(shuffledWords[i])
    }
  }

  // Aplicar capitalização se necessário
  let processedWords = selectedWords
  if (config.capitalize) {
    processedWords = selectedWords.map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    )
  }

  // Montar a passphrase
  let passphrase = processedWords.join(config.separator)

  // Adicionar números se necessário
  if (config.addNumbers) {
    passphrase += config.separator + getRandomInt(100, 999)
  }

  return passphrase
}

/**
 * Gera múltiplas senhas com as mesmas configurações
 * @param {number} count - Número de senhas a gerar
 * @param {Object} options - Opções de configuração
 * @returns {Array<string>} Array de senhas geradas
 */
export function generateMultiplePasswords(count, options = {}) {
  const passwords = []

  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options))
  }

  return passwords
}
