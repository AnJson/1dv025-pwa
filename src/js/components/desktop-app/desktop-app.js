import '../app-window/'
import '../app-icon/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      font-size: 10px;
    }

    #desktop {
      flex: 1;
      position: relative;
      background-color: green;
      height: 100%;
    }

    #icon-bar {
      background-color: blue;
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 7em;
      box-sizing: border-box;
      padding: 0 2em;
      z-index: 100;
    }

    #icon-container {
      flex: 1;
      display: flex;
      justify-content: center;
      gap: 3em;
    }

    #info-bar {
      font-size: 2em;
      display: flex;
      gap: 1em;
    }

    .icon {
      font-size: 2em;
      cursor: pointer;
    }

    app-window:focus {
      outline: none;
      z-index: 10;
    }
  </style>
  <div id="desktop"></div>
  <div id="icon-bar">
    <div id="icon-container">
      <app-icon></app-icon>
      <app-icon></app-icon>
      <app-icon></app-icon>
    </div>
    <div id="info-bar">
      <div>Dark/Light</div>
      <div>FullScreen</div>
      <div>Clock</div>
    </div>
  </div>
`

customElements.define('desktop-app',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    #nextWindowX = 20
    #nextWindowY = 20
    #desktopElement

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#desktopElement = this.shadowRoot.querySelector('#desktop')

      this.addEventListener('app-window-focused', event => {
        event.target.focus()
      })

      this.shadowRoot.addEventListener('close-window', event => {
        event.stopPropagation()
        this.#desktopElement.removeChild(event.target)
        this.#nextWindowX -= 20
        this.#nextWindowY -= 20
      })

      this.shadowRoot.addEventListener('icon-clicked', event => {
        event.stopPropagation()

        if (event.detail.element) {
          this.#openAppWindow()
          // TODO: Implement this function.
          // this.#placeAppInWindow(event.detail.element)
        }
      })
    }

    /**
     * Create, position and append app-window to desktop-div.
     *
     */
    #openAppWindow () {
      const appWindow = document.createElement('app-window')
      appWindow.positionWindow(this.#nextWindowX, this.#nextWindowY)
      this.#desktopElement.appendChild(appWindow)
      this.#nextWindowX += 20
      this.#nextWindowY += 20
    }

    /**
     * Create and append app to app-window.
     *
     */
    #placeAppInWindow () {
      const appWindow = document.createElement('app-window')
      appWindow.positionWindow(this.#nextWindowX, this.#nextWindowY)
      this.#desktopElement.appendChild(appWindow)
      this.#nextWindowX += 20
      this.#nextWindowY += 20
    }
  })
