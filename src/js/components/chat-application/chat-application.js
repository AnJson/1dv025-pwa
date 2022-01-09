import * as constants from './lib/constants.js'
import { template } from './template.js'
import '../chat-nickname/'
import '../chat-message/'
import { nanoid } from 'nanoid'
import 'emoji-picker-element'

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
     * The form-element for chat-messages.
     *
     * @type {HTMLElement}
     */
    #chatMessageForm

    /**
     * The textarea where to write chat-messages.
     *
     * @type {HTMLElement}
     */
    #chatTextarea

    /**
     * The custom emoji-picker element.
     *
     * @type {HTMLElement}
     */
    #emojiPicker

    /**
     * The svg-element to toggle emoji-picker visibility.
     *
     * @type {HTMLElement}
     */
    #emojiIcon

    /**
     * The button-element to send chat-messages.
     *
     * @type {HTMLElement}
     */
    #sendButtonElement

    /**
     * The nickname of this app-instance.
     *
     * @type {string}
     */
    #nickname

    /**
     * Unique id for this app-instance.
     *
     * @type {string}
     */
    #instanceId

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
      this.#chatMessageForm = this.shadowRoot.querySelector('#message-form')
      this.#chatTextarea = this.shadowRoot.querySelector('#textarea')
      this.#emojiPicker = this.shadowRoot.querySelector('#emoji-picker')
      this.#emojiIcon = this.shadowRoot.querySelector('#emoji-icon')
      this.#sendButtonElement = this.shadowRoot.querySelector('#send-button')

      this.#nicknameElement.addEventListener('nickname-button-clicked', event => {
        event.stopPropagation()
        this.#enteredNicknameHandler(event.detail.nickname)
      })

      this.#chatTextarea.addEventListener('input', event => {
        event.stopPropagation()
        this.#setSendButtonState()
      })

      this.#chatTextarea.addEventListener('focus', event => {
        event.stopPropagation()
        if (!this.#emojiPicker.classList.contains('hidden')) {
          this.#emojiPicker.classList.add('hidden')
        }
      })

      this.#emojiIcon.addEventListener('click', event => {
        event.stopPropagation()
        this.#emojiPicker.classList.toggle('hidden')
      })

      this.#emojiPicker.addEventListener('emoji-click', event => {
        event.stopPropagation()
        this.#chatTextarea.value += event.detail.unicode
        this.#setSendButtonState()
      })

      this.#editNicknameIcon.addEventListener('click', event => {
        event.stopPropagation()
        this.#hideAllInMain()
        this.#nicknameElement.classList.remove('hidden')
      })

      this.#chatMessageForm.addEventListener('submit', event => {
        event.stopPropagation()
        event.preventDefault()
        this.#sendMessageHandler()
      })
    }

    /**
     * Check if nickname in localstorage, else ask for nickname before connecting to websocket and showing chat.
     * Set unique id for this instance of the application.
     *
     */
    connectedCallback () {
      this.#instanceId = nanoid()
      const nickname = window.localStorage.getItem('chatapp-nickname')
      if (nickname) {
        this.#nicknameElement.setAttribute('data-nickname', nickname)
        this.#nickname = nickname
        this.#initChat()
      }
    }

    /**
     * Close websocket connection and remove eventlisteners on socket.
     *
     */
    disconnectedCallback () {
      if (this.#websocket) {
        this.#websocket.close()
        this.#websocket.removeEventListener('message', this.#messageRecievedHandler)
        this.#websocket.removeEventListener('open', this.#signalConnected)
      }
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

        this.#websocket.addEventListener('message', this.#messageRecievedHandler.bind(this))
      }
    }

    /**
     * Add eventlisteners to connected websocket.
     *
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
     * @param {number} time - Timestamp for sending message.
     */
    #sendMessage (message, time) {
      const data = {
        type: 'message',
        data: message,
        time: time,
        username: this.#nickname,
        id: this.#instanceId,
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
     * Format data and display recieved message in the chat.
     *
     * @param {object} event - Event-object from message-event on websocket.
     */
    #messageRecievedHandler (event) {
      const eventData = JSON.parse(event.data)
      if (eventData.type === 'message' && eventData.id !== this.#instanceId) {
        const data = {
          data: eventData.data,
          time: eventData.time,
          username: eventData.username
        }

        this.#addMessageToChat('left', data)
      }
    }

    /**
     * Send message to websocket and display it in the chat.
     *
     */
    #sendMessageHandler () {
      const message = this.#chatTextarea.value
      const time = Date.now()
      this.#sendMessage(message, time)

      this.#addMessageToChat('right', {
        data: message,
        time: time,
        username: this.#nickname
      })

      this.#chatTextarea.value = ''
      this.#setSendButtonState()
      this.#chatTextarea.focus()
    }

    /**
     * Create elements and display message in chat.
     *
     * @param {string} side - The left/right side to place the chat-message on.
     * @param {object} data - The chat-message.
     */
    #addMessageToChat (side, data) {
      const timestamp = data.time ? data.time : Date.now()

      const messageElement = document.createElement('chat-message')
      messageElement.textContent = data.data
      messageElement.setMeta({
        time: typeof timestamp === 'number' ? timestamp : Date.now(),
        username: data.username ? data.username : 'Unknown'
      })

      const row = document.createElement('div')
      row.classList.add('row')

      if (side === 'left') {
        row.classList.add('row__left')
      } else if (side === 'right') {
        row.classList.add('row__right')
      }

      row.appendChild(messageElement)
      this.#chatElement.appendChild(row)
      this.#chatElement.scrollTop = this.#chatElement.scrollHeight // Scroll down to bottom of chat-div.
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
