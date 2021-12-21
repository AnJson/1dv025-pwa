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

    #buttons {
      display: flex;
      gap: 2em;
    }

    .level-button {
      border: none;
      height: 100px;
      width: 100px;
      background-color: #eddb54;
      font-family: sans-serif;
      font-size: 1.9em;
      font-weight: 600;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, .2);
      cursor: pointer;
      transition: all 200ms;
    }

    .level-button:hover {
      background-color: #FFE000;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, .6);
    }

    .level-button.active {
      background-color: #FFE000;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, .6);
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

    #start-button {
      border: none;
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

    #start-button:hover {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
    }

    #start-button:disabled {
      background-color: #eddb54;
      cursor: default;
    }

    #start-button:disabled:hover {
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);

    }

    .hidden {
      display: none !important;
    }
  </style>
  <h1>Memory</h1>
  <div id="buttons">
    <button class="level-button" id="easy">2 x 2</button>
    <button class="level-button" id="medium">2 x 4</button>
    <button class="level-button active" id="hard">4 x 4</button>
  </div>
  <form id="start-form" autocomplete="off">
    <label for="nickname-input">
      <input type="text" id="nickname-input" />
    </label>
    <button id="start-button" disabled>Start game</button>
  </form>
`

customElements.define('memory-start',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The div-element holding the level-buttons.
     *
     * @type {HTMLElement}
     */
    #buttonsContainer

    /**
     * The form-element.
     *
     * @type {HTMLElement}
     */
    #startFormElement

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
    #startButtonElement

    /**
     * Attach shadow-dom and template.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#buttonsContainer = this.shadowRoot.querySelector('#buttons')
      this.#startFormElement = this.shadowRoot.querySelector('#start-form')
      this.#nicknameInputElement = this.shadowRoot.querySelector('#nickname-input')
      this.#startButtonElement = this.shadowRoot.querySelector('#start-button')

      this.#buttonsContainer.addEventListener('click', event => {
        event.stopPropagation()
        if (event.target !== this.#buttonsContainer) {
          this.#selectLevel(event.target)

          this.dispatchEvent(new CustomEvent('level-selected', {
            detail: {
              level: event.target.id
            }
          }))
        }
      })

      this.#nicknameInputElement.addEventListener('input', () => {
        this.#disableButtonHandler()
      })

      this.#startFormElement.addEventListener('submit', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('start-game', {
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
     * Toggle active, classes and dispatch 'level-selected'-event.
     *
     * @param {HTMLElement} element - The level-button element selected.
     */
    #selectLevel (element) {
      for (const levelButton of this.#buttonsContainer.children) {
        levelButton.classList.remove('active')
      }

      element.classList.add('active')
    }

    /**
     * Check if valid input in text-field and enable/disable the start-button.
     *
     */
    #disableButtonHandler () {
      if (this.#nicknameInputElement.value.trim() !== '') {
        if (this.#startButtonElement.hasAttribute('disabled')) {
          this.#startButtonElement.toggleAttribute('disabled')
        }
      } else {
        if (!this.#startButtonElement.hasAttribute('disabled')) {
          this.#startButtonElement.toggleAttribute('disabled')
        }
      }
    }
  })
