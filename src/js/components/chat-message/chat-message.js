const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      font-size: 10px;
    }

    #wrapper {
      border-radius: 3px;
      background-color: var(--color-text);
      color: var(--color-active-background);
      font-family: sans-serif;
      padding: .6em .8em;
      box-sizing: border-box;
    }

    #meta {
      font-size: 1em;
      margin-bottom: 8px;
    }

    #message {
      font-size: 1.3em;
      white-space: pre-wrap;
      overflow: hidden;
    }
  </style>
  <div id="wrapper">
    <div id="meta">Anders 13:00</div>
    <div id="message"><slot></slot></div>
  </div>
`

customElements.define('chat-message',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The div-element holding the username and time.
     *
     * @type {HTMLElement}
     */
    #metaElement

    /**
     * The div-element holding message.
     *
     * @type {HTMLElement}
     */
    #messageElement

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#metaElement = this.shadowRoot.querySelector('#meta')
      this.#messageElement = this.shadowRoot.querySelector('#message')
    }

    /**
     * Set the text-content of meta-element to show username and time.
     *
     * @param {object} data - Object with username and timestamp.
     */
    setMeta (data) {
      const dateObject = new Date(data.time)
      const time = `${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}`
      this.#metaElement.textContent = `${data.username} ${time}`
    }
  })
