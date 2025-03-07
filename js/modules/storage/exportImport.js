// exportImport.js - Funcionalidades de exportação e importação de senhas

import { showNotification } from '../ui/notifications.js'

// Nome da chave no localStorage para senhas salvas
const SAVED_PASSWORDS_KEY = 'savedPasswords'

/**
 * Inicializa as funcionalidades de exportação e importação
 */
export function initExportImport() {
  // Referências DOM
  const exportarCSV = document.getElementById('exportarCSV')
  const exportarJSON = document.getElementById('exportarJSON')
  const encriptarExportacao = document.getElementById('encriptarExportacao')
  const importArquivo = document.getElementById('importArquivo')
  const arquivoSelecionado = document.getElementById('arquivoSelecionado')
  const importarSenhas = document.getElementById('importarSenhas')

  // Evento para exportar em CSV
  exportarCSV.addEventListener('click', () => {
    exportPasswords('csv', encriptarExportacao.checked)
  })

  // Evento para exportar em JSON
  exportarJSON.addEventListener('click', () => {
    exportPasswords('json', encriptarExportacao.checked)
  })

  // Evento para selecionar arquivo de importação
  importArquivo.addEventListener('change', () => {
    const file = importArquivo.files[0]

    if (file) {
      arquivoSelecionado.textContent = file.name
      importarSenhas.disabled = false
    } else {
      arquivoSelecionado.textContent = 'Nenhum arquivo selecionado'
      importarSenhas.disabled = true
    }
  })

  // Evento para importar senhas
  importarSenhas.addEventListener('click', () => {
    const file = importArquivo.files[0]

    if (!file) {
      showNotification('Selecione um arquivo para importar', 'warning')
      return
    }

    // Verificar extensão do arquivo
    const fileExt = file.name.split('.').pop().toLowerCase()

    if (fileExt !== 'csv' && fileExt !== 'json') {
      showNotification(
        'Formato de arquivo não suportado. Use CSV ou JSON',
        'error'
      )
      return
    }

    // Ler o arquivo
    const reader = new FileReader()

    reader.onload = event => {
      try {
        // Processar o arquivo de acordo com o formato
        if (fileExt === 'csv') {
          importPasswordsFromCSV(event.target.result)
        } else {
          importPasswordsFromJSON(event.target.result)
        }

        // Resetar o formulário
        importArquivo.value = ''
        arquivoSelecionado.textContent = 'Nenhum arquivo selecionado'
        importarSenhas.disabled = true
      } catch (error) {
        console.error('Erro ao importar senhas:', error)
        showNotification(
          'Erro ao importar senhas. Verifique o formato do arquivo.',
          'error'
        )
      }
    }

    reader.onerror = () => {
      showNotification('Erro ao ler o arquivo', 'error')
    }

    // Ler o arquivo como texto
    reader.readAsText(file)
  })

  /**
   * Exporta as senhas salvas em um arquivo
   * @param {string} format - Formato de exportação ('csv' ou 'json')
   * @param {boolean} encrypt - Se deve encriptar o conteúdo
   */
  function exportPasswords(format, encrypt) {
    // Obter senhas salvas
    const savedPasswordsJSON = localStorage.getItem(SAVED_PASSWORDS_KEY)

    if (!savedPasswordsJSON || JSON.parse(savedPasswordsJSON).length === 0) {
      showNotification('Não há senhas para exportar', 'warning')
      return
    }

    const savedPasswords = JSON.parse(savedPasswordsJSON)

    let content = ''
    let filename = ''
    let mimeType = ''

    // Gerar conteúdo de acordo com o formato
    if (format === 'csv') {
      content = convertToCSV(savedPasswords)
      filename = 'senhas_exportadas.csv'
      mimeType = 'text/csv'
    } else {
      content = JSON.stringify(savedPasswords, null, 2)
      filename = 'senhas_exportadas.json'
      mimeType = 'application/json'
    }

    // Encriptar o conteúdo se necessário (simulação)
    if (encrypt) {
      content = simpleEncrypt(content)
      filename = filename.replace('.', '_encrypted.')
    }

    // Criar o blob e o link para download
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = filename

    // Adicionar à página, clicar e remover
    document.body.appendChild(downloadLink)
    downloadLink.click()

    // Limpar
    setTimeout(() => {
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
    }, 100)

    showNotification(
      `Senhas exportadas com sucesso em formato ${format.toUpperCase()}`,
      'success'
    )
  }

  /**
   * Converte array de senhas para formato CSV
   * @param {Array} passwords - Array de objetos de senha
   * @returns {string} Conteúdo CSV
   */
  function convertToCSV(passwords) {
    // Cabeçalhos
    const headers = ['id', 'name', 'category', 'password', 'notes', 'createdAt']

    // Converter cabeçalhos
    let csv = headers.join(',') + '\n'

    // Adicionar linhas
    passwords.forEach(password => {
      const row = headers.map(header => {
        let value = password[header] || ''

        // Escapar strings que contêm vírgulas, aspas ou quebras de linha
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"') || value.includes('\n'))
        ) {
          value = `"${value.replace(/"/g, '""')}"`
        }

        return value
      })

      csv += row.join(',') + '\n'
    })

    return csv
  }

  /**
   * Importa senhas de um arquivo CSV
   * @param {string} csvContent - Conteúdo CSV
   */
  function importPasswordsFromCSV(csvContent) {
    // Verificar se está encriptado
    if (csvContent.startsWith('ENCRYPTED:')) {
      try {
        csvContent = simpleDecrypt(csvContent)
      } catch (error) {
        showNotification('Erro ao descriptografar o arquivo', 'error')
        return
      }
    }

    // Parse manual do CSV
    const lines = csvContent.split('\n')
    const headers = lines[0].split(',')

    // Verificar se o CSV tem o formato esperado
    const requiredHeaders = ['id', 'name', 'category', 'password']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

    if (missingHeaders.length > 0) {
      showNotification(
        `Formato de CSV inválido. Faltam campos: ${missingHeaders.join(', ')}`,
        'error'
      )
      return
    }

    // Processar as linhas
    const passwords = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      // Processamento simplificado (não lida com escape de aspas corretamente)
      const values = parseCSVLine(lines[i])

      if (values.length !== headers.length) {
        console.warn(`Linha ${i} ignorada: número incorreto de valores`)
        continue
      }

      // Criar objeto de senha
      const password = {}

      headers.forEach((header, index) => {
        // Converter timestamps para número
        if (header === 'createdAt') {
          password[header] = parseInt(values[index]) || Date.now()
        } else {
          password[header] = values[index]
        }
      })

      passwords.push(password)
    }

    mergeImportedPasswords(passwords)
  }

  /**
   * Parse de uma linha CSV lidando com aspas
   * @param {string} line - Linha CSV
   * @returns {Array} Array de valores
   */
  function parseCSVLine(line) {
    const result = []
    let currentValue = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        // Verificar se é aspas duplas escapadas
        if (i + 1 < line.length && line[i + 1] === '"') {
          currentValue += '"'
          i++ // Pular o próximo caractere
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue)
        currentValue = ''
      } else {
        currentValue += char
      }
    }

    // Adicionar o último valor
    result.push(currentValue)

    return result
  }

  /**
   * Importa senhas de um arquivo JSON
   * @param {string} jsonContent - Conteúdo JSON
   */
  function importPasswordsFromJSON(jsonContent) {
    // Verificar se está encriptado
    if (jsonContent.startsWith('ENCRYPTED:')) {
      try {
        jsonContent = simpleDecrypt(jsonContent)
      } catch (error) {
        showNotification('Erro ao descriptografar o arquivo', 'error')
        return
      }
    }

    try {
      const passwords = JSON.parse(jsonContent)

      // Verificar se é um array
      if (!Array.isArray(passwords)) {
        showNotification(
          'Formato de JSON inválido. Esperava um array.',
          'error'
        )
        return
      }

      // Verificar cada senha
      const validPasswords = passwords.filter(p => {
        return (
          p &&
          typeof p === 'object' &&
          p.id &&
          p.name &&
          p.category &&
          p.password
        )
      })

      if (validPasswords.length === 0) {
        showNotification(
          'Nenhuma senha válida encontrada no arquivo',
          'warning'
        )
        return
      }

      // Informar quantas senhas foram encontradas
      if (validPasswords.length < passwords.length) {
        showNotification(
          `Atenção: ${
            passwords.length - validPasswords.length
          } senhas inválidas foram ignoradas`,
          'warning'
        )
      }

      mergeImportedPasswords(validPasswords)
    } catch (error) {
      console.error('Erro ao parsear JSON:', error)
      showNotification('Erro ao processar o arquivo JSON', 'error')
    }
  }

  /**
   * Mescla as senhas importadas com as existentes
   * @param {Array} importedPasswords - Senhas importadas
   */
  function mergeImportedPasswords(importedPasswords) {
    if (importedPasswords.length === 0) {
      showNotification('Nenhuma senha para importar', 'warning')
      return
    }

    // Obter senhas existentes
    const existingPasswordsJSON = localStorage.getItem(SAVED_PASSWORDS_KEY)
    const existingPasswords = existingPasswordsJSON
      ? JSON.parse(existingPasswordsJSON)
      : []

    // Criar mapa de IDs existentes
    const existingIds = new Set(existingPasswords.map(p => p.id))

    // Senhas novas e duplicadas
    let newPasswords = []
    let duplicatePasswords = []

    // Verificar cada senha importada
    importedPasswords.forEach(password => {
      if (existingIds.has(password.id)) {
        duplicatePasswords.push(password)
      } else {
        newPasswords.push(password)
        existingIds.add(password.id)
      }
    })

    // Adicionar as novas senhas
    const updatedPasswords = [...existingPasswords, ...newPasswords]

    // Salvar as senhas atualizadas
    localStorage.setItem(SAVED_PASSWORDS_KEY, JSON.stringify(updatedPasswords))

    // Notificar o usuário
    if (newPasswords.length > 0) {
      showNotification(
        `${newPasswords.length} senhas importadas com sucesso`,
        'success'
      )

      // Atualizar a interface se estiver na aba de senhas salvas
      const senhasSalvas = document.getElementById('senhasSalvas')
      if (senhasSalvas) {
        // Disparar um evento para atualizar a lista
        document.dispatchEvent(new CustomEvent('passwordsUpdated'))
      }
    }

    if (duplicatePasswords.length > 0) {
      showNotification(
        `${duplicatePasswords.length} senhas duplicadas foram ignoradas`,
        'info'
      )
    }
  }

  /**
   * Encriptação simples (apenas para demonstração)
   * @param {string} text - Texto para encriptar
   * @returns {string} Texto encriptado
   */
  function simpleEncrypt(text) {
    // Esta é uma encriptação muito básica para demonstração
    // Em uma aplicação real, seria usado uma biblioteca como CryptoJS
    const prefix = 'ENCRYPTED:'
    let result = ''

    // Codificar em base64 e depois inverter
    const base64 = btoa(text)
    result = base64.split('').reverse().join('')

    return prefix + result
  }

  /**
   * Descriptação simples (apenas para demonstração)
   * @param {string} text - Texto encriptado
   * @returns {string} Texto descriptografado
   */
  function simpleDecrypt(text) {
    const prefix = 'ENCRYPTED:'

    if (!text.startsWith(prefix)) {
      return text
    }

    // Remover prefixo
    const encrypted = text.substring(prefix.length)

    // Inverter e decodificar de base64
    const reversed = encrypted.split('').reverse().join('')
    return atob(reversed)
  }
}
