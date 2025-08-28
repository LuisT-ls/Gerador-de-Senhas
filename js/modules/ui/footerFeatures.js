// JavaScript para as funcionalidades interativas do footer

// Função para inicializar as funcionalidades do footer
export function initFooterFeatures() {
  // Botão de voltar ao topo
  const backToTopButton = document.getElementById('back-to-top')
  if (backToTopButton) {
    // Inicialmente oculto
    backToTopButton.classList.remove('visible')

    // Mostrar/ocultar baseado no scroll
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible')
      } else {
        backToTopButton.classList.remove('visible')
      }
    })

    // Ação de voltar ao topo
    backToTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
}
