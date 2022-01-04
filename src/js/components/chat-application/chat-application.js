const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      font-size: 10px;
    }

    #main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40em;
      min-height: 30em;
      box-sizing: border-box;
    }
    </style>
  <div id="main"></div>
`

customElements.define('chat-application',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    #websocket
    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /**
     * Ask user-client for geolocation.
     *
     */
    connectedCallback () {
      this.#websocket = new WebSocket('wss://courselab.lnu.se/message-app/socket', 'chatApp')
      console.log(this.#websocket)
      this.#websocket.onopen = (event) => {
        console.log(event)
        this.#websocket.send("Here's some text that the server is urgently awaiting!");
      }

      const data = {
        type: 'message',
        data: 'Hello wss',
        username: 'AndersJson',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
    }

    async #connect () {
      //
    }
  })
