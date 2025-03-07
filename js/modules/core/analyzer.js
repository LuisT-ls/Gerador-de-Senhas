// analyzer.js - Módulo para análise de senhas

import { analyzePassword } from './entropy.js'

/**
 * Verifica se uma senha foi comprometida em algum vazamento conhecido
 * @param {string} password - Senha a ser verificada
 * @returns {Promise<boolean>} Promise resolvida com true se comprometida
 */
export async function checkPasswordCompromised(password) {
  // Esta é uma implementação simulada
  // Em uma aplicação real, seria usada uma API como a do Have I Been Pwned
  // Usando k-anonymity para não enviar a senha completa

  // Simular uma verificação
  return new Promise(resolve => {
    // Lista de senhas comuns para simulação
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

    // Aguardar um pouco para simular uma requisição
    setTimeout(() => {
      // Verificar se está na lista de senhas comuns
      const isCompromised = commonPasswords.includes(password.toLowerCase())
      resolve(isCompromised)
    }, 500)
  })
}

/**
 * Avalia o quão comum ou previsível uma senha pode ser
 * @param {string} password - Senha a ser avaliada
 * @returns {number} Pontuação de 0 (muito comum) a 100 (único)
 */
export function evaluatePasswordCommonality(password) {
  let score = 100

  // Verificar padrões comuns e reduzir a pontuação

  // Palavras comuns
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
    'dragon'
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
    'zxcvbnm'
  ]

  for (const sequence of keyboardSequences) {
    if (password.toLowerCase().includes(sequence)) {
      score -= 15
      break
    }
  }

  // Repetições
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
  if (/(?:19[5-9]\d|20[0-2]\d)/.test(password)) {
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

  // Limitar entre 0 e 100
  return Math.max(0, Math.min(100, score))
}

/**
 * Avalia se uma senha contém informações pessoais (simulação)
 * @param {string} password - Senha a ser avaliada
 * @returns {boolean} Verdadeiro se contém informações pessoais
 */
export function containsPersonalInfo(password) {
  // Em uma aplicação real, isso seria verificado com informações do usuário
  // Aqui apenas simulamos algumas verificações comuns

  // Padrões de datas (DD/MM/YYYY, DD-MM-YYYY, etc.)
  if (/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4}/.test(password)) {
    return true
  }

  // Nomes de meses dentro da senha podem indicar datas de nascimento
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
    'dez'
  ]
  for (const month of months) {
    if (password.toLowerCase().includes(month) && /\d{1,4}/.test(password)) {
      return true
    }
  }

  // Formato de telefone
  if (/\(?(\d{2})\)?[-. ]?(\d{4,5})[-. ]?(\d{4})/.test(password)) {
    return true
  }

  return false
}

/**
 * Executa uma análise completa da senha
 * @param {string} password - Senha a ser analisada
 * @returns {Promise<Object>} Resultado da análise
 */
export async function fullPasswordAnalysis(password) {
  if (!password) {
    return {
      entropy: 0,
      strength: 'muito-fraca',
      suggestions: ['Digite uma senha para analisar'],
      isCompromised: false,
      uniqueness: 0
    }
  }

  // Analisar entropia e força
  const basicAnalysis = analyzePassword(password)

  // Verificar se foi comprometida
  const isCompromised = await checkPasswordCompromised(password)

  // Avaliar quão única é a senha
  const uniqueness = evaluatePasswordCommonality(password)

  // Verificar informações pessoais
  const hasPersonalInfo = containsPersonalInfo(password)

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

  if (hasPersonalInfo) {
    suggestions.push(
      'A senha parece conter informações pessoais, o que reduz a segurança.'
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
    hasPersonalInfo,
    suggestions
  }
}
