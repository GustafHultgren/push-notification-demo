console.log('Service Worker Loaded...')

self.addEventListener('push', (e) => {
  const { title, body } = e.data.json()
  console.log('Push Recieved...')
  self.registration.showNotification(title, {
    body: 'images', //body,
    image: 'http://image.ibb.co/frYOFd/tmlogo.png',
    icon: 'http://localhost:5000/icons/logo-small-plum.png',
  })
})
