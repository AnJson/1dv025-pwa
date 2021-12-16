import '../app-window/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: block;
      height: 100vh;
      font-size: 10px;
    }

    #desktop {
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
      <div class="icon" id="memory-icon">MemoryApp</div>
      <div class="icon" id="chat-icon">ChatApp</div>
      <div class="icon" id="custom-icon">CustomApp</div>
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
    #memoryIcon
    #chatIcon
    #customIcon

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#desktopElement = this.shadowRoot.querySelector('#desktop')
      this.#memoryIcon = this.shadowRoot.querySelector('#memory-icon')
      this.#chatIcon = this.shadowRoot.querySelector('#chat-icon')
      this.#customIcon = this.shadowRoot.querySelector('#custom-icon')

      this.addEventListener('app-window-focused', event => {
        event.target.focus()
      })

      this.shadowRoot.addEventListener('close-window', event => {
        event.stopPropagation()
        this.#desktopElement.removeChild(event.target)
        this.#nextWindowX -= 20
        this.#nextWindowY -= 20
      })

      this.#memoryIcon.addEventListener('click', () => {
        this.#openAppWindow()
        // TODO: insert correct app.
      })

      this.#chatIcon.addEventListener('click', () => {
        console.log('chat')
      })

      this.#customIcon.addEventListener('click', () => {
        console.log('custom')
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
  })
