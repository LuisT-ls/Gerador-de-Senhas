// utils.js - Funções utilitárias para toda a aplicação

/**
 * Gera um ID único baseado em timestamp
 * @returns {string} ID único
 */
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Formata uma data para exibição amigável
 * @param {Date|number|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export function formatDate(date) {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Copia texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<boolean>} - Se a cópia foi bem-sucedida
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Falha ao copiar texto: ', err)
    return false
  }
}

/**
 * Limita o comprimento de uma string e adiciona reticências
 * @param {string} str - String original
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} String reduzida ou original
 */
export function truncateString(str, maxLength = 30) {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

/**
 * Gera um número aleatório entre min e max (inclusive)
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatório
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 * @param {Array} array - Array a ser embaralhado
 * @returns {Array} Novo array embaralhado
 */
export function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Debounce para limitar a frequência de execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {number} delay - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
export function debounce(func, delay = 300) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Verifica se um objeto está vazio
 * @param {Object} obj - Objeto a ser verificado
 * @returns {boolean} Verdadeiro se o objeto estiver vazio
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} unsafe - String não segura
 * @returns {string} String segura
 */
export function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Remove acentos de uma string
 * @param {string} str - String com acentos
 * @returns {string} String sem acentos
 */
export function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
