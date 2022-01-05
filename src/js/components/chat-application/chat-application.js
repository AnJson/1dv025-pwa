import * as constants from './lib/constants.js'

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
      border-radius: 3px;
      background-color: var(--color-active-background);
    }

    #chat-container {
      position: relative;
    }

    #chat-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: .7em 0;
      /*
      TODO: continue here.
      */
    }

    .hidden {
      display: none !important;
    }
  </style>
  <div id="main">
    <div id="chat-container">
      <div id="chat-banner">This is the banner</div>
      <div id="chat"></div>
    </div>
    <div id="nickname"></div>
  </div>
`

customElements.define('chat-application',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The websocket-connection object.
     *
     * @type {object}
     */
    #websocket

    /**
     * The div-element holding the main-content.
     *
     * @type {HTMLElement}
     */
    #mainElement

    /**
     * The div-element holding the chat-content.
     *
     * @type {HTMLElement}
     */
    #chatContainerElement

    /**
     * The div-element holding the chat-conversation.
     *
     * @type {HTMLElement}
     */
    #chatElement

    /**
     * The div element holding nickname-form.
     *
     * @type {HTMLElement}
     */
    #nicknameElement

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#mainElement = this.shadowRoot.querySelector('#main')
      this.#chatContainerElement = this.shadowRoot.querySelector('#chat-container')
      this.#chatElement = this.shadowRoot.querySelector('#chat') // NOTE: Needed???
      this.#nicknameElement = this.shadowRoot.querySelector('#nickname')
    }

    /**
     * Ask user-client for geolocation.
     *
     */
    connectedCallback () {
      if (window.localStorage.getItem('chatapp-nickname')) {
        this.#initChat()
      }
    }

    /**
     * Close websocket connection.
     *
     */
    disconnectedCallback () {
      this.#websocket.close()
      // TODO: remove eventlisteners.
    }

    #initChat () {
      try {
        this.#hideAllInMain()
        this.#chatContainerElement.classList.remove('hidden')
        this.#connect()
      } catch (error) {
        console.log(error)
        // TODO: handle scenario when unnable to connect.
      }
    }

    /**
     * Connect to the websocket.
     *
     */
    #connect () {
      // test-data
      const data = {
        type: 'message',
        data: 'Hello wss',
        username: 'AndersJson',
        key: constants.API_KEY
      }

      this.#websocket = new WebSocket('wss://courselab.lnu.se/message-app/socket', 'chatApp')

      this.#websocket.addEventListener('open', event => {
        console.log(event)
        this.#websocket.send(JSON.stringify(data))
      })

      this.#websocket.addEventListener('message', event => {
        console.log(event.data)
      })
    }

    /**
     * Hide all elements in content-div.
     *
     */
    #hideAllInMain () {
      for (const element of this.#mainElement.children) {
        element.classList.add('hidden')
      }
    }
  })
