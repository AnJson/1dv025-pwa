import '../app-window/'
import '../app-icon/'
import * as constants from './lib/constants.js'

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
    /**
     * The position on x-axis to open next app-window on.
     *
     * @type {number}
     */
    #nextWindowX = 20

    /**
     * The position on y-axis to open next app-window on.
     *
     * @type {number}
     */
    #nextWindowY = 20

    /**
     * The div-element acting as the desktop where windows are opened.
     *
     * @type {HTMLElement}
     */
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

      this.shadowRoot.addEventListener('icon-clicked', async event => {
        event.stopPropagation()

        if (event.detail.element) {
          const appWindow = this.#createAppWindow()
          this.#desktopElement.appendChild(appWindow)
          const app = await this.#createCustomElement(event.detail.element)
          // If app was created successfully.
          if (app) {
            appWindow.appendChild(app)
          }
        }
      })
    }

    /**
     * Create and set position for app-window.
     *
     * @returns {HTMLElement} - Custom app-window element.
     */
    #createAppWindow () {
      const appWindow = document.createElement('app-window')
      appWindow.positionWindow(this.#nextWindowX, this.#nextWindowY)
      this.#nextWindowX += 20
      this.#nextWindowY += 20

      return appWindow
    }

    /**
     * Create new element.
     *
     * @param {string} elementName - Tag-name for element to create.
     * @returns {HTMLElement} - Element created based on parameter.
     */
    async #createCustomElement (elementName) {
      if (typeof elementName !== 'string') {
        return
      }

      // Lazy-load application by trying to import it, if import fails show error-message.
      try {
        await import(/* @vite-ignore */`../${elementName}/`)
      } catch {
        this.#showWarning(constants.ERROR_IMPORT)
        return
      }

      return document.createElement(elementName)
    }

    /**
     * Show error-banner with message for a short time.
     *
     * @param {string} text - Text to display in error-list.
     */
    #showWarning (text) {
      // TODO: Create banner to place at the top to display error-message.
      console.log(text)
    }
  })
