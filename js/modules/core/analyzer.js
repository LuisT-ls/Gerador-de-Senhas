// analyzer.js - Módulo para análise de senhas

import { analyzePassword } from './entropy.js'

/**
 * Calcula o hash SHA-1 de uma string
 * @param {string} str - String para calcular o hash
 * @returns {Promise<string>} Hash SHA-1 em formato hexadecimal
 */
async function sha1Hash(str) {
  // Converter a string para um array de bytes
  const encoder = new TextEncoder()
  const data = encoder.encode(str)

  // Calcular o hash SHA-1
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)

  // Converter o buffer para string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex.toUpperCase()
}

/**
 * Verifica se uma senha foi comprometida em vazamentos conhecidos usando a API do HIBP
 * @param {string} password - Senha a ser verificada
 * @returns {Promise<boolean>} Promise resolvida com true se comprometida
 */
export async function checkPasswordCompromised(password) {
  try {
    // Calcular o hash SHA-1 da senha
    const hash = await sha1Hash(password)

    // Pegar os primeiros 5 caracteres do hash (prefixo k-anonymity)
    const prefix = hash.substring(0, 5)
    const suffix = hash.substring(5)

    // Fazer a requisição à API do Have I Been Pwned (HIBP)
    // Usando o método k-anonymity para não enviar a senha completa
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        method: 'GET',
        headers: {
          'Add-Padding': 'true', // Dificulta análise de timing
          'User-Agent': 'PasswordGenerator-SecurityTool' // Identificar a aplicação
        }
      }
    )

    if (!response.ok) {
      console.error('Falha ao verificar senha comprometida:', response.status)
      return false // Em caso de erro, assumir que não está comprometida
    }

    // Obter a lista de sufixos e contagens
    const data = await response.text()
    const lines = data.split('\n')

    // Procurar pelo sufixo do hash na resposta
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':')

      if (hashSuffix.trim() === suffix) {
        // Encontrou uma correspondência
        return parseInt(count) > 0
      }
    }

    // Nenhuma correspondência encontrada
    return false
  } catch (error) {
    console.error('Erro ao verificar senha comprometida:', error)

    // Fallback para verificação local em caso de erro na API
    const commonPasswords = [
      'password',
      '123456',
      'qwerty',
      'admin',
      'welcome',
      'senha',
      'abc123',
      '123456789',
      '12345678',
      'password1'
    ]

    return commonPasswords.includes(password.toLowerCase())
  }
}

/**
 * Avalia o quão comum ou previsível uma senha pode ser
 * @param {string} password - Senha a ser avaliada
 * @returns {number} Pontuação de 0 (muito comum) a 100 (único)
 */
