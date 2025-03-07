// formControls.js - Controle dos elementos de formulário

/**
 * Inicializa os controles de formulário
 */
export function initFormControls() {
  // Inicializar controles de range com output
  initRangeSliders()

  // Inicializar seletores de arquivo com visualização do nome
  initFileInputs()

  // Evento global para documentos
  document.addEventListener('passwordsUpdated', () => {
    // Recarregar lista de senhas salvas
    const savedPasswordsEvent = new Event('refreshSavedPasswords')
    document.dispatchEvent(savedPasswordsEvent)
  })
}

/**
 * Inicializa os sliders de range com exibição do valor
 */
function initRangeSliders() {
  const rangeInputs = document.querySelectorAll('input[type="range"]')

  rangeInputs.forEach(input => {
    // Encontrar o output relacionado
    const outputId = input.getAttribute('aria-describedby')
    if (!outputId) return

    const output = document.getElementById(outputId)
    if (!output) return

    // Atualizar valor inicial
    output.textContent = input.value

    // Adicionar evento para atualizar o valor durante a interação
    input.addEventListener('input', () => {
      output.textContent = input.value
    })
  })
}

/**
 * Inicializa os campos de arquivo com exibição do nome
 */
function initFileInputs() {
  const fileInputs = document.querySelectorAll('input[type="file"]')

  fileInputs.forEach(input => {
    // Buscar o span para exibir o nome do arquivo
    const fileNameSpan = input.nextElementSibling
    if (!fileNameSpan) return

    // Atualizar o texto quando um arquivo for selecionado
    input.addEventListener('change', () => {
      if (input.files.length > 0) {
        fileNameSpan.textContent = input.files[0].name
      } else {
        fileNameSpan.textContent = 'Nenhum arquivo selecionado'
      }
    })
  })
}
