const publicVapidKey =
  'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo'

// Check for service worker
if ('serviceWorker' in navigator) {
  send().catch((err) => console.error(err))
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log('Registering service worker...')
  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/',
  })
  // register.showNotification('hello', {})
  console.log('Service Worker Registered...')
  console.log('Subscribing')
  await subscribe(register)
}

async function subscribe(register) {
  console.log('ssafea')
  const subscription = await register.pushManager.getSubscription()
  if (!subscription) {
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })

    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json',
      },
    })
  }
}

async function unsubscribe(){
  await register.pushManager.getSubscription().then(sub => sub.unsubscribe())
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