export function evaluatePasswordCommonality(password) {
  let score = 100

  // Verificar padrões comuns e reduzir a pontuação

  // Palavras comuns em português e inglês
  const commonWords = [
    'password',
    'senha',
    'admin',
    'user',
    'login',
    'welcome',
    'letmein',
    'qwerty',
    'iloveyou',
    'monkey',
    'dragon',
    'football',
    'baseball',
    'twitter',
    'facebook',
    'instagram',
    'linkedin',
    'google',
    'youtube',
    'brasil',
    'soccer',
    'master',
    'sunshine',
    'princess',
    'starwars'
  ]

  for (const word of commonWords) {
    if (password.toLowerCase().includes(word)) {
      score -= 20
      break
    }
  }

  // Sequências de teclado
  const keyboardSequences = [
    'qwerty',
    'asdfgh',
    'zxcvbn',
    '123456',
    '654321',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
    '1qaz2wsx',
    'qazwsx',
    'azerty',
    '102030'
  ]

  for (const sequence of keyboardSequences) {
    if (password.toLowerCase().includes(sequence)) {
      score -= 15
      break
    }
  }

  // Repetições de caracteres
  if (/(.)\1{2,}/.test(password)) {
    score -= 10
  }

  // Sequências numéricas ou alfabéticas
  if (
    /(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(
      password
    )
  ) {
    score -= 10
  }

  if (
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/.test(
      password.toLowerCase()
    )
  ) {
    score -= 10
  }

  // Anos comuns (1950-2030)
  if (/(?:19[5-9]\d|20[0-3]\d)/.test(password)) {
    score -= 5
  }

  // Meses ou dias da semana
  const timePatterns = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
    'seg',
    'ter',
    'qua',
    'qui',
    'sex',
    'sab',
    'dom',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
    'janeiro',
    'fevereiro',
    'marco',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ]

  for (const pattern of timePatterns) {
    if (password.toLowerCase().includes(pattern)) {
      score -= 5
      break
    }
  }

  // Padrões l33t (substituições de letras por números ou símbolos)
  if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    const l33tPattern = password
      .toLowerCase()
      .replace(/0/g, 'o')
      .replace(/1/g, 'i')
      .replace(/3/g, 'e')
      .replace(/4/g, 'a')
      .replace(/5/g, 's')
      .replace(/7/g, 't')
      .replace(/8/g, 'b')
      .replace(/\$/g, 's')
      .replace(/@/g, 'a')

    for (const word of commonWords) {
      if (l33tPattern.includes(word)) {
        score -= 15
        break
      }
    }
  }

  // Variantes comuns de senhas
  if (/^[a-zA-Z]+[0-9]{1,4}$/.test(password)) {
    // palavra seguida de números
    score -= 10
  }

  if (/^[a-zA-Z]+[0-9!@#$%^&*]{1,2}$/.test(password)) {
    // palavra seguida de 1-2 símbolos/números
    score -= 10
  }

  // Limitar entre 0 e 100
  return Math.max(0, Math.min(100, score))
}

/**
 * Avalia se uma senha contém informações pessoais, com verificações mais avançadas
 * @param {string} password - Senha a ser avaliada
 * @param {Object} userData - Dados pessoais do usuário (opcional)
 * @returns {Object} Resultado da verificação com detalhes
 */
export function containsPersonalInfo(password, userData = {}) {
  const lowercasePassword = password.toLowerCase()
  const result = {
    containsPersonalInfo: false,
    detectedPatterns: []
  }

  // Verificar dados do usuário se disponíveis
  if (userData.name) {
    const nameParts = userData.name.toLowerCase().split(/\s+/)
    for (const part of nameParts) {
      if (part.length > 2 && lowercasePassword.includes(part)) {
        result.containsPersonalInfo = true
        result.detectedPatterns.push('nome')
        break
      }
    }
  }

  if (userData.email) {
    const emailParts = userData.email.split('@')[0].toLowerCase()
    if (emailParts.length > 2 && lowercasePassword.includes(emailParts)) {
      result.containsPersonalInfo = true
      result.detectedPatterns.push('email')
    }
  }

  if (userData.birthdate) {
    const birthDate = new Date(userData.birthdate)
    const birthYear = birthDate.getFullYear().toString()
    const birthMonth = (birthDate.getMonth() + 1).toString().padStart(2, '0')
    const birthDay = birthDate.getDate().toString().padStart(2, '0')

    if (
      lowercasePassword.includes(birthYear) ||
      lowercasePassword.includes(birthYear.substring(2)) ||
      lowercasePassword.includes(`${birthDay}${birthMonth}`) ||
      lowercasePassword.includes(`${birthMonth}${birthDay}`)
    ) {
      result.containsPersonalInfo = true
      result.detectedPatterns.push('data de nascimento')
    }
  }

  // Verificar padrões de datas (independentemente dos dados do usuário)
  const datePatterns = [
    /\b\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4}\b/, // DD/MM/YYYY, DD-MM-YYYY
    /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/, // D/M/YYYY
    /\b\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}\b/ // YYYY/MM/DD
  ]

  for (const pattern of datePatterns) {
    if (pattern.test(password)) {
      result.containsPersonalInfo = true
      result.detectedPatterns.push('formato de data')
      break
    }
  }

  // Verificar meses junto com números (possível data de nascimento)
  const months = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ]

  for (const month of months) {
    if (lowercasePassword.includes(month) && /\d{1,4}/.test(password)) {
      result.containsPersonalInfo = true
      result.detectedPatterns.push('mês com número')
      break
    }
  }

  // Verificar formatos de telefone
  const phonePatterns = [
    /\b\d{10,11}\b/, // Número de telefone brasileiro sem formatação
    /\b\d{8,9}\b/, // Apenas o número sem DDD
    /\(\d{2}\)\s*\d{4,5}[\-\s]?\d{4}\b/, // (XX) XXXXX-XXXX
    /\b\d{2}[\s\-]?\d{4,5}[\s\-]?\d{4}\b/ // XX XXXXX XXXX
  ]

  for (const pattern of phonePatterns) {
    if (pattern.test(password)) {
      result.containsPersonalInfo = true
      result.detectedPatterns.push('número de telefone')
      break
    }
  }

  // Verificar CEPs brasileiros
  if (/\b\d{5}[\-]?\d{3}\b/.test(password)) {
    result.containsPersonalInfo = true
    result.detectedPatterns.push('CEP')
  }

  // Verificar possíveis nomes de pessoas
  const commonNames = [
    'maria',
    'jose',
    'joao',
    'ana',
    'antonio',
    'carlos',
    'paulo',
    'pedro',
    'lucas',
    'luiz',
    'marcos',
    'luis',
    'gabriel',
    'rafael',
    'daniel',
    'marcelo',
    'bruno',
    'eduardo',
    'felipe',
    'rodrigo',
    'manoel',
    'john',
    'mary',
    'james',
    'robert',
    'michael',
    'william',
    'david',
    'richard'
  ]

  for (const name of commonNames) {
    if (name.length > 3 && lowercasePassword.includes(name)) {
      result.containsPersonalInfo = true
      result.detectedPatterns.push('nome próprio')
      break
    }
  }

  return result
}

