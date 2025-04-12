// Nome do cache
const CACHE_NAME = 'password-generator-cache-v1'

// Arquivos para armazenar em cache para funcionamento offline
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/js/app.js',
  '/assets/img/password-generator-logo.svg',
  '/assets/img/favicon/favicon.ico',
  '/assets/img/favicon/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',

  // Módulos JavaScript principais
  '/js/modules/ui/darkMode.js',
  '/js/modules/ui/tabs.js',
  '/js/modules/ui/formControls.js',
  '/js/modules/ui/modals.js',
  '/js/modules/ui/notifications.js',
  '/js/modules/features/passwordGen.js',
  '/js/modules/features/multipleGen.js',
  '/js/modules/features/analyzer.js',
  '/js/modules/features/wifiGen.js',
  '/js/modules/features/pinGen.js',
  '/js/modules/features/passphraseGen.js',
  '/js/modules/storage/passwordManager.js',
  '/js/modules/storage/history.js',
  '/js/modules/storage/exportImport.js',
  '/js/modules/glossary/glossarySearch.js',

  // Módulos do core
  '/js/modules/core/generator.js',
  '/js/modules/core/analyzer.js',
  '/js/modules/core/entropy.js',
  '/js/modules/core/utils.js'
]

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto')
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting())
  )
})

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              // Remover caches desatualizados
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Estratégia de cache: Network First com fallback para cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Verificar se a resposta é válida
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clonar a resposta para cache e retorno
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
      .catch(() => {
        // Fallback para cache se a rede falhar
        return caches.match(event.request)
      })
  )
})

// Sincronização em segundo plano para funcionalidades offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-passwords') {
    event.waitUntil(syncPasswords())
  }
})

// Função para sincronizar senhas quando online novamente
async function syncPasswords() {
  // Código de sincronização
  const syncData = await getDataFromIndexedDB()
  if (syncData && syncData.length > 0) {
    // Implementar lógica de sincronização
    console.log('Senhas sincronizadas com sucesso')
  }
}

// Notificações push
self.addEventListener('push', event => {
  const title = 'Gerador de Senhas'
  const options = {
    body:
      event.data.text() ||
      'Lembre-se de verificar a segurança das suas senhas!',
    icon: '/assets/img/favicon/android-chrome-192x192.png',
    badge: '/assets/img/favicon/android-chrome-192x192.png'
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Ação ao clicar na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Verificar se já existe uma janela aberta e focá-la
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }

      // Se não existir janela aberta, abrir uma nova
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

// Função auxiliar para acessar IndexedDB
async function getDataFromIndexedDB() {
  // Implementação de exemplo
  return []
}
