import * as constants from './lib/constants.js'
import svgUrl from './lib/symbol-defs.svg'
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
      height: 60em;
      border-radius: 3px;
      background-color: var(--color-active-background);
    }

    #chat-container {
      display: flex;
      flex-direction: column;
      position: relative;
      width: 100%;
      height: 100%;
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
      height: 100%;
    }

    #controls {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background-color: #000;
      padding: 1em;
      box-sizing: border-box;
    }

    #nickname-wrapper {
      display: flex;
      align-items: center;
      gap: 1em;
      margin-bottom: .5em;
    }

    #nickname-text {
      margin: 0;
      font-family: sans-serif;
      color: var(--color-text);
      font-size: 1.2em;
    }

    #edit-nickname-icon {
      width: 1.2em;
      height: 1.2em;
      fill: var(--color-inactive-text);
      transition: all 200ms;
      cursor: pointer;
    }

    #edit-nickname-icon:hover {
      fill: var(--color-text);
    }

    #message-form {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 0;
      width: 100%;
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
        <div id="nickname-wrapper">
          <p id="nickname-text">Anders</p>
          <svg id="edit-nickname-icon">
            <use href="${svgUrl}#icon-pencil" />
          </svg>
        </div>
        <form id="message-form">
          <textarea id="textarea" placeholder="Write your message..." rows="3" cols="31" disabled></textarea>
          <button id="send-button" disabled>Send</button>
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
     * The p element showing the nickname of this app-instance.
     *
     * @type {HTMLElement}
     */
    #nicknameTextElement

    /**
     * The svg element to edit nickname.
     *
     * @type {HTMLElement}
     */
    #editNicknameIcon

    /**
     * The nickname of this app-instance.
     *
     * @type {string}
     */
    #nickname

    /**
     * The textarea where to write chat-messages.
     *
     * @type {HTMLElement}
     */
    #chatTextarea

    /**
     * The button-element to send chat-messages.
     *
     * @type {HTMLElement}
     */
    #sendButtonElement

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
      this.#nicknameTextElement = this.shadowRoot.querySelector('#nickname-text')
      this.#editNicknameIcon = this.shadowRoot.querySelector('#edit-nickname-icon')
      this.#chatTextarea = this.shadowRoot.querySelector('#textarea')
      this.#sendButtonElement = this.shadowRoot.querySelector('#send-button')

      this.#nicknameElement.addEventListener('nickname-button-clicked', event => {
        event.stopPropagation()
        this.#enteredNicknameHandler(event.detail.nickname)
      })

      this.#chatTextarea.addEventListener('input', event => {
        event.stopPropagation()
        this.#setSendButtonState()
      })

      this.#editNicknameIcon.addEventListener('click', event => {
        event.stopPropagation()
        this.#hideAllInMain()
        this.#nicknameElement.classList.remove('hidden')
      })
    }

    /**
     * Check if nickname in localstorage, else ask for nickname before connecting to websocket and showing chat.
     *
     */
    connectedCallback () {
      const nickname = window.localStorage.getItem('chatapp-nickname')
      if (nickname) {
        this.#nicknameElement.setAttribute('data-nickname', nickname)
        this.#initChat()
      }
    }

    /**
     * Close websocket connection and remove eventlisteners on socket.
     *
     */
    disconnectedCallback () {
      this.#websocket.close()
      this.#websocket.removeEventListener('open', this.#signalConnected)
      // TODO: remove message-eventlistener.
      this.#websocket = null
    }

    /**
     * Show chat-screen and if not connected, attempt to connect to websocket.
     *
     */
    #initChat () {
      try {
        this.#hideAllInMain()
        this.#nicknameTextElement.textContent = window.localStorage.getItem('chatapp-nickname')
        this.#chatContainerElement.classList.remove('hidden')
        if (!this.#websocket) {
          this.#chatBanner.textContent = 'Connecting...'
          this.#chatBanner.classList.remove('hidden')
          this.#connect()
          this.#addEventListenersToWebsocket()
        }
        this.#chatTextarea.removeAttribute('disabled')
      } catch (error) {
        console.log(error)
        this.#chatBanner.textContent = 'Unable to connect, close the window and try again.'
      }
    }

    /**
     * Connect to the websocket.
     *
     */
    #connect () {
      this.#websocket = new WebSocket(constants.WEBSOCKET_URL, constants.WEBSOCKET_PROTOCOL)
    }

    /**
     * Add eventlisteners to connected websocket.
     */
    #addEventListenersToWebsocket () {
      if (this.#websocket) {
        this.#websocket.addEventListener('open', this.#signalConnected.bind(this))

        this.#websocket.addEventListener('message', event => {
          console.log(event.data)
        })
      }
    }

    /**
     * Add eventlisteners to connected websocket.
     */
    #signalConnected () {
      if (this.#chatBanner.classList.contains('hidden')) {
        this.#chatBanner.classList.remove('hidden')
      }

      this.#chatBanner.textContent = 'Connected!'

      setTimeout(() => {
        this.#chatBanner.classList.add('hidden')
      }, 2000)
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
      this.#nickname = nickname
      this.#nicknameTextElement.textContent = window.localStorage.getItem('chatapp-nickname')
      this.#initChat()
    }

    /**
     * Check if valid input in textarea and enable/disable the send-icon.
     *
     */
    #setSendButtonState () {
      if (this.#chatTextarea.value.trim() !== '') {
        if (this.#sendButtonElement.hasAttribute('disabled')) {
          this.#sendButtonElement.toggleAttribute('disabled')
        }
      } else {
        if (!this.#sendButtonElement.hasAttribute('disabled')) {
          this.#sendButtonElement.toggleAttribute('disabled')
        }
      }
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
