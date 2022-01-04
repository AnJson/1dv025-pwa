import '../app-window/'
import '../app-icon/'
import svgUrl from './lib/symbol-defs.svg'
import * as constants from './lib/constants.js'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    #app {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      font-size: 10px;
      overflow: hidden;
      --color-inactive-text: rgb(62, 62, 63);
      --color-inactive-background: rgba(250, 248, 243, 0.97);
      --color-active-background: rgb(255, 250, 247);
      --color-highlight: rgba(181, 40, 24, 0.9);
      --color-text: rgb(22, 22, 28);
      --color-extra-light: rgba(107, 16, 6, 0.9);
      --color-extra-dark: rgba(73, 17, 11, 0.9);
    }

    #app.dark-mode {
      --color-inactive-text: rgb(62, 62, 63);
      --color-inactive-background: rgba(30, 30, 31, 0.98);
      --color-active-background: rgb(22, 22, 28);
      --color-highlight: rgba(181, 40, 24, 0.9);
      --color-text: rgb(229, 231, 237);
      --color-extra-light: rgba(107, 16, 6, 0.9);
      --color-extra-dark: rgba(73, 17, 11, 0.9);
    }
 

    #desktop {
      flex: 1;
      position: relative;
      background-color: green;
      height: 100%;
    }

    #icon-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: .5em 2em;
      background-color: var(--color-inactive-background);
      z-index: 100;
    }

    #icon-container:hover > * {
      transform: scale(1.2) translateY(-1em);
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

    app-icon {
      transition: all 300ms;
    }

    app-window:focus {
      outline: none;
      z-index: 10;
    }

    #theme-mode {
      cursor: pointer;
    }

    #full-screen {
      cursor: pointer;
      font-size: 10px;
      color: var(--color-inactive-text);
    }

    #full-screen:hover {
      color: var(--color-text);
    }

    .full-screen-icon {
      width: 2.5em;
      height: 2.5em;
      fill: currentColor;
      transition: all 200ms;
    }

    .hidden {
      display: none !important;
    }
  </style>
  <div id="app" class="dark-mode">
    <div id="desktop"></div>
    <div id="icon-bar">
      <div id="icon-container">
        <app-icon data-target="memory-game" data-title="Memory"></app-icon>
        <app-icon data-target="local-weather" data-title="Local Weather"></app-icon>
        <app-icon data-target="chat-application" data-title="Chat Application"></app-icon>
      </div>
      <div id="info-bar">
        <div id="theme-mode">Dark/Light</div>
        <div id="full-screen">
          <svg class="full-screen-icon">
            <use href="${svgUrl}#icon-enlarge" />
          </svg>
          <svg class="full-screen-icon hidden">
            <use href="${svgUrl}#icon-shrink" />
          </svg>
        </div>
        <div>Clock</div>
      </div>
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
     * The custom app-window element being dragged.
     *
     * @type {HTMLElement}
     */
    #windowDragging

    /**
     * The div-element wrapping the application.
     *
     * @type {HTMLElement}
     */
    #appElement

    /**
     * The div-element acting as the desktop where windows are opened.
     *
     * @type {HTMLElement}
     */
    #desktopElement

    /**
     * The div-element holding the full-screen svg-icons.
     *
     * @type {HTMLElement}
     */
    #fullScreenToggleElement

    /**
     * The div-element holding the theme-mode svg-icons.
     *
     * @type {HTMLElement}
     */
    #themeToggleElement

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#appElement = this.shadowRoot.querySelector('#app')
      this.#desktopElement = this.shadowRoot.querySelector('#desktop')
      this.#fullScreenToggleElement = this.shadowRoot.querySelector('#full-screen')
      this.#themeToggleElement = this.shadowRoot.querySelector('#theme-mode')

      this.#themeToggleElement.addEventListener('click', event => {
        event.stopPropagation()
        this.#toggleThemeHandler()
      })

      this.#fullScreenToggleElement.addEventListener('click', event => {
        event.stopPropagation()
        this.#toggleFullScreen()
      })

      this.addEventListener('app-window-focused', event => {
        event.target.focus()
      })

      this.shadowRoot.addEventListener('app-window-header-mousedown', event => {
        event.target.dragStart(event.detail.clientX, event.detail.clientY)
        this.#windowDragging = event.target
      })

      this.addEventListener('mouseup', event => {
        event.stopPropagation()
        if (this.#windowDragging) {
          this.#windowDragging.dragEnd(event.clientX, event.clientY)
          this.#windowDragging = null
        }
      })

      this.addEventListener('mousemove', event => {
        event.stopPropagation()
        if (this.#windowDragging) {
          this.#windowDragging.drag(event.clientX, event.clientY)
        }
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
          appWindow.setAttribute('data-title', event.detail.title)
          this.#desktopElement.appendChild(appWindow)
          const app = await this.#createCustomElement(event.detail.element)
          // If app was created successfully.
          if (app) {
            appWindow.appendChild(app)
          }
        }
      })

      this.addEventListener('fullscreenchange', () => {
        for (const svg of this.#fullScreenToggleElement.children) {
          svg.classList.toggle('hidden')
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
        return document.createElement(elementName)
      } catch {
        this.#showWarning(constants.ERROR_IMPORT)
      }
    }

    /**
     * Toggle app-view in full-screen.
     *
     */
    #toggleFullScreen () {
      if (!document.fullscreenElement) {
        this.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }

    /**
     * Toggle theme between dark and light.
     *
     */
    #toggleThemeHandler () {
      this.#appElement.classList.toggle('dark-mode')
    }

    /**
     * Show error-banner with message for a short time.
     *
     * @param {string} text - Text to display in error-list.
     */
    async #showWarning (text) {
      try {
        await import(/* @vite-ignore */'../error-banner/')
        const banner = document.createElement('error-banner')
        banner.setAttribute('data-message', text)
        this.#desktopElement.appendChild(banner)

        setTimeout(() => {
          this.#desktopElement.removeChild(banner)
        }, 4000)
      } catch (error) {
        console.log(error)
      }
    }
  })
