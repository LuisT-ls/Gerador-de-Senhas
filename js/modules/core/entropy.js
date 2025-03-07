// entropy.js - Módulo para cálculo de entropia e força de senhas

/**
 * Calcula a entropia de uma senha
 * @param {string} password - Senha a ser avaliada
 * @returns {number} Entropia em bits
 */
export function calculateEntropy(password) {
  if (!password) return 0

  // Verifica quais conjuntos de caracteres estão sendo usados
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[^A-Za-z0-9]/.test(password)

  // Calcula o tamanho do conjunto de caracteres
  let poolSize = 0
  if (hasUppercase) poolSize += 26
  if (hasLowercase) poolSize += 26
  if (hasNumbers) poolSize += 10
  if (hasSymbols) poolSize += 33 // Estimativa de símbolos comuns

  // Se não houver caracteres válidos, retorna 0
  if (poolSize === 0) return 0

  // Fórmula da entropia: comprimento * log2(poolSize)
  return Math.round(password.length * Math.log2(poolSize))
}

/**
 * Categoriza a força de uma senha com base na entropia
 * @param {number} entropy - Entropia da senha em bits
 * @returns {string} Classificação: "muito-fraca", "fraca", "media", "forte" ou "muito-forte"
 */
export function getPasswordStrength(entropy) {
  if (entropy < 28) return 'muito-fraca'
  if (entropy < 36) return 'fraca'
  if (entropy < 60) return 'media'
  if (entropy < 80) return 'forte'
  return 'muito-forte'
}

/**
 * Estima o tempo necessário para quebrar uma senha por força bruta
 * @param {number} entropy - Entropia da senha em bits
 * @returns {string} Descrição do tempo estimado
 */
export function estimateCrackTime(entropy) {
  // Suposição: 10 bilhões de tentativas por segundo (computador potente)
  const attempts = Math.pow(2, entropy)
  const secondsToCrack = attempts / (10 * Math.pow(10, 9))

  // Converter para unidades mais adequadas
  if (secondsToCrack < 60) {
    return 'menos de um minuto'
  } else if (secondsToCrack < 3600) {
    return `${Math.round(secondsToCrack / 60)} minutos`
  } else if (secondsToCrack < 86400) {
    return `${Math.round(secondsToCrack / 3600)} horas`
  } else if (secondsToCrack < 31536000) {
    return `${Math.round(secondsToCrack / 86400)} dias`
  } else if (secondsToCrack < 31536000 * 100) {
    return `${Math.round(secondsToCrack / 31536000)} anos`
  } else if (secondsToCrack < 31536000 * 1000) {
    return 'séculos'
  } else if (secondsToCrack < 31536000 * 1000000) {
    return 'milênios'
  } else {
    return 'milhões de anos'
  }
}

/**
 * Avalia uma senha e retorna uma análise detalhada
 * @param {string} password - Senha a ser avaliada
 * @returns {Object} Objeto contendo entropia, força e feedback
 */
export function analyzePassword(password) {
  if (!password) {
    return {
      entropy: 0,
      strength: 'muito-fraca',
      crackTime: 'instantâneo',
      feedback: []
    }
  }

  const entropy = calculateEntropy(password)
  const strength = getPasswordStrength(entropy)
  const crackTime = estimateCrackTime(entropy)

  // Gerar feedback baseado nas características da senha
  const feedback = []

  // Comprimento
  if (password.length < 8) {
    feedback.push({
      type: 'negativo',
      message: `${password.length} caracteres - muito curta`
    })
  } else if (password.length < 12) {
    feedback.push({
      type: 'neutro',
      message: `${password.length} caracteres - comprimento aceitável`
    })
  } else {
    feedback.push({
      type: 'positivo',
      message: `${password.length} caracteres - bom comprimento`
    })
  }

  // Variedade de caracteres
  if (/[A-Z]/.test(password)) {
    feedback.push({ type: 'positivo', message: 'Inclui letras maiúsculas' })
  } else {
    feedback.push({ type: 'negativo', message: 'Não inclui letras maiúsculas' })
  }

  if (/[a-z]/.test(password)) {
    feedback.push({ type: 'positivo', message: 'Inclui letras minúsculas' })
  } else {
    feedback.push({ type: 'negativo', message: 'Não inclui letras minúsculas' })
  }

  if (/[0-9]/.test(password)) {
    feedback.push({ type: 'positivo', message: 'Inclui números' })
  } else {
    feedback.push({ type: 'negativo', message: 'Não inclui números' })
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    feedback.push({ type: 'positivo', message: 'Inclui símbolos especiais' })
  } else {
    feedback.push({
      type: 'negativo',
      message: 'Não inclui símbolos especiais'
    })
  }

  // Padrões comuns
  if (/(.)\1{2,}/.test(password)) {
    feedback.push({
      type: 'negativo',
      message: 'Contém caracteres repetidos consecutivamente'
    })
  }

  if (/^[A-Z].*[0-9]$/.test(password)) {
    feedback.push({
      type: 'neutro',
      message: 'Padrão comum: começa com maiúscula e termina com número'
    })
  }

  if (/(?:123|abc|qwerty|senha|password)/i.test(password)) {
    feedback.push({
      type: 'negativo',
      message: 'Contém sequências ou palavras comuns'
    })
  }

  // Informação sobre tempo para quebrar
  feedback.push({
    type: 'info',
    message: `Tempo estimado para quebrar: ${crackTime}`
  })

  return {
    entropy,
    strength,
    crackTime,
    feedback
  }
}