/**
 * Executa uma análise completa da senha
 * @param {string} password - Senha a ser analisada
 * @param {Object} userData - Dados do usuário para verificação (opcional)
 * @returns {Promise<Object>} Resultado da análise
 */
export async function fullPasswordAnalysis(password, userData = {}) {
  if (!password) {
    return {
      entropy: 0,
      strength: 'muito-fraca',
      suggestions: ['Digite uma senha para analisar'],
      isCompromised: false,
      uniqueness: 0,
      personalInfo: { containsPersonalInfo: false, detectedPatterns: [] }
    }
  }

  // Analisar entropia e força
  const basicAnalysis = analyzePassword(password)

  // Verificar se foi comprometida
  const isCompromised = await checkPasswordCompromised(password)

  // Avaliar quão única é a senha
  const uniqueness = evaluatePasswordCommonality(password)

  // Verificar informações pessoais
  const personalInfo = containsPersonalInfo(password, userData)

  // Gerar sugestões
  const suggestions = []

  if (isCompromised) {
    suggestions.push(
      'Esta senha foi encontrada em vazamentos de dados. Evite usá-la!'
    )
  }

  if (uniqueness < 40) {
    suggestions.push(
      'Esta senha segue padrões comuns e pode ser facilmente adivinhada.'
    )
  }

  if (personalInfo.containsPersonalInfo) {
    suggestions.push(
      `A senha contém possíveis informações pessoais (${personalInfo.detectedPatterns.join(
        ', '
      )}), o que reduz a segurança.`
    )
  }

  if (password.length < 12) {
    suggestions.push(
      'Aumente o comprimento da senha para pelo menos 12 caracteres.'
    )
  }

  if (!/[A-Z]/.test(password)) {
    suggestions.push('Adicione letras maiúsculas para aumentar a segurança.')
  }

  if (!/[a-z]/.test(password)) {
    suggestions.push('Adicione letras minúsculas para aumentar a segurança.')
  }

  if (!/[0-9]/.test(password)) {
    suggestions.push('Adicione números para aumentar a segurança.')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    suggestions.push('Adicione símbolos especiais para aumentar a segurança.')
  }

  // Se a senha é forte e não tem sugestões específicas
  if (suggestions.length === 0 && basicAnalysis.strength === 'muito-forte') {
    suggestions.push(
      'Excelente senha! Continue usando senhas fortes como esta.'
    )
  }

  return {
    ...basicAnalysis,
    isCompromised,
    uniqueness,
    personalInfo,
    suggestions
  }
}
