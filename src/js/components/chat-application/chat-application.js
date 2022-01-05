import * as constants from './lib/constants.js'
import '../chat-nickname/'

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
      width: 100%;
    }

    #chat-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 10px;
      background-color: var(--color-extra-light);
      z-index: 100;
      color: var(--color-text);
      font-family: sans-serif;
      font-size: 1.2em;
      box-sizing: border-box;
    }

    #chat {
      height: 350px;
    }

    #controls {
      background-color: #000;
      padding: 1em 0;
      box-sizing: border-box;
    }

    #message-form {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 0;
    }

    #textarea {
      resize: none;
      font-family: sans-serif;
      font-size: 1.3em;
      color: var(--color-text);
      background-color: var(--color-inactive-background);
      border: none;
      padding: .5em;
      border-radius: 3px;
    }

    #textarea:focus {
      outline: none;
    }

    #send-button {
      border: none;
      border-radius: 3px;
      background-color: #FFE000;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);
      padding: .7em 1.5em;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms;
    }

    #send-button:hover {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
    }

    #send-button:disabled {
      background-color: #eddb54;
      cursor: default;
    }

    #send-button:disabled:hover {
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);

    }

    .hidden {
      display: none !important;
    }
  </style>
  <div id="main">
    <div id="chat-container" class="hidden">
      <div id="chat-banner" class="hidden"></div>
      <div id="chat"></div>
      <div id="controls">
        <form id="message-form">
          <textarea id="textarea" placeholder="Write your message..." rows="4" cols="30"></textarea>
          <button id="send-button">Send</button>
        </form>
      </div>
    </div>
    <chat-nickname id="nickname"></chat-nickname>
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
     * The div-element acting as banner to display connection-status.
     *
     * @type {HTMLElement}
     */
    #chatBanner

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
      this.#chatElement = this.shadowRoot.querySelector('#chat')
      this.#chatBanner = this.shadowRoot.querySelector('#chat-banner')
      this.#nicknameElement = this.shadowRoot.querySelector('#nickname')

      this.#nicknameElement.addEventListener('nickname-button-clicked', event => {
        event.stopPropagation()
        this.#enteredNicknameHandler(event.detail.nickname)
      })
    }

    /**
     * Check if nickname in localstorage, else ask for nickname before connecting to websocket and showing chat.
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
        this.#chatBanner.textContent = 'Connecting...'
        this.#chatBanner.classList.remove('hidden')
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
      this.#websocket = new WebSocket('wss://courselab.lnu.se/message-app/socket', 'chatApp')

      this.#websocket.addEventListener('open', event => {
        console.log(event)
        // TODO: Signal connected.
      })

      this.#websocket.addEventListener('message', event => {
        console.log(event.data)
      })
    }

    /**
     * Send message to websocket.
     *
     * @param {string} message - Message-text to send.
     */
    #sendMessage (message) {
      const data = {
        type: 'message',
        data: message,
        username: window.localStorage.getItem('chatapp-nickname'),
        key: constants.API_KEY
      }

      this.#websocket.send(JSON.stringify(data))
    }

    /**
     * Save nickname to localStorage and init chat.
     *
     * @param {string} nickname - Nickname string.
     */
    #enteredNicknameHandler (nickname) {
      window.localStorage.setItem('chatapp-nickname', nickname)
      this.#initChat()
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
