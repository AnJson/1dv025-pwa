/**
 * The main script file of the application.
 *
 * @author Anders Jonsson <aj224rj@student.lnu.se>
 * @version 1.0.0
 */

import './components/desktop-app/'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('../sw.js')
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
    } catch (error) {
      console.log('ServiceWorker failed registration: ', error)
    }
  })
}
