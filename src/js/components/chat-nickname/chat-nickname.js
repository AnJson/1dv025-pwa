const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 60em;
      font-size: 10px;
    }

    h1 {
      font-family: sans-serif;
      font-weight: 600;
      font-size: 8em;
      margin-bottom: 1em;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #FFE000;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, .9);
      margin-top: 0;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 60%;
      margin-top: 4em;
    }

    form label {
      width: 100%;
    }

    #nickname-input {
      width: 100%;
      border-radius: 6px;
      border: 3px solid #FFE000;
      text-align: center;
      padding: .5em 1em;
      font-weight: 600;
      box-sizing: border-box;
    }

    #nickname-input:focus {
      outline: none;
    }

    #submit-button {
      border: none;
      border-radius: 3px;
      background-color: #FFE000;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);
      padding: 1em 2em;
      margin-top: 3em;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms;
    }

    #submit-button:hover {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
    }

    #submit-button:disabled {
      background-color: #eddb54;
      cursor: default;
    }

    #submit-button:disabled:hover {
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);
    }

    .hidden {
      display: none !important;
    }
  </style>
  <form id="nickname-form" autocomplete="off">
    <label for="nickname-input">
      <input type="text" id="nickname-input" />
    </label>
    <button id="submit-button" disabled>Chat</button>
  </form>
`

customElements.define('chat-nickname',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The form-element.
     *
     * @type {HTMLElement}
     */
    #nicknameForm

    /**
     * The text-input element for nickname.
     *
     * @type {HTMLElement}
     */
    #nicknameInputElement

    /**
     * The star-button element.
     *
     * @type {HTMLElement}
     */
    #submitButton

    /**
     * Attach shadow-dom and template.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#nicknameForm = this.shadowRoot.querySelector('#nickname-form')
      this.#nicknameInputElement = this.shadowRoot.querySelector('#nickname-input')
      this.#submitButton = this.shadowRoot.querySelector('#submit-button')

      this.#nicknameInputElement.addEventListener('input', event => {
        event.stopPropagation()
        this.#disableButtonHandler()
      })

      this.#nicknameForm.addEventListener('submit', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('nickname-button-clicked', {
          detail: {
            nickname: this.#nicknameInputElement.value
          }
        }))
      })
    }

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['data-nickname']
    }

    /**
     * React on attribute-changed.
     *
     * @param {string} name - Name of attribute.
     * @param {string} oldVal - Attribute-value before change.
     * @param {string} newVal - Attribute-value after change.
     */
    attributeChangedCallback (name, oldVal, newVal) {
      if (oldVal !== newVal) {
        if (name === 'data-nickname') {
          this.#nicknameInputElement.value = newVal
        }
      }
    }

    /**
     * Check if valid input in text-field and enable/disable the submit-button.
     *
     */
    #disableButtonHandler () {
      if (this.#nicknameInputElement.value.trim() !== '') {
        if (this.#submitButton.hasAttribute('disabled')) {
          this.#submitButton.toggleAttribute('disabled')
        }
      } else {
        if (!this.#submitButton.hasAttribute('disabled')) {
          this.#submitButton.toggleAttribute('disabled')
        }
      }
    }
  })
